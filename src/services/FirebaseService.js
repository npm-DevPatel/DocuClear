// FirebaseService.js — SCAFFOLD ONLY
// Teammate 3 (or designated): Implement all TODO sections
// Firebase Spark Plan Free Limits:
//   Firestore: 1GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
//   Storage: 5GB storage, 1GB/day download
//   Auth: Unlimited users

import { db } from './firebase.config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

/*
FIRESTORE SECURITY RULES — Deploy these in Firebase Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Shared documents are publicly readable, but only the owner can write
    match /sharedDocuments/{shareId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
*/

/**
 * Saves a simplified document result to the user's Firestore history.
 * @param {string} userId - Firebase Auth UID
 * @param {SimplificationResult} result - The result from GeminiService
 * @param {string} documentName - Original file name
 * @returns {Promise<string>} Firestore document ID
 */
export async function saveDocumentToHistory(userId, result, documentName) {
  try {
    const historyRef = collection(db, 'users', userId, 'documents');
    const docRef = await addDoc(historyRef, {
      name: documentName,
      createdAt: serverTimestamp(),
      summary: result.summary,
      redFlags: result.redFlags,
      keyTerms: result.keyTerms,
      documentType: result.documentType
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving document to history:", error);
    throw error;
  }
}

/**
 * Retrieves all documents in the user's history, ordered by date.
 * @param {string} userId
 * @returns {Promise<HistoryItem[]>}
 */
export async function getDocumentHistory(userId) {
  try {
    const historyRef = collection(db, 'users', userId, 'documents');
    const q = query(historyRef, orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching document history:", error);
    throw error;
  }
}

/**
 * Deletes a document from the user's history.
 * @param {string} userId
 * @param {string} documentId
 */
export async function deleteDocument(userId, documentId) {
  try {
    const docRef = doc(db, 'users', userId, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

/**
 * Sets or updates the user's auto-delete preference in Firestore.
 * @param {string} userId
 * @param {7|14|30|60|90} days - Auto-delete interval in days
 */
export async function setAutoDeletePreference(userId, days) {
  try {
    const userSettingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    await setDoc(userSettingsRef, { autoDeleteDays: days }, { merge: true });
  } catch (error) {
    console.error("Error setting auto-delete preference:", error);
    throw error;
  }
}
