
import { ShippingCalculation } from '../types';

export const calculateShipping = async (postalCode: string, subtotal: number): Promise<ShippingCalculation> => {
  // Simulación de latencia de API de logística (Andreani/OCA)
  await new Promise(resolve => setTimeout(resolve, 800));

  // Regla de envío gratis para muebles premium
  if (subtotal >= 1500000) {
    return { cost: 0, etaDaysMin: 5, etaDaysMax: 10, zone: 'Nacional (Promo)' };
  }

  const cpPrefix = postalCode.substring(0, 1);
  
  // Lógica simulada por regiones de Argentina
  if (['1', 'B'].includes(cpPrefix.toUpperCase())) {
    return { cost: 8500, etaDaysMin: 2, etaDaysMax: 5, zone: 'AMBA / GBA' };
  } else if (['X'].includes(cpPrefix.toUpperCase())) {
    return { cost: 4500, etaDaysMin: 1, etaDaysMax: 3, zone: 'Córdoba (Local)' };
  } else {
    return { cost: 18500, etaDaysMin: 7, etaDaysMax: 15, zone: 'Interior del País' };
  }
};

type DistanceBand = {
  km: number;
  zone: string;
  etaDaysMin: number;
  etaDaysMax: number;
};

const DISTANCE_BY_CP_PREFIX: Record<string, DistanceBand> = {
  // Referencia: CÃ³rdoba capital (CP 5000)
  '1': { km: 700, zone: 'AMBA / CABA', etaDaysMin: 4, etaDaysMax: 7 },
  '2': { km: 450, zone: 'Buenos Aires', etaDaysMin: 4, etaDaysMax: 7 },
  '3': { km: 330, zone: 'Litoral', etaDaysMin: 3, etaDaysMax: 6 },
  '4': { km: 650, zone: 'Cuyo', etaDaysMin: 4, etaDaysMax: 8 },
  '5': { km: 0, zone: 'CÃ³rdoba', etaDaysMin: 1, etaDaysMax: 3 },
  '6': { km: 900, zone: 'NEA', etaDaysMin: 6, etaDaysMax: 10 },
  '7': { km: 750, zone: 'NOA', etaDaysMin: 6, etaDaysMax: 10 },
  '8': { km: 1400, zone: 'Patagonia', etaDaysMin: 8, etaDaysMax: 14 },
  '9': { km: 1100, zone: 'Patagonia', etaDaysMin: 8, etaDaysMax: 14 },
};

const BASE_FEE = 4500;
const RATE_PER_KM = 500;

export const calculateShippingByPostal = async (postalCode: string): Promise<ShippingCalculation> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const cp = postalCode.trim();
  if (cp === '5000') {
    return { cost: 0, etaDaysMin: 1, etaDaysMax: 3, zone: 'CÃ³rdoba (Gratis)' };
  }

  const prefix = cp.substring(0, 1);
  const band = DISTANCE_BY_CP_PREFIX[prefix] ?? { km: 900, zone: 'Interior', etaDaysMin: 6, etaDaysMax: 12 };
  const cost = Math.max(8500, Math.round(BASE_FEE + band.km * RATE_PER_KM));

  return { cost, etaDaysMin: band.etaDaysMin, etaDaysMax: band.etaDaysMax, zone: band.zone };
};
