import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDaG-HcaDE7DMTVc6DBdn0I4HXwbxI_X9o",
    authDomain: "react-blogs-app-8ff34.firebaseapp.com",
    projectId: "react-blogs-app-8ff34",
    storageBucket: "react-blogs-app-8ff34.appspot.com",
    messagingSenderId: "324508911335",
    appId: "1:324508911335:web:ff9626c291e7fa8c97c442"
  };
  
  const app=initializeApp(firebaseConfig);
  const auth=getAuth(app);
  const db=getFirestore(app);
  const storage=getStorage(app);

  export {auth,db,storage};