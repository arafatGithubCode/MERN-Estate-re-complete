import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realtor-58dc2.firebaseapp.com",
  projectId: "realtor-58dc2",
  storageBucket: "realtor-58dc2.appspot.com",
  messagingSenderId: "754866600935",
  appId: "1:754866600935:web:ebe1e8cec899635c3b5b42",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
