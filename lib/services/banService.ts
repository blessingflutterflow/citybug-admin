import { db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

export interface BannedUser {
  userId: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
}

const BANNED_COLLECTION = 'banned_users';

export async function banUser(userId: string, reason: string = 'Violation of terms'): Promise<boolean> {
  try {
    await setDoc(doc(db, BANNED_COLLECTION, userId), {
      userId,
      reason,
      bannedAt: new Date().toISOString(),
      bannedBy: 'admin',
    });
    return true;
  } catch (error) {
    console.error('Error banning user:', error);
    return false;
  }
}

export async function unbanUser(userId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, BANNED_COLLECTION, userId));
    return true;
  } catch (error) {
    console.error('Error unbanning user:', error);
    return false;
  }
}

export async function isUserBanned(userId: string): Promise<boolean> {
  try {
    const docSnap = await getDoc(doc(db, BANNED_COLLECTION, userId));
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking ban status:', error);
    return false;
  }
}

export async function getBannedUsers(): Promise<BannedUser[]> {
  try {
    const q = query(collection(db, BANNED_COLLECTION), orderBy('bannedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
    } as BannedUser));
  } catch (error) {
    console.error('Error fetching banned users:', error);
    return [];
  }
}
