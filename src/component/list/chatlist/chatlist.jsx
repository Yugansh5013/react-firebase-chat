import "./chatlist.css"
import { useState } from "react"
import AddUser from "./addUser/addUser"
import {useUserStore} from "../../../lib/userStore"
import { useEffect } from "react"
import { onSnapshot } from "firebase/firestore"
import {doc,getDoc,updateDoc} from "firebase/firestore"
import {db} from "../../../lib/firebase"
import {useChatStore} from "../../../lib/chatsStore"

const Chatlist = () => {
    const [addMode,setAddMode]=useState(false)
    const [chats,setChats]=useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const{currentUser}=useUserStore()
    const{changeChat}=useChatStore()

    useEffect(() => {   
        const unsubscribe=onSnapshot(doc(db, "usersChats", currentUser.id),
        async (res) => {
          const items = res.data().chats;

           const ptomise=items.map(async (items )=>{
            const userDocSnap=await getDoc(doc(db,"users",items.receiverId))
            
            const user=userDocSnap.data()
            return{
                ...items,user
            }
           })
           const chatData=await Promise.all(ptomise)
           setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
        })

        return ()=>unsubscribe()
    },[currentUser.id])

    const filteredChats = chats.filter(chat => 
        chat.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handelselect=async (chat)=>{
        const userchatsRef=doc(db,"usersChats",currentUser.id)
        const userchatssnapshot=await getDoc(userchatsRef)
        if (userchatssnapshot.exists()){
        const userchatsData=userchatssnapshot.data()
        const chatIndex=userchatsData.chats.findIndex((c)=>c.chatId===chat.chatId)
        userchatsData.chats[chatIndex].isseen=true
        userchatsData.chats[chatIndex].updatedAt=Date.now()
        await updateDoc(userchatsRef,{
            chats:userchatsData.chats
        })                
        }
        changeChat(chat.chatId,chat.user)
    }

    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchbar">
                    <img src="./search.png" alt="" />
                    <input 
                        type="text" 
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <img className="plus" src={addMode?"./minus.png":"./plus.png"} alt="" onClick={()=>setAddMode((addMode)=>!addMode)}/>
            </div>
            {filteredChats.map((chat)=>( 
                <div className="item" key={chat.id} onClick={()=>handelselect(chat)} style={{backgroundColor:chat.isseen?"transparent":"#5183fe"}}>
                <img src={chat.user.avatar||"./avatar.png"} alt="" />
                <div className="texts">
                    <span>{chat.user.username}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
            ))}
            {addMode && <AddUser/>}
        </div>
    )
}

export default Chatlist