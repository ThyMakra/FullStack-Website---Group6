import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

import { authentication, firestoreDb } from "../firebase";


const COLLECTION_NAME = "ingredeck";
const COLLECTION_REF = collection(firestoreDb, COLLECTION_NAME);

const storeUser = async (user) => {
  const docRef = doc(COLLECTION_REF, user.uid);
  const userDoc = await getDoc(docRef);

  if (!userDoc.exists()) {
    await setDoc(docRef, {
      emailAddress: user.email,
      verified: user.emailVerified
    });
  }
}

export const AuthService = {
  waitForUser: (callback) => {
    return onAuthStateChanged(authentication, (userInfo) => {
      callback(userInfo);
    });
  },

  registerWithEmailPassword: async(email, password) => {
    try {
      const userInfo = await createUserWithEmailAndPassword(authentication, email, password)
      const user = userInfo.user
      await storeUser(user)

      return {user}
    } catch(e) {
      return {
        error: e.message
      }
    }
  },

  loginWithEmailPassword: async(email, password) => {
    try {
      const userInfo = await signInWithEmailAndPassword(authentication, email, password)
      const user = userInfo.user
      await storeUser(user)

      return {user}
    } catch(e) {
      return {
        error: e.message
      }
    }
  },

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    try {
        const userInfo = await signInWithPopup(authentication, provider);
        const user = userInfo.user;
        await storeUser(user);

        return {
          user: user
        }
    } catch (e) {
      return {
        error: e.message,
      }
    }
  },
  logout: async () => await signOut(authentication),
  getDocument: async (user) => {
    const userDoc = await getDoc(doc(COLLECTION_REF, user.uid));
    return userDoc.data();
  },
  mergeDocument: async (user, bookmarkList) => {
    await setDoc(doc(COLLECTION_REF, user.uid), {
      bookmarks: bookmarkList
    }, { merge: true });
  },
}
