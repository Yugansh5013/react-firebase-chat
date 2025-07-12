import "./login.css"
import { useState } from "react"
import { toast } from "react-toastify"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth"
import {auth,db} from "../../lib/firebase"
import {setDoc,doc} from "firebase/firestore"
import uploadFile from "../../lib/upload"
const Login = () => {
    const [avatar,setAvatar]=useState({
        file:null,
        url:""
    })
    const [loading,setLoading]=useState(false)
    const handleAvatar = (e) => {
        if (e.target.files[0]) {
          setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0]),
          });
        }
    }
    const handelRegister= async(e)=>{
        e.preventDefault()
        const formData=new FormData(e.target)
        const{username,email,password}=Object.fromEntries(formData.entries())
        
        try{
            setLoading(true)
            const res=await createUserWithEmailAndPassword(auth,email,password)
            const imgUrl=await uploadFile(avatar.file)

            await setDoc(doc(db,"users",res.user.uid),{
                username,
                email,
                id:res.user.uid,
                avatar:imgUrl,
                blocked:[],
            })
            await setDoc(doc(db,"usersChats",res.user.uid),{
                chats:[],
            })
            
            setLoading(false)            
            toast.success("Account created successfully")
            
        }
        catch(error){
            setLoading(false)
            console.log(error)
            toast.error(error.message)
        }
    }
    const handleLogin= async(e)=>{
        e.preventDefault()
        setLoading(true)
        const formData=new FormData(e.target)
        const{email,password}=Object.fromEntries(formData.entries())
        try{
            await signInWithEmailAndPassword(auth,email,password)
            setLoading(false)
            toast.success("Login successful")
        }
        catch(error){
            setLoading(false)
            console.log(error)
            toast.error(error.message)
        }
    }
    return (
        <div className="login">
            <div className="item">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
                <h2>Sign Up</h2>
                <form onSubmit={handelRegister}>
                <label htmlFor="file">
                    <img src={avatar.url || "./avatar.png"} alt="" />
                    Upload an image
                </label>
                    <input type="file" id="file" name="file" style={{display:"none"}} onChange={handleAvatar}/>
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}
export default Login
