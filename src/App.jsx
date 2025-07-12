import List from "./component/list/list"
import Chat from "./component/chat/chat"
import Details from "./component/details/details"
import Login from "./component/login/login"
import Notification from "./component/Notification/notification"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth} from "./lib/firebase"
import {useUserStore} from "./lib/userStore"
import {useChatStore} from "./lib/chatsStore"
const App = () => {
  const {currentUser,isLoading,fetchUser}=useUserStore()
  const{chatId}=useChatStore()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(user) => {
      if (user) {
        fetchUser(user?.uid);
      } else {
        fetchUser(null);
      }
    });
    return () => unsubscribe();
  }, [fetchUser]);

  if(isLoading){
    return <div className="loading">Loading...</div>
  }
  return (
    <div className="container">
      {currentUser ? (
        <>
          <List/>
          {chatId && <Chat/>}
          {chatId && <Details/>}
        </>
      ) : (
        <Login/>
      )}
      <Notification/>
    </div>
  )
}

export default App