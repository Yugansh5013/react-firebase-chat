import { ref } from "firebase/storage"
import { uploadBytesResumable } from "firebase/storage"
import { storage } from "./firebase"
import {getDownloadURL} from "firebase/storage"
const uploadFile=async(file)=>{

    const date=new Date().getTime()

    const storageRef=ref(storage,`images/${date+file.name}`)
    const uploadTask=uploadBytesResumable(storageRef,file)

    return new Promise((resolve,reject)=>{
    uploadTask.on(
        "state_changed",
        (snapshot)=>{
            const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log("upload is"+progress+"% done")
            switch(snapshot.state){
                case "RUNNING":
                    console.log("upload is running")
                    break;
                case "PAUSED":
                    console.log("upload is paused")
                    break;
                case "SUCCESS":
                    console.log("upload is success")
                    break;
                case "CANCELLED":
                    console.log("upload is cancelled")
                    break;
            }
        },
        (error)=>{
            reject("somthing went wrong"+ error.code)
            console.log(error)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                resolve(url)
            })
        }
    )
})
}
export default uploadFile
