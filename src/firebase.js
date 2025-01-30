// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// These credentials are safe to be in the client because Firebase Security Rules
// will prevent unauthorized direct database access
const firebaseConfig = {
  apiKey: "AIzaSyDwWM-qEpVgeEX2_s3yYJIDeRCV_h88KyE",
  authDomain: "alpha-calls.firebaseapp.com",
  databaseURL: "https://alpha-calls-default-rtdb.firebaseio.com",
  projectId: "alpha-calls",
  storageBucket: "alpha-calls.firebasestorage.app",
  messagingSenderId: "810065506354",
  appId: "1:810065506354:web:ab1314e6db3b25390c8c2b",
  measurementId: "G-1G8FN187H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
