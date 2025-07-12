import {create} from "zustand"
import {getDoc,doc} from "firebase/firestore"
import {db} from "./firebase"
export const useUserStore=create((set)=>({
    currentUser:null,
    isLoading:true,

    fetchUser: async(uid)=>{
        if(!uid){
            return set({currentUser:null,isLoading:false})
        }
        try{
            const docRef=doc(db,"users",uid)
            const user=await getDoc(docRef)
            if(user.exists()){
                set({currentUser:user.data(),isLoading:false})
            }
            else{
                set({currentUser:null,isLoading:false})
            }
        }
        catch(error){
            console.log(error)
            set({currentUser:null,isLoading:false})
        }
    },
    
}))
