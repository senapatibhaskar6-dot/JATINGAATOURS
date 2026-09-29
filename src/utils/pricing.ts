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
export function calculateBookingFees(
  packagePrice: number,
  travelersCount: number = 1,
  operatorBank?: string
): BookingFeeCalculation {
  const totalPackagePrice = Math.round(packagePrice * travelersCount);
  const platformCommission = Math.round(totalPackagePrice * PLATFORM_COMMISSION_RATE);
  const platformFixedFee = FIXED_AGENCY_ADVANCE; // Flat ₹1,000 fee
  const agencyAdvanceFee = FIXED_AGENCY_ADVANCE;
  const totalAdvancePayable = platformCommission + agencyAdvanceFee;
  const remainingBalanceDueOnArrival = Math.max(0, totalPackagePrice - agencyAdvanceFee);
  const agencyTotalEarnings = totalPackagePrice; // Agency receives full value
  const agencyDeduction = 0;
  const travelerTotalAmount = totalPackagePrice + platformCommission;

  // 5% Commission + ₹1,000 platform deduction & instant net operator transfer model
  const totalPlatformDeduction = platformCommission + platformFixedFee;
  const netOperatorInstantTransfer = Math.max(0, totalPackagePrice - totalPlatformDeduction);
  const instantTransferStatus = 'Transferred Instantly via Razorpay Route / IMPS';

  return {
    packagePrice,
    travelersCount,
    totalPackagePrice,
    platformCommission,
    agencyAdvanceFee,
    platformFixedFee,
    totalPlatformDeduction,
    netOperatorInstantTransfer,
    totalAdvancePayable,
    remainingBalanceDueOnArrival,
    agencyTotalEarnings,
    agencyDeduction,
    travelerTotalAmount,
    instantTransferStatus,
    operatorBankPayoutAccount: operatorBank || 'Registered Operator Bank / UPI (Razorpay Linked)',
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const TIER_MARGIN_RATES: Record<string, number> = {
  Silver: 12, // 12% margin for registered travel agents
  Gold: 18,   // 18% margin for verified inbound operators
  Platinum: 22, // 22% margin for cooperative societies & high-volume DMCs
};

/**
 * Calculates B2B wholesale net rates and agency profit margins
 */
export function calculateB2BWholesale(
  retailPrice: number,
  travelersCount: number = 1,
  tier: 'Silver' | 'Gold' | 'Platinum' = 'Gold'
) {
  const marginPercent = TIER_MARGIN_RATES[tier] || 18;
  const totalRetailPrice = Math.round(retailPrice * travelersCount);
  const wholesaleNetRatePerPerson = Math.round(retailPrice * (1 - marginPercent / 100));
  const totalWholesaleNetCost = Math.round(wholesaleNetRatePerPerson * travelersCount);
  const agentTotalProfit = totalRetailPrice - totalWholesaleNetCost;
  
  // Advance deposit to lock in inventory via Razorpay (20% or ₹1,000/pax minimum)
  const advanceDepositRequired = Math.max(1000 * travelersCount, Math.round(totalWholesaleNetCost * 0.20));
  const remainingBalanceDueToHost = Math.max(0, totalWholesaleNetCost - advanceDepositRequired);

  return {
    retailPricePerPerson: retailPrice,
    travelersCount,
    totalRetailPrice,
    tier,
    marginPercent,
    wholesaleNetRatePerPerson,
    totalWholesaleNetCost,
    agentTotalProfit,
    advanceDepositRequired,
    remainingBalanceDueToHost,
  };
}

