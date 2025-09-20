import { auth, db, storage } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Auth functions
export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);

// Firestore functions
export const addData = (collectionName, data) => addDoc(collection(db, collectionName), data);
export const getData = (collectionName) => getDocs(collection(db, collectionName));
export const updateData = (collectionName, docId, data) => updateDoc(doc(db, collectionName, docId), data);
export const deleteData = (collectionName, docId) => deleteDoc(doc(db, collectionName, docId));

// Storage functions
export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};