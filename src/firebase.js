import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { db, realtimeDb, analytics };
