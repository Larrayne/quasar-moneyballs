import { nextTick } from 'vue';
import {
  auth,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'src/firebase/firebase';

// Register user function
function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return sendEmailVerification(user).then(() => user);
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
    await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Password reset error:", error.message);
        throw new Error(error.message);
    }
};

// Authentication check
const isAuthenticated = () => {
  return !!auth.currentUser;
};

const changePassword = async (currentPassword, newPassword) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('User not authenticated.');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error('Error changing password', error.message);
    throw new Error(error.message || 'Error changing password');
  }
};

const toggle2FA = async () => {
  throw new Error('Two-factor authentication is not configured for this project yet.');
};

const deleteUserAccount = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }

    await deleteUser(currentUser);
  } catch (error) {
    console.error('Error deleting account', error.message);
    throw new Error(error.message || 'Error deleting account');
  }
};


// Export the functions in an object
export const useAuth = () => {
  return { toggle2FA, changePassword, deleteUserAccount, registerUser, loginUser, logout, resetPassword, isAuthenticated };
};
