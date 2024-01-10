import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-39a22.firebaseapp.com",
  projectId: "mern-estate-39a22",
  storageBucket: "mern-estate-39a22.appspot.com",
  messagingSenderId: "515585819138",
  appId: "1:515585819138:web:38e26108cea4741bc69d1b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
