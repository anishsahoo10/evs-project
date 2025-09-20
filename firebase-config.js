// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBxuUuIabTyxNP5I75nrwpzyBhpa9v1qYg",
  authDomain: "urban-garden-afb64.firebaseapp.com",
  projectId: "urban-garden-afb64",
  storageBucket: "urban-garden-afb64.firebasestorage.app",
  messagingSenderId: "551109183538",
  appId: "1:551109183538:web:e05fad7a5acf96b9b7142b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);