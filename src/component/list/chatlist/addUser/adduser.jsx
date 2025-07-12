import { collection,query,where,getDocs,setDoc,doc,serverTimestamp,updateDoc,arrayUnion } from "firebase/firestore"
import "./adduser.css"
import { useState } from "react"
import {db} from "../../../../lib/firebase.js"
import {useUserStore} from "../../../../lib/userStore.js"
const AddUser = () => {
    const {currentUser}=useUserStore()
    const [user,setUser]=useState(null)
   
    const handelSearch=async(e)=>{
        e.preventDefault()  
        const formData=new FormData(e.target)
        const username=formData.get("username")

        try {
            const userRef=collection(db,"users")
            const q=query(userRef,where("username","==",username))
            const querySnapshot=await getDocs(q)
            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
              }         
        } catch (error) {
            console.log(error) 
        }
    }
    const handelAdd=async()=>{

        const chatRef=collection(db,"chats")
        const userchatsRef=collection(db,"usersChats")
        try {
            const newchatRef=doc(chatRef);
            await setDoc(newchatRef,{
                createdAt:serverTimestamp(),
                messages:[]
            });
            
            await updateDoc(doc(userchatsRef,user.id),{
                chats:arrayUnion({
                    chatId: newchatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                })
            })
            await updateDoc(doc(userchatsRef,currentUser.id),{
                chats:arrayUnion({
                    chatId: newchatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="addUser">
           <form onSubmit={handelSearch}>
            <input type="text" placeholder="Username" name="username" />
            <button>Search</button>
           </form>
           {user && <div className="user">
            <div className="detail">
                <img src={user?.avatar||"./avatar.png"} alt="" />
                <div className="texts">
                    <span>{user?.username}</span>
                </div>
            </div>
            <button onClick={handelAdd}>Add</button>
           </div>}
        </div>
    )
}
export default AddUser