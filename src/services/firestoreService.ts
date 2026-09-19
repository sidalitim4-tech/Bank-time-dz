import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Volunteer, ActivityOpportunity, TimeTransaction, Perk, Certificate, AppNotification } from '../types';
import {
  INITIAL_VOLUNTEERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_TRANSACTIONS,
  INITIAL_PERKS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

// Collection Paths
const VOLUNTEERS_COLLECTION = 'volunteers';
const OPPORTUNITIES_COLLECTION = 'opportunities';
const TRANSACTIONS_COLLECTION = 'transactions';
const PERKS_COLLECTION = 'perks';
const CERTIFICATES_COLLECTION = 'certificates';
const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Seeds initial mock data to Firestore if collections are empty, and cleans up any old mock volunteers.
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    // 1. Clean up any previously seeded mock volunteers from Firestore
    try {
      const volSnap = await getDocs(collection(db, VOLUNTEERS_COLLECTION));
      const mockVolIds = ['vol-1', 'vol-2', 'vol-3', 'vol-4'];
      for (const docSnap of volSnap.docs) {
        if (mockVolIds.includes(docSnap.id)) {
          await deleteDoc(doc(db, VOLUNTEERS_COLLECTION, docSnap.id));
        }
      }

      // Also clean up mock sample transactions
      const txSnap = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
      const mockTxIds = ['tx-1', 'tx-2', 'tx-3', 'tx-4', 'tx-5', 'tx-6'];
      for (const docSnap of txSnap.docs) {
        if (mockTxIds.includes(docSnap.id)) {
          await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, docSnap.id));
        }
      }

      // Clean up mock cert
      const certSnap = await getDocs(collection(db, CERTIFICATES_COLLECTION));
      for (const docSnap of certSnap.docs) {
        if (docSnap.id === 'cert-1') {
          await deleteDoc(doc(db, CERTIFICATES_COLLECTION, docSnap.id));
        }
      }
    } catch (cleanErr) {
      console.warn('Mock cleanup note:', cleanErr);
    }

    const opSnap = await getDocs(collection(db, OPPORTUNITIES_COLLECTION));
    if (opSnap.empty) {
      for (const op of INITIAL_OPPORTUNITIES) {
        await setDoc(doc(db, OPPORTUNITIES_COLLECTION, op.id), op);
      }
    }

    const perkSnap = await getDocs(collection(db, PERKS_COLLECTION));
    if (perkSnap.empty) {
      for (const perk of INITIAL_PERKS) {
        await setDoc(doc(db, PERKS_COLLECTION, perk.id), perk);
      }
    }

    const notifSnap = await getDocs(collection(db, NOTIFICATIONS_COLLECTION));
    if (notifSnap.empty) {
      for (const notif of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notif.id), notif);
      }
    }
  } catch (error) {
    console.warn('Initial Firestore seed check completed or restricted by security rules:', error);
  }
}

/**
 * Permanently delete all volunteer names and records from Firestore
 */
export async function clearAllVolunteersFromDatabase(): Promise<void> {
  try {
    const volSnap = await getDocs(collection(db, VOLUNTEERS_COLLECTION));
    for (const docSnap of volSnap.docs) {
      await deleteDoc(doc(db, VOLUNTEERS_COLLECTION, docSnap.id));
    }
    const txSnap = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
    for (const docSnap of txSnap.docs) {
      await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, docSnap.id));
    }
  } catch (err) {
    console.error('Error clearing volunteers from database:', err);
  }
}

/**
 * Subscribe to Volunteers in real-time
 */
export function subscribeVolunteers(
  onUpdate: (volunteers: Volunteer[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, VOLUNTEERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Volunteer[] = [];
      const mockIds = ['vol-1', 'vol-2', 'vol-3', 'vol-4'];
      snapshot.forEach((docSnap) => {
        if (!mockIds.includes(docSnap.id)) {
          items.push(docSnap.data() as Volunteer);
        }
      });
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, VOLUNTEERS_COLLECTION);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );
}

/**
 * Subscribe to Opportunities in real-time
 */
export function subscribeOpportunities(
  onUpdate: (ops: ActivityOpportunity[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, OPPORTUNITIES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: ActivityOpportunity[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ActivityOpportunity);
      });
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, OPPORTUNITIES_COLLECTION);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );
}

/**
 * Subscribe to Transactions in real-time
 */
