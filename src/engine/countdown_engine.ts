import { HardwareDevice, CountdownTelemetry } from '../types/warranty.ts';

/**
 * Computes live countdown telemetry with millisecond precision
 * for both OEM manufacturer warranty and statutory legal protection periods.
 */
export function computeCountdownTelemetry(device: HardwareDevice, referenceTimeMs: number = Date.now()): CountdownTelemetry {
  const purchaseTimeMs = new Date(device.purchaseDate).getTime();
  
  // Calculate OEM expiration time
  const oemExpiryDate = new Date(purchaseTimeMs);
  oemExpiryDate.setMonth(oemExpiryDate.getMonth() + device.oemWarrantyMonths);
  const oemExpiryMs = oemExpiryDate.getTime();
  const oemDeltaMs = oemExpiryMs - referenceTimeMs;

  // Calculate Statutory protection expiration time
  const statutoryExpiryDate = new Date(purchaseTimeMs);
  statutoryExpiryDate.setMonth(statutoryExpiryDate.getMonth() + device.statutoryProtectionMonths);
  const statutoryExpiryMs = statutoryExpiryDate.getTime();
  const statutoryDeltaMs = statutoryExpiryMs - referenceTimeMs;

  const oemExpired = oemDeltaMs <= 0;
  const statutoryExpired = statutoryDeltaMs <= 0;

  const totalOemSeconds = Math.max(0, Math.floor(oemDeltaMs / 1000));
  const oemRemainingDays = Math.floor(totalOemSeconds / (3600 * 24));
  const oemRemainingHours = Math.floor((totalOemSeconds % (3600 * 24)) / 3600);
  const oemRemainingMinutes = Math.floor((totalOemSeconds % 3600) / 60);
  const oemRemainingSeconds = totalOemSeconds % 60;

  const totalStatutorySeconds = Math.max(0, Math.floor(statutoryDeltaMs / 1000));
  const statutoryRemainingDays = Math.floor(totalStatutorySeconds / (3600 * 24));

  let defenseStatus: CountdownTelemetry['defenseStatus'] = 'SECURE';
  if (statutoryExpired) {
    defenseStatus = 'DEFENSE_VOID';
  } else if (oemExpired) {
    defenseStatus = 'STATUTORY_REMEDY_ACTIVE';
  } else if (oemRemainingDays <= 30) {
    defenseStatus = 'EXPIRING_SOON';
  }

  return {
    deviceId: device.id,
    oemRemainingDays,
    oemRemainingHours,
    oemRemainingMinutes,
    oemRemainingSeconds,
    oemExpired,
    statutoryRemainingDays,
    statutoryExpired,
    defenseStatus,
  };
}
