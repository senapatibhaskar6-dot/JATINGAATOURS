import { BookingFeeCalculation } from '../types';

export const PLATFORM_COMMISSION_RATE = 0.05; // 5%
export const FIXED_AGENCY_ADVANCE = 1000; // ₹1,000

/**
 * Calculates the exact fee structure according to Jatingaa Tours core business logic:
 * 1. The 5% platform fee is paid by the TRAVELER on top as a platform service charge.
 * 2. The local agency's earnings are NEVER deducted by the 5% platform fee (0% agency deduction).
 * 3. The agency receives 100% of their full package value:
 *    - ₹1,000 fixed advance upfront upon booking confirmation.
 *    - The remaining balance (Total Package Price - ₹1,000) collected directly from the traveler on arrival.
 * 4. At checkout, the traveler pays: 5% Platform Fee + ₹1,000 Agency Advance.
 */
export function calculateBookingFees(packagePrice: number, travelersCount: number = 1): BookingFeeCalculation {
  const totalPackagePrice = Math.round(packagePrice * travelersCount);
  const platformCommission = Math.round(totalPackagePrice * PLATFORM_COMMISSION_RATE);
  const agencyAdvanceFee = FIXED_AGENCY_ADVANCE;
  const totalAdvancePayable = platformCommission + agencyAdvanceFee;
  const remainingBalanceDueOnArrival = Math.max(0, totalPackagePrice - agencyAdvanceFee);
  const agencyTotalEarnings = totalPackagePrice; // Agency gets 100% of package price
  const agencyDeduction = 0; // 0% deducted from agency
  const travelerTotalAmount = totalPackagePrice + platformCommission;

  return {
    packagePrice,
    travelersCount,
    totalPackagePrice,
    platformCommission,
    agencyAdvanceFee,
    totalAdvancePayable,
    remainingBalanceDueOnArrival,
    agencyTotalEarnings,
    agencyDeduction,
    travelerTotalAmount,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
