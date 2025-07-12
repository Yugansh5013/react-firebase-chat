import "./details.css"
import { auth } from "../../lib/firebase"
import {useChatStore} from "../../lib/chatsStore"
import {updateDoc,doc,arrayUnion,arrayRemove} from "firebase/firestore"
import {db} from "../../lib/firebase"
import {useUserStore} from "../../lib/userStore"
const Details = () => {
    const{user,isReceiverBlocked,isCurrentUserBlocked,chatId,changeBlock}=useChatStore()
    const{currentUser}=useUserStore()
    const handleBlock = async () => {
        if (!user) return;
    
        const userDocRef = doc(db, "users", currentUser.id);
    
        try {
          await updateDoc(userDocRef, {
            blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
          });
          changeBlock();
        } catch (err) {
          console.log(err);
        }
      };
    return (
        <div className="details">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <div className="texts">
                    <h2>{user?.username}</h2>
                    <p>lore ipsum dolor sit a.</p>
                </div>
            </div>
            <div className="info">
                <div className="options">
                    <title className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </title>
                </div>
                <div className="options">
                    <title className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </title>
                </div>
                <div className="options">
                    <title className="title">
                        <span>Sheared Photo</span>
                        <img src="./arrowDown.png" alt="" />
                    </title>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetails">
                                <img src="./bg.jpg" alt="" />
                                <span>photo-2025.jpg</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetails">
                                <img src="./bg.jpg" alt="" />
                                <span>photo-2025.jpg</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetails">
                                <img src="./bg.jpg" alt="" />
                                <span>photo-2025.jpg</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                    </div>
                </div>
                <div className="options">
                    <title className="title">
                        <span>Sheared Files</span>
                        <img src="./arrowDown.png" alt="" />
                    </title>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked
                        ? "You are Blocked!"
                        : isReceiverBlocked
                        ? "User blocked"
                        : "Block User"}
                </button>
                <button className="logout" onClick={()=>auth.signOut()}>Log Out</button>
            </div>
        </div>
    )
}

export default Details