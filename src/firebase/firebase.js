
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { ref } from 'vue';

const firebaseConfig = {
  apiKey: "AIzaSyCN_RBJ9B1nvB0WweJ2QwsFe9a4ckCPXq4",
  authDomain: "quasar-diaryfs.firebaseapp.com",
  projectId: "quasar-diaryfs",
  storageBucket: "quasar-diaryfs.firebasestorage.app",
  messagingSenderId: "453824538145",
  appId: "1:453824538145:web:8cf4dbfa782dee95fb2560"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const user = ref(auth.currentUser);

let resolveAuthReady;
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});
let authInitialized = false;

onAuthStateChanged(auth, (authUser) => {
  user.value = authUser;
  if (!authInitialized) {
    authInitialized = true;
    resolveAuthReady(authUser);
  }
});

export{
  db,
  auth,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  storage,
  authReady,
  updatePassword,
  updateProfile,
  user,
};




