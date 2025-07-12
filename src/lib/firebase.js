// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-518a3.firebaseapp.com",
  projectId: "react-chat-518a3",
  storageBucket: "react-chat-518a3.firebasestorage.app",
  messagingSenderId: "646461205814",
  appId: "1:646461205814:web:c50e4766b0385176fb5797",
  measurementId: "G-8XB8QLWGF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
