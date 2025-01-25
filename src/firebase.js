import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // You'll need to replace these with your Firebase project credentials
  apiKey: "YOUR_API_KEY",
  authDomain: "mine-lottery.firebaseapp.com",
  projectId: "mine-lottery",
  storageBucket: "mine-lottery.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
