import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "re-mern-estate.firebaseapp.com",
  projectId: "re-mern-estate",
  storageBucket: "re-mern-estate.appspot.com",
  messagingSenderId: "186809257491",
  appId: "1:186809257491:web:3d63455ff7be43180839e6",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
