// src/services/FirebaseService.js
// Antigravity Agent — Implemented per AI_Implementation_Plan.md §5.2
// Firebase Spark Plan Free Limits:
//   Firestore: 1GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
//   Storage: 5GB storage, 1GB/day download
//   Auth: Unlimited users

import {
  collection, addDoc, query, orderBy, limit,
  getDocs, serverTimestamp, doc, setDoc, deleteDoc, getDoc,
} from 'firebase/firestore';
import { db, storage, auth } from './firebase.config.js';

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

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT HISTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Saves a simplified document result to the user's Firestore history.
 * @param {string} userId - Firebase Auth UID
 * @param {Object} result - The result from GeminiService
 * @param {string} documentName - Original file name
 * @returns {Promise<string>} Firestore document ID
 */
export async function saveDocumentToHistory(userId, result, documentName) {
  const colRef = collection(db, 'users', userId, 'documents');
  const docRef = await addDoc(colRef, {
    name: documentName,
    createdAt: serverTimestamp(),
    summary: result.summary,
    redFlags: result.redFlags,
    keyTerms: result.keyTerms,
    nextSteps: result.nextSteps || [],
    documentType: result.documentType,
    originalLength: result.originalLength,
    simplifiedLength: result.simplifiedLength,
  });
  return docRef.id;
}

/**
 * Retrieves all documents in the user's history, ordered by date.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getDocumentHistory(userId) {
  const colRef = collection(db, 'users', userId, 'documents');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Deletes a document from the user's history.
 * @param {string} userId
 * @param {string} documentId
 */
export async function deleteDocument(userId, documentId) {
  await deleteDoc(doc(db, 'users', userId, 'documents', documentId));
}

/**
 * Sets or updates the user's auto-delete preference in Firestore.
 * @param {string} userId
 * @param {7|14|30|60|90} days - Auto-delete interval in days
 */
export async function setAutoDeletePreference(userId, days) {
  await setDoc(
    doc(db, 'users', userId, 'settings', 'preferences'),
    { autoDeleteDays: days },
    { merge: true }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT HISTORY — §5.2
// Path: users/{userId}/documents/{documentId}/messages/{messageId}
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Saves a chat message to Firestore for a specific document session.
 * Called after EVERY message (user and assistant) in ChatPage.jsx.
 *
 * @param {string} userId - Firebase Auth UID
 * @param {string} documentId - Firestore document ID from the analyzed document
 * @param {{ role: 'user'|'assistant', content: string }} message
 * @param {'en'|'sw'} language - Active language at time of message
 * @returns {Promise<string>} Firestore message document ID
 */
export async function saveChatMessage(userId, documentId, message, language = 'en') {
  const messagesRef = collection(db, 'users', userId, 'documents', documentId, 'messages');
  const docRef = await addDoc(messagesRef, {
    role: message.role,
    content: message.content,
    language,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Retrieves the last N chat messages from Firestore for memory injection.
 * Called by useDocumentPipeline.js before each askDocumentQuestion() call.
 *
 * @param {string} userId
 * @param {string} documentId
 * @param {number} limitCount - How many recent messages to fetch (default: 5)
 * @returns {Promise<Array<{role: string, content: string}>>}
 */
export async function getRecentChatHistory(userId, documentId, limitCount = 5) {
  const messagesRef = collection(db, 'users', userId, 'documents', documentId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);

  // Reverse to get chronological order (oldest first, for context injection)
  return snapshot.docs
    .map(d => ({ role: d.data().role, content: d.data().content }))
    .reverse();
}
