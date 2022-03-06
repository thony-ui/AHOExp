// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFGX1FRvqUpObkhNwo3L1fUmiIFK4hDKo",
  authDomain: "ahoexpenses.firebaseapp.com",
  projectId: "ahoexpenses",
  storageBucket: "ahoexpenses.appspot.com",
  messagingSenderId: "186012380414",
  appId: "1:186012380414:web:111dbdf5ae8420f43849af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export {auth, db}