import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCNSedteHOAq29U01OecqjZzhql0bKBL14",
  authDomain: "zokhrim-yachad.firebaseapp.com",
  projectId: "zokhrim-yachad",
  storageBucket: "zokhrim-yachad.firebasestorage.app",
  messagingSenderId: "953568034205",
  appId: "1:953568034205:web:31f3ac4c35bed184450374",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
