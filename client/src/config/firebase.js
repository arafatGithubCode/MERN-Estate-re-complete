import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "resort-dc0b1.firebaseapp.com",
  projectId: "resort-dc0b1",
  storageBucket: "resort-dc0b1.appspot.com",
  messagingSenderId: "454837865268",
  appId: "1:454837865268:web:bc9adf9418b726edc47361",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
