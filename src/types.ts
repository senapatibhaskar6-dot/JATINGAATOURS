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
  platformCommission: number; // 5% platform fee paid on top by the traveler
  agencyAdvanceFee: number; // Fixed ₹1,000 upfront advance for the agency
  totalAdvancePayable: number; // platformCommission + agencyAdvanceFee paid at checkout
  remainingBalanceDueOnArrival: number; // totalPackagePrice - agencyAdvanceFee paid directly to agency
  agencyTotalEarnings: number; // 100% of totalPackagePrice (agencyAdvanceFee + remainingBalanceDueOnArrival)
  agencyDeduction: number; // ₹0 (0% platform deduction from agency)
  travelerTotalAmount: number; // totalPackagePrice + platformCommission
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
