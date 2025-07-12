import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import {db} from "../../lib/firebase"
import {doc,onSnapshot  ,updateDoc,arrayUnion,getDoc} from "firebase/firestore"
import {useChatStore} from "../../lib/chatsStore"
import {useUserStore} from "../../lib/userStore"
import upload from "../../lib/upload";
const Chat = () => {
    const [showEmojiPicker,setShowEmojiPicker]=useState(false)
    const{currentUser}=useUserStore()
    const [message,setMessage]=useState("")
    const endRef=useRef(null)
    const [chats,setChats]=useState([])
    const [text,settext]=useState("")
    const [img,setImg]=useState({file:null,url:""})
    const{chatId,user,isReceiverBlocked,isCurrentUserBlocked,}=useChatStore()
    const handleEmojiClick=(e)=>{
        setMessage((prev)=>prev+e.emoji)
        setShowEmojiPicker(false)
    }
    useEffect(()=>{
        endRef.current.scrollIntoView({
            behavior:"smooth"
        })
    },[message])

    useEffect(()=>{
        const unsubscribe=onSnapshot(doc(db,"chats",chatId),
        async (res) => {
          const items = res.data() ;
          setChats(items)
        })

        return ()=>unsubscribe()
    },[chatId]) 
    
    const handelSend=async ()=>{
     if(text==="") return
         
        let imgUrl = img.url;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
                senderId: currentUser.id,
                text,
                createdAt: new Date(),
                ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userID=[currentUser.id,user.id]

            userID.forEach(async(id)=>{
                const userchatsRef=doc(db,"usersChats",id)
                const userchatssnapshot=await getDoc(userchatsRef)
                if (userchatssnapshot.exists()){
                const userchatsData=userchatssnapshot.data()
                const chatIndex=userchatsData.chats.findIndex((chat)=>chat.chatId===chatId)
                userchatsData.chats[chatIndex].lastMessage=text
                userchatsData.chats[chatIndex].isseen=user.id===currentUser.id?true:false
                userchatsData.chats[chatIndex].updatedAt=Date.now()
                await updateDoc(userchatsRef,{
                    chats:userchatsData.chats
                })
                }
            })
            settext("")
            setImg({file:null,url:""})
         }
    catch(error){
        console.log(error)
    }
    }

    const handelImg=(e)=>{
        if(e.target.files[0]){
            setImg({
                file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }
    
    
    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>lore ipsum dolor sit a.</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chats?.messages?.map((message)=>(
                    <div className={message.senderId===currentUser.id?"message-own":"message"} key={message?.createdAt}>
                    <div className="texts">
                        {message.img && <img src={message.img} alt="" />}
                        <p>{message.text}</p>
                        <span>{message?.updatedAt}</span>
                    </div>
                </div>
                ))}
                {img.url && <div className="message-own">
                    <text><img src={img.url} alt="" />
                    </text>
                </div>}
                <div ref={endRef}></div>
            </div>
            
            <div className="bottom">
                <div className="icon">
                    <input type="file" id="file" style={{display:"none"}} onChange={handelImg}/>
                    <label htmlFor="file"><img src="./img.png" alt="" /></label>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" 
                placeholder={isReceiverBlocked || isCurrentUserBlocked ? "You cannot send messages" : "Type a message.."} 
                value={text} disabled={isReceiverBlocked || isCurrentUserBlocked} onChange={(e)=>settext(e.target.value)} onKeyPressCapture={(e)=> e.key === 'Enter' && handelSend()} />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={()=>setShowEmojiPicker(!showEmojiPicker)}/>
                   <div className="picker">
                    <EmojiPicker open={showEmojiPicker} onEmojiClick={handleEmojiClick}/>
                   </div>
                </div>
                <button className="send" onClick={handelSend} disabled={isReceiverBlocked || isCurrentUserBlocked}>Send</button>
            </div>
            
        </div>
    )
}

export default Chat
