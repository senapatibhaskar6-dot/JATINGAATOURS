export interface Agency {
  id: string;
  name: string;
  founder: string;
  baseCity: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string;
  licenseNumber: string; // Govt Tourism Reg / GSTIN
  verifiedSince: string;
  rating: number;
  totalToursCompleted: number;
  bio: string;
  avatar?: string;
  specialty?: string;
  status?: 'verified' | 'pending';
  // Registered Bank / Payment Account for Instant Razorpay Route Transfers
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  upiId?: string;
  razorpayAccountId?: string;
  payoutStatus?: 'verified' | 'pending';
}

export type B2BPartnerTier = 'Silver' | 'Gold' | 'Platinum';

export interface B2BAgency {
  id: string;
  agencyName: string;
  tradeName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  whatsapp: string;
  gstin: string;
  panNumber: string;
  msmeRegNo?: string;
  tourismLicenseNo: string;
  state: string;
  city: string;
  address: string;
  operatorType: 'DMC' | 'Inbound Agency' | 'Travel Agent' | 'Cooperative Society' | 'Homestay Cluster';
  tier: B2BPartnerTier;
  wholesaleMarginPercent: number; // e.g. 12% for Silver, 18% for Gold, 22% for Platinum
  status: 'verified' | 'pending' | 'suspended';
  verificationNotes?: string;
  registeredAt: string;
  approvedAt?: string;
  walletBalance: number;
  creditLimit: number;
  activeHoldsCount: number;
  totalWholesaleBookings: number;
  customLogoUrl?: string;
  // Operator Bank & Payout Configuration (Instant Razorpay Route Transfers)
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  upiId?: string;
  payoutStatus?: 'verified' | 'pending';
}

export interface B2BHoldSlot {
  id: string;
  holdCode: string; // e.g. "HOLD-2026-NE-4491"
  packageId: string;
  packageTitle: string;
  packageLocation: string;
  packageRegion: string;
  agencyId: string;
  agencyName: string;
  agentContact: string;
  clientName: string;
  clientContact: string;
  travelDate: string;
  slotsHeld: number;
  heldAt: string; // ISO
  expiresAt: string; // ISO
  status: 'active' | 'expired' | 'converted' | 'released';
  retailPricePerPerson: number;
  wholesaleRatePerPerson: number;
  totalWholesaleNetCost: number;
  depositPaid: number;
  notes?: string;
}

export interface B2BQuotation {
  id: string;
  quotationCode: string; // e.g. "QT-2026-NE-7712"
  agencyId: string;
  agencyName: string;
  agencyContact: string;
  agencyEmail: string;
  agencyLicense: string;
  packageId: string;
  packageTitle: string;
  packageLocation: string;
  duration: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  travelDate: string;
  travelersCount: number;
  wholesaleNetPayable: number;
  retailQuotedPrice: number;
  agencyMarkupAmount: number;
  inclusions: string[];
  exclusions: string[];
  dayPlan: DayItinerary[];
  createdAt: string;
  validUntil: string;
  customNotes?: string;
}

export interface B2BLedgerEntry {
  id: string;
  agencyId: string;
  timestamp: string;
  type: 'advance_payment' | 'slot_hold_deposit' | 'booking_payout' | 'commission_credit' | 'refund';
  amount: number;
  direction: 'credit' | 'debit';
  referenceId: string; // bookingCode or holdCode or paymentId
  description: string;
  balanceAfter: number;
  razorpayPaymentId?: string;
}

export interface B2BWholesaleCalculation {
  retailPricePerPerson: number;
  travelersCount: number;
  totalRetailPrice: number;
  tier: B2BPartnerTier;
  marginPercent: number;
  wholesaleNetRatePerPerson: number;
  totalWholesaleNetCost: number;
  agentTotalProfit: number;
  advanceDepositRequired: number; // Advance paid via Razorpay to confirm slot
  remainingBalanceDueToHost: number;
}


export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  region: 'northeast' | 'himalayas' | 'south' | 'west' | 'islands';
  regionLabel: string;
  location: string;
  duration: string; // e.g. "6 Days / 5 Nights"
  daysCount: number;
  groupType: 'Small Group (Max 8)' | 'Private Guided' | 'Community Homestay';
  fitnessLevel: 'Easy' | 'Moderate' | 'Challenging';
  pricePerPerson: number; // in INR (e.g. 18000)
  image: string;
  gallery: string[];
  agency: Agency;
  itinerary: DayItinerary[];
  inclusions: string[];
  exclusions: string[];
  bestSeason: string;
  startingPoint: string;
  featured?: boolean;
  moderationStatus?: 'published' | 'in_review' | 'draft';
  isUserGenerated?: boolean;
  destinationDescription?: string; // Detailed description of destination within 1,000 words limit
  destinationWordCount?: number;
}

export interface TravelStory {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  coverImage: string;
  galleryImages: string[];
  region: 'northeast' | 'himalayas' | 'south' | 'west' | 'islands';
  regionLabel: string;
  destination: string;
  authorAgency: Agency;
  authorRole: string; // e.g. "Native Khasi Senior Guide"
  readTimeMinutes: number;
  publishedDate: string;
  contentParagraphs: string[];
  insiderTips: string[];
  culturalEtiquette: string[];
  bestVisitingMonths: string;
  associatedPackageId?: string;
  tags: string[];
  moderationStatus: 'published' | 'in_review' | 'draft';
  likesCount: number;
  isUserGenerated?: boolean;
}

export interface BookingFeeCalculation {
  packagePrice: number;
  travelersCount: number;
  totalPackagePrice: number;
  platformCommission: number; // 5% flat platform fee
  agencyAdvanceFee: number; // Fixed upfront fee
  platformFixedFee: number; // Flat ₹1,000 fee
  totalPlatformDeduction: number; // 5% Commission + ₹1,000 Fee
  netOperatorInstantTransfer: number; // Total Booking Amount - (5% Commission + ₹1,000 Fee)
  totalAdvancePayable: number; // platformCommission + agencyAdvanceFee paid at checkout
  remainingBalanceDueOnArrival: number; // totalPackagePrice - agencyAdvanceFee paid directly to agency
  agencyTotalEarnings: number; // 100% of totalPackagePrice
  agencyDeduction: number; // ₹0
  travelerTotalAmount: number; // totalPackagePrice + platformCommission
  instantTransferStatus: string; // Instant Razorpay Route fund transfer status
  operatorBankPayoutAccount?: string; // Target Operator Bank Account / UPI
}

export interface BookingRecord {
  id: string;
  bookingCode: string; // e.g. "JT-2026-NE-8821"
  packageId: string;
  packageTitle: string;
  packageLocation: string;
  travelDate: string;
  travelersCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  specialRequests?: string;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  paymentTransactionId: string;
  calculation: BookingFeeCalculation;
  bookingTimestamp: string;
  status: 'confirmed';
  agency: Agency;
}

declare global {
  interface Window {
    Razorpay?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}
