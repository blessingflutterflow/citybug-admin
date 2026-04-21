import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export interface Trip {
  id: string;
  userId: string;
  userName: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  distanceKm: number;
  fare: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const TRIPS_COLLECTION = 'trips';

export async function getAllTrips(): Promise<Trip[]> {
  try {
    const q = query(collection(db, TRIPS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Trip));
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  try {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Trip;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  try {
    const q = query(
      collection(db, TRIPS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Trip))
      .filter(trip => trip.userId === userId);
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return [];
  }
}
