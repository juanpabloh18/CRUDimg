import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCTJMav9NZ41PvFUuBhKY9GTHyVc66rVX8",
  authDomain: "crudimg-b341a.firebaseapp.com",
  projectId: "crudimg-b341a",
  storageBucket: "crudimg-b341a.appspot.com",
  messagingSenderId: "783782490470",
  appId: "1:783782490470:web:f7940ff31b8426fc1898a7"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);