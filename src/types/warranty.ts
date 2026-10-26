/**
 * WarrantyVault — Core TypeScript Domain Types
 */

export type StatutoryJurisdiction = 'US_FEDERAL' | 'US_STATE_UCC' | 'EU_DIRECTIVE' | 'UK_CONSUMER_RIGHTS';

export interface StatutoryPrecedent {
  jurisdiction: StatutoryJurisdiction;
  title: string;
  code: string;
  remedyPeriodMonths: number;
  statutoryBasis: string;
  enforceabilitySummary: string;
}

export interface HardwareDevice {
  id: string;
  name: string;
  category: 'Laptop' | 'Display' | 'Audio' | 'Graphics Card' | 'Camera' | 'Mobile';
  serialNumber: string;
  retailer: string;
  purchaseDate: string; // ISO format YYYY-MM-DD
  oemWarrantyMonths: number;
  statutoryProtectionMonths: number;
  purchasePriceUSD: number;
  status: 'ACTIVE' | 'WARNING' | 'EXPIRED' | 'CLAIM_PENDING';
  receiptUrl?: string;
}

export interface CountdownTelemetry {
  deviceId: string;
  oemRemainingDays: number;
  oemRemainingHours: number;
  oemRemainingMinutes: number;
  oemRemainingSeconds: number;
  oemExpired: boolean;
  statutoryRemainingDays: number;
  statutoryExpired: boolean;
  defenseStatus: 'SECURE' | 'EXPIRING_SOON' | 'STATUTORY_REMEDY_ACTIVE' | 'DEFENSE_VOID';
}

export interface StatutoryDemandClaim {
  id: string;
  deviceId: string;
  jurisdiction: StatutoryJurisdiction;
  claimantName: string;
  claimantAddress: string;
  defectDescription: string;
  statutoryClausesCited: string[];
  remedyDemanded: 'FULL_REFUND' | 'REPLACEMENT_NEW_UNIT' | 'AUTHORIZED_REPAIR_ZERO_COST';
  statutoryDeadlineDays: number; // e.g. 14 business days
  status: 'DRAFTED' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}
