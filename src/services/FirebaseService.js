// FirebaseService.js — SCAFFOLD ONLY
// Teammate 3 (or designated): Implement all TODO sections
// Firebase Spark Plan Free Limits:
//   Firestore: 1GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
//   Storage: 5GB storage, 1GB/day download
//   Auth: Unlimited users

import { db, storage, auth } from './firebase.config.js'; // Agent creates this config file

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
    // TODO (Teammate 3/Firebase):
    // 1. Import addDoc, collection, serverTimestamp from 'firebase/firestore'
    // 2. Target collection: db, 'users', userId, 'documents'
    // 3. Document shape:
    //    { name: documentName, createdAt: serverTimestamp(), summary: result.summary,
    //      redFlags: result.redFlags, keyTerms: result.keyTerms, documentType: result.documentType }
    // 4. Return the new document's .id

    throw new Error('TODO: FirebaseService.saveDocumentToHistory not implemented');
}

/**
 * Retrieves all documents in the user's history, ordered by date.
 * @param {string} userId
 * @returns {Promise<HistoryItem[]>}
 */
export async function getDocumentHistory(userId) {
    // TODO: query collection ordered by createdAt desc, limit 50
    throw new Error('TODO: FirebaseService.getDocumentHistory not implemented');
}

/**
 * Deletes a document from the user's history.
 * @param {string} userId
 * @param {string} documentId
 */
export async function deleteDocument(userId, documentId) {
    // TODO: deleteDoc(doc(db, 'users', userId, 'documents', documentId))
    throw new Error('TODO: FirebaseService.deleteDocument not implemented');
}

/**
 * Sets or updates the user's auto-delete preference in Firestore.
 * @param {string} userId
 * @param {7|14|30|60|90} days - Auto-delete interval in days
 */
export async function setAutoDeletePreference(userId, days) {
    // TODO: setDoc to 'users/{userId}/settings/preferences' with { autoDeleteDays: days }
    throw new Error('TODO: FirebaseService.setAutoDeletePreference not implemented');
}
