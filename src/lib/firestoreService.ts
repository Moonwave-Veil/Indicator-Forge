import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  addDoc,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Session, ScriptProject, ScriptVersion, ChatMessage } from '../types';

export const firestoreService = {
  // Sessions
  subscribeToSessions(userId: string, callback: (sessions: Session[]) => void) {
    const path = `users/${userId}/sessions`;
    const q = query(collection(db, path), orderBy('updatedAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
      callback(sessions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async createSession(userId: string, session: Omit<Session, 'id'>) {
    const path = `users/${userId}/sessions`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...session,
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateSession(userId: string, sessionId: string, updates: Partial<Session>) {
    const path = `users/${userId}/sessions/${sessionId}`;
    try {
      await updateDoc(doc(db, path), {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Messages
  subscribeToMessages(userId: string, sessionId: string, callback: (messages: ChatMessage[]) => void) {
    const path = `users/${userId}/sessions/${sessionId}/messages`;
    const q = query(collection(db, path), orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      callback(messages);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addMessage(userId: string, sessionId: string, message: Omit<ChatMessage, 'id'>) {
    const path = `users/${userId}/sessions/${sessionId}/messages`;
    try {
      await addDoc(collection(db, path), message);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Projects
  subscribeToProjects(userId: string, callback: (projects: ScriptProject[]) => void) {
    const path = `users/${userId}/projects`;
    const q = query(collection(db, path), orderBy('updatedAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScriptProject));
      callback(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async saveProject(userId: string, project: Omit<ScriptProject, 'id'>) {
    const path = `users/${userId}/projects`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...project,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
