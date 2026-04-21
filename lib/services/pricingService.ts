import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export interface PricingConfig {
  baseFare: number;
  pricePerKm: number;
  minimumFare: number;
  surgeMultiplier: number;
  updatedAt?: string;
}

const PRICING_DOC_ID = 'default';
const PRICING_COLLECTION = 'pricing';

export async function getPricingConfig(): Promise<PricingConfig | null> {
  try {
    const docRef = doc(db, PRICING_COLLECTION, PRICING_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as PricingConfig;
    }
    
    // Return default pricing if none exists
    return {
      baseFare: 15.0,
      pricePerKm: 8.0,
      minimumFare: 25.0,
      surgeMultiplier: 1.0,
    };
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return null;
  }
}

export async function updatePricingConfig(config: PricingConfig): Promise<boolean> {
  try {
    const docRef = doc(db, PRICING_COLLECTION, PRICING_DOC_ID);
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating pricing config:', error);
    return false;
  }
}

export function calculateFare(distanceKm: number, config: PricingConfig): number {
  const fare = config.baseFare + (distanceKm * config.pricePerKm);
  return Math.max(fare * config.surgeMultiplier, config.minimumFare);
}
