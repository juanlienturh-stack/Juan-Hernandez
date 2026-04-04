import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  orderBy, 
  limit, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export { 
  onAuthStateChanged, 
  signOut, 
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
  writeBatch
};
