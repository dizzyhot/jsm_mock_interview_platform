// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5b03QJ4dy3wT8CkzdAUogk69wV9M21ic",
  authDomain: "prepwise-170bb.firebaseapp.com",
  projectId: "prepwise-170bb",
  storageBucket: "prepwise-170bb.firebasestorage.app",
  messagingSenderId: "349548627177",
  appId: "1:349548627177:web:b0c97a8f345a6982d01c78",
  measurementId: "G-R0W0GFNP7F",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
