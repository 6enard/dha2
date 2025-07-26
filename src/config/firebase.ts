// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqZvECrRCzgJ7mZI9WwC1gVGXXjLaKJxI",
  authDomain: "dha-application-ad082.firebaseapp.com",
  projectId: "dha-application-ad082",
  storageBucket: "dha-application-ad082.firebasestorage.app",
  messagingSenderId: "973280178115",
  appId: "1:973280178115:web:5c0a9612ab64bc27a4d776",
  measurementId: "G-MFJTB5JB24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;