
import { initializeApp } from 'firebase/app';
import { getFirestore,doc, setDoc, getDoc } from 'firebase/firestore';
import {sendPasswordResetEmail, onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref,onMounted, computed} from 'vue';
import { getStorage } from 'firebase/storage';

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

const user = ref(null);



onAuthStateChanged(auth, (authUser) => {
  user.value = authUser; // This updates the user ref when the auth state changes
});

export async function saveEntry(userId, entryData) {
  const userDocRef = doc(db, 'users', userId)
  await setDoc(userDocRef, {entryData}, {merge: true})
  console.log("Entry save for user", userId)
}

export async function getUserEntries(userId) {
  const userDocRef = doc(db, "users", userId)
  const docSnap = await getDoc(userDocRef)
  if(docSnap.exists()){
    console.log("User entries: ", docSnap.data())
  }else{
    console.log("No entries found for user.")
  }
}

const saveSettings = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        themeColor: themeColor.value,
        fontSize: fontSize.value,
        fontStyle: fontStyle.value,
        journalView: journalView.value
      }, { merge: true });
      alert("Settings saved successfully!");
    }
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};



onMounted(async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        themeColor.value = data.themeColor || 'light';
        fontSize.value = data.fontSize || 'medium';
        fontStyle.value = data.fontStyle || 'Arial';
        journalView.value = data.journalView || 'list';
      }
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
});

const updateProfile = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { displayName: displayName.value }, { merge: true });
      alert('Profile updated successfully');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile');
  }
};

const entryStyle = computed(() => ({
  fontSize: fontSize.value === 'small' ? '14px' : fontSize.value === 'large' ? '18px' : '16px',
  fontFamily: fontStyle.value
}));


export{
  db,
  auth, 
  user,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  storage,
  saveSettings,
  updateProfile,
  entryStyle

};




