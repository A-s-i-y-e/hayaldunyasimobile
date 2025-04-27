import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyBZd34mxld_RxluU34LrvBBRO8trt3PFXo",
  authDomain: "hayal-dunyasi.firebaseapp.com",
  projectId: "hayal-dunyasi",
  storageBucket: "hayal-dunyasi.firebasestorage.app",
  messagingSenderId: "875624820974",
  appId: "1:875624820974:web:471a827e14117b441c83ff",
  measurementId: "G-4JEQEPKFQ4",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth servisini başlat
const auth = getAuth(app);

// Firestore servisini başlat
const db = getFirestore(app);

export { auth, db };
