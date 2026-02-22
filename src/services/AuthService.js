import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase.config.js';

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
}

export async function signInWithEmail(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export async function createAccount(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name if provided
    if (displayName) {
        await updateProfile(user, { displayName });
    }

    return user;
}

export async function signOut() {
    return await firebaseSignOut(auth);
}

export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}
