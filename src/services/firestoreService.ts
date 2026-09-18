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
import { Volunteer, ActivityOpportunity, TimeTransaction, Perk, Certificate } from '../types';
import {
  INITIAL_VOLUNTEERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_TRANSACTIONS,
  INITIAL_PERKS,
  INITIAL_CERTIFICATES,
} from '../data/initialData';

// Collection Paths
const VOLUNTEERS_COLLECTION = 'volunteers';
const OPPORTUNITIES_COLLECTION = 'opportunities';
const TRANSACTIONS_COLLECTION = 'transactions';
const PERKS_COLLECTION = 'perks';
const CERTIFICATES_COLLECTION = 'certificates';

/**
 * Seeds initial mock data to Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const volSnap = await getDocs(collection(db, VOLUNTEERS_COLLECTION));
    if (volSnap.empty) {
      for (const vol of INITIAL_VOLUNTEERS) {
        await setDoc(doc(db, VOLUNTEERS_COLLECTION, vol.id), vol);
      }
    }

    const opSnap = await getDocs(collection(db, OPPORTUNITIES_COLLECTION));
    if (opSnap.empty) {
      for (const op of INITIAL_OPPORTUNITIES) {
        await setDoc(doc(db, OPPORTUNITIES_COLLECTION, op.id), op);
      }
    }

    const txSnap = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
    if (txSnap.empty) {
      for (const tx of INITIAL_TRANSACTIONS) {
        await setDoc(doc(db, TRANSACTIONS_COLLECTION, tx.id), tx);
      }
    }

    const perkSnap = await getDocs(collection(db, PERKS_COLLECTION));
    if (perkSnap.empty) {
      for (const perk of INITIAL_PERKS) {
        await setDoc(doc(db, PERKS_COLLECTION, perk.id), perk);
      }
    }

    const certSnap = await getDocs(collection(db, CERTIFICATES_COLLECTION));
    if (certSnap.empty) {
      for (const cert of INITIAL_CERTIFICATES) {
        await setDoc(doc(db, CERTIFICATES_COLLECTION, cert.id), cert);
      }
    }
  } catch (error) {
    console.warn('Initial Firestore seed check completed or restricted by security rules:', error);
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
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Volunteer);
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
