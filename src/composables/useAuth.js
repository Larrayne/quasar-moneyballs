// Import required Firebase methods and modules
import { nextTick } from 'vue';
import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'src/firebase/firebase'; 
import { sendEmailVerification } from 'firebase/auth';


// Get Firebase authentication instance
// const auth = getAuth();

// Register user function
function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sendEmailVerification(user).then(() => {
        console.log("Verification email sent to:", user.email);
      });
      console.log("User registered:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        throw new Error('This email is already registered.');
      } else if (errorCode === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else {
        throw new Error(error.message);
      }
    });
}

// Login user function
function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }
      console.log("User logged in:", user);
      return user;
    })
    .catch((error) => {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        throw new Error("Invalid email or password.");
      } else {
        console.error("Login error:", error.message);
        throw error;
      }
    });
}

// Logout user function
const logout = async (router) => {
    try {
        await signOut(auth);
        await nextTick(() => router.push('/')); // Redirect to home page after logout
    } catch (error) {
        console.error("Error logging out", error.message);
    }
};

// Password reset function
const resetPassword = async (email) => {
    try {
        const user = auth.currentUser;
        if (user && user.email === email) {
            await sendPasswordResetEmail(auth, email);
        }
    } catch (error) {
        console.error("Password reset error:", error.message);
        throw new Error(error.message);
    }
};

// Authentication check
const isAuthenticated = () => {
  return !!auth.currentUser;
};

const changePassword = async () => {
  try {
    await changeUserPassword(newPassword.value);
    alert('Password changed successfully');
  } catch (error) {
    console.error(error);
    alert('Error changing password');
  }
};

const toggle2FA = async () => {
  try {
    await enableTwoFactorAuth(twoFactorEnabled.value);
  } catch (error) {
    console.error(error);
  }
};


// Export the functions in an object
export const useAuth = () => {
    return { toggle2FA,changePassword,registerUser, loginUser, logout, resetPassword, isAuthenticated };
};