export function subscribeTransactions(
  onUpdate: (txs: TimeTransaction[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, TRANSACTIONS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: TimeTransaction[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as TimeTransaction);
      });
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, TRANSACTIONS_COLLECTION);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );
}

/**
 * Subscribe to Perks in real-time
 */
export function subscribePerks(
  onUpdate: (perks: Perk[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, PERKS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Perk[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Perk);
      });
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, PERKS_COLLECTION);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );
}

/**
 * Subscribe to Certificates in real-time
 */
export function subscribeCertificates(
  onUpdate: (certs: Certificate[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, CERTIFICATES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Certificate[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Certificate);
      });
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, CERTIFICATES_COLLECTION);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );
}

/**
 * Save or create a volunteer
 */
export async function saveVolunteerDoc(volunteer: Volunteer): Promise<void> {
  const path = `${VOLUNTEERS_COLLECTION}/${volunteer.id}`;
  try {
    await setDoc(doc(db, VOLUNTEERS_COLLECTION, volunteer.id), volunteer);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update volunteer fields
 */
export async function updateVolunteerDoc(volunteerId: string, updates: Partial<Volunteer>): Promise<void> {
  const path = `${VOLUNTEERS_COLLECTION}/${volunteerId}`;
  try {
    await updateDoc(doc(db, VOLUNTEERS_COLLECTION, volunteerId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save or create an opportunity
 */
export async function saveOpportunityDoc(opportunity: ActivityOpportunity): Promise<void> {
  const path = `${OPPORTUNITIES_COLLECTION}/${opportunity.id}`;
  try {
    await setDoc(doc(db, OPPORTUNITIES_COLLECTION, opportunity.id), opportunity);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update opportunity fields
 */
export async function updateOpportunityDoc(opportunityId: string, updates: Partial<ActivityOpportunity>): Promise<void> {
  const path = `${OPPORTUNITIES_COLLECTION}/${opportunityId}`;
  try {
    await updateDoc(doc(db, OPPORTUNITIES_COLLECTION, opportunityId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save transaction doc
 */
export async function saveTransactionDoc(transaction: TimeTransaction): Promise<void> {
  const path = `${TRANSACTIONS_COLLECTION}/${transaction.id}`;
  try {
    await setDoc(doc(db, TRANSACTIONS_COLLECTION, transaction.id), transaction);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save certificate doc
 */
export async function saveCertificateDoc(certificate: Certificate): Promise<void> {
  const path = `${CERTIFICATES_COLLECTION}/${certificate.id}`;
  try {
    await setDoc(doc(db, CERTIFICATES_COLLECTION, certificate.id), certificate);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a volunteer permanently from Firestore
 */
export async function deleteVolunteerDoc(volunteerId: string): Promise<void> {
  const path = `${VOLUNTEERS_COLLECTION}/${volunteerId}`;
  try {
    await deleteDoc(doc(db, VOLUNTEERS_COLLECTION, volunteerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Delete an opportunity permanently from Firestore
 */
export async function deleteOpportunityDoc(opportunityId: string): Promise<void> {
  const path = `${OPPORTUNITIES_COLLECTION}/${opportunityId}`;
  try {
    await deleteDoc(doc(db, OPPORTUNITIES_COLLECTION, opportunityId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to Notifications in real-time
 */
export function subscribeNotifications(
  onUpdate: (notifs: AppNotification[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, NOTIFICATIONS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as AppNotification);
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, NOTIFICATIONS_COLLECTION);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );
}

/**
 * Save notification doc
 */
export async function saveNotificationDoc(notification: AppNotification): Promise<void> {
  const path = `${NOTIFICATIONS_COLLECTION}/${notification.id}`;
  try {
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notification.id), notification);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationReadDoc(notificationId: string): Promise<void> {
  const path = `${NOTIFICATIONS_COLLECTION}/${notificationId}`;
  try {
    await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Mark all given notifications as read
 */
export async function markAllNotificationsReadDoc(notificationIds: string[]): Promise<void> {
  for (const id of notificationIds) {
    const path = `${NOTIFICATIONS_COLLECTION}/${id}`;
    try {
      await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

/**
 * Delete a notification doc
 */
export async function deleteNotificationDoc(notificationId: string): Promise<void> {
  const path = `${NOTIFICATIONS_COLLECTION}/${notificationId}`;
  try {
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotificationsDoc(notificationIds: string[]): Promise<void> {
  for (const id of notificationIds) {
    const path = `${NOTIFICATIONS_COLLECTION}/${id}`;
    try {
      await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}

