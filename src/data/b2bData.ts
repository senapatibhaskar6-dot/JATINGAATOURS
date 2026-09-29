import { B2BAgency, B2BHoldSlot, B2BQuotation, B2BLedgerEntry } from '../types';

export const INITIAL_B2B_AGENCIES: B2BAgency[] = [
  {
    id: 'b2b-ag-01',
    agencyName: 'Khasi Hills Eco-Tourism Cooperative Society',
    tradeName: 'Sohra Native Treks & DMC',
    contactPerson: 'Bah Wanphrang Khongwir',
    designation: 'Managing Director & Community Elder',
    email: 'wanphrang@khasiecotours.coop',
    phone: '+91 94361 24890',
    whatsapp: '+91 94361 24890',
    gstin: '17AAACK4910N1ZG',
    panNumber: 'AAACK4910N',
    msmeRegNo: 'UDYAM-ML-02-0019284',
    tourismLicenseNo: 'MEGH-TOUR-DMC-2022-814',
    state: 'Meghalaya',
    city: 'Cherrapunji (Sohra)',
    address: 'Nongriat Trailhead, Lower Sohra, Meghalaya 793108',
    operatorType: 'Cooperative Society',
    tier: 'Platinum',
    wholesaleMarginPercent: 22,
    status: 'verified',
    verificationNotes: 'Official Khasi tribal elder cooperative. All living root bridge local guides registered with State Tourism Department.',
    registeredAt: '2023-04-12T10:00:00Z',
    approvedAt: '2023-04-15T14:30:00Z',
    walletBalance: 45000,
    creditLimit: 150000,
    activeHoldsCount: 2,
    totalWholesaleBookings: 84,
    bankName: 'State Bank of India (Cherrapunji Branch)',
    bankAccountName: 'Khasi Hills Eco-Tourism Cooperative Society',
    bankAccountNumber: '38920194821',
    bankIfsc: 'SBIN0000078',
    upiId: 'khasiecotours@oksbi',
    payoutStatus: 'verified',
  },
  {
    id: 'b2b-ag-02',
    agencyName: 'Brahmaputra Inbound DMC & Expeditions',
    tradeName: 'Assam River & Heritage Travels',
    contactPerson: 'Pranjal Hazarika',
    designation: 'Head of Operations & Logistics',
    email: 'pranjal@brahmaputradmc.in',
    phone: '+91 98640 18274',
    whatsapp: '+91 98640 18274',
    gstin: '18AALCB8219K1ZS',
    panNumber: 'AALCB8219K',
    msmeRegNo: 'UDYAM-AS-03-0048192',
    tourismLicenseNo: 'ATDC-REG-INBOUND-2021-419',
    state: 'Assam',
    city: 'Guwahati',
    address: 'Brahmaputra Heritage Complex, Uzanbazar, Guwahati 781001',
    operatorType: 'DMC',
    tier: 'Gold',
    wholesaleMarginPercent: 18,
    status: 'verified',
    verificationNotes: 'Licensed Assam Tourism DMC with fleet of customized 4x4 safari vehicles and heritage houseboats.',
    registeredAt: '2023-08-20T09:15:00Z',
    approvedAt: '2023-08-22T11:00:00Z',
    walletBalance: 28500,
    creditLimit: 100000,
    activeHoldsCount: 1,
    totalWholesaleBookings: 52,
    bankName: 'HDFC Bank (Guwahati G.S. Road Branch)',
    bankAccountName: 'Brahmaputra Inbound DMC & Expeditions',
    bankAccountNumber: '50200038921849',
    bankIfsc: 'HDFC0000084',
    upiId: 'brahmaputradmc@okhdfcbank',
    payoutStatus: 'verified',
  },
  {
    id: 'b2b-ag-03',
    agencyName: 'High Altitude Himalayan Treks & Logistics Ltd',
    tradeName: 'Ladakh Native Nomadic Journeys',
    contactPerson: 'Tundup Dorjey',
    designation: 'Founder & Senior Expedition Leader',
    email: 'dorjey@ladakhexpeditions.org',
    phone: '+91 94191 78392',
    whatsapp: '+91 94191 78392',
    gstin: '37AAACH9102L1ZQ',
    panNumber: 'AAACH9102L',
    msmeRegNo: 'UDYAM-LA-01-0004921',
    tourismLicenseNo: 'LA-TOUR-EXP-2020-093',
    state: 'Ladakh',
    city: 'Leh',
    address: 'Fort Road, Near Main Bazaar, Leh, Ladakh 194101',
    operatorType: 'Inbound Agency',
    tier: 'Gold',
    wholesaleMarginPercent: 18,
    status: 'verified',
    verificationNotes: 'Certified high-altitude mountaineering and Pangong/Nubra homestay cluster coordinator.',
    registeredAt: '2024-01-10T12:00:00Z',
    approvedAt: '2024-01-12T16:00:00Z',
    walletBalance: 19200,
    creditLimit: 80000,
    activeHoldsCount: 1,
    totalWholesaleBookings: 39,
    bankName: 'State Bank of India (Leh Main Branch)',
    bankAccountName: 'High Altitude Himalayan Treks & Logistics Ltd',
    bankAccountNumber: '39482019482',
    bankIfsc: 'SBIN0001365',
    upiId: 'ladakhexp@oksbi',
    payoutStatus: 'verified',
  },
  {
    id: 'b2b-ag-04',
    agencyName: 'Kaziranga Safari & Community Homestays Network',
    tradeName: 'Wild Assam Trails',
    contactPerson: 'Dipen Saikia',
    designation: 'Proprietor',
    email: 'dipen@wildassamtrails.com',
    phone: '+91 97060 41289',
    whatsapp: '+91 97060 41289',
    gstin: '18AAEFD3819P1ZU',
    panNumber: 'AAEFD3819P',
    tourismLicenseNo: 'KAZI-SAFARI-2023-112',
    state: 'Assam',
    city: 'Bokakhat',
    address: 'Kohora Range Gate, Kaziranga National Park 785609',
    operatorType: 'Homestay Cluster',
    tier: 'Silver',
    wholesaleMarginPercent: 12,
    status: 'verified',
    verificationNotes: 'Verified community safari jeep owners & Mishing ethnic village homestays.',
    registeredAt: '2024-06-15T08:30:00Z',
    approvedAt: '2024-06-16T10:00:00Z',
    walletBalance: 12000,
    creditLimit: 50000,
    activeHoldsCount: 0,
    totalWholesaleBookings: 18,
  },
  {
    id: 'b2b-ag-05',
    agencyName: 'Eastern Horizons Travel Consortium',
    tradeName: 'Arunachal Borderlands Expeditions',
    contactPerson: 'Kamen Riba',
    designation: 'Managing Partner',
    email: 'kamen@easternhorizons.in',
    phone: '+91 98540 99120',
    whatsapp: '+91 98540 99120',
    gstin: '12AACFE8910R1ZK',
    panNumber: 'AACFE8910R',
    tourismLicenseNo: 'ARUN-TOUR-REG-PENDING',
    state: 'Arunachal Pradesh',
    city: 'Itanagar',
    address: 'Zero Point Tinali, Itanagar 791111',
    operatorType: 'Travel Agent',
    tier: 'Silver',
    wholesaleMarginPercent: 12,
    status: 'pending',
    verificationNotes: 'Awaiting Inner Line Permit (ILP) government liaison license upload.',
    registeredAt: '2026-09-24T14:20:00Z',
    walletBalance: 0,
    creditLimit: 25000,
    activeHoldsCount: 0,
    totalWholesaleBookings: 0,
  },
];

// Seed sample active inventory holds with realistic expiration countdowns
export const INITIAL_B2B_HOLDS: B2BHoldSlot[] = [
  {
    id: 'hold-01',
    holdCode: 'HOLD-2026-NE-8812',
    packageId: 'pkg-living-root-bridges',
    packageTitle: 'Living Root Bridges & Meghalaya Waterfalls Trek',
    packageLocation: 'Meghalaya (Cherrapunji & Mawlynnong)',
    packageRegion: 'northeast',
    agencyId: 'b2b-ag-01',
    agencyName: 'Khasi Hills Eco-Tourism Cooperative Society',
    agentContact: '+91 94361 24890',
    clientName: 'Dr. Ananya Roy & Family',
    clientContact: '+91 98300 48192',
    travelDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    slotsHeld: 4,
    heldAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    // 20 hours remaining on a 24-hour hold
    expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
    status: 'active',
    retailPricePerPerson: 18000,
    wholesaleRatePerPerson: 14040, // 22% Platinum margin
    totalWholesaleNetCost: 56160,
    depositPaid: 4000,
    notes: 'Client flight arriving at Guwahati 11:30 AM. Hold requested for double room homestay.',
  },
  {
    id: 'hold-02',
    holdCode: 'HOLD-2026-HIM-3109',
    packageId: 'pkg-ladakh-high-passes',
    packageTitle: 'High Passes of Ladakh & Pangong Tso Odyssey',
    packageLocation: 'Ladakh (Leh, Nubra & Pangong)',
    packageRegion: 'himalayas',
    agencyId: 'b2b-ag-03',
    agencyName: 'High Altitude Himalayan Treks & Logistics Ltd',
    agentContact: '+91 94191 78392',
    clientName: 'Rohan Mehta & Photography Group',
    clientContact: '+91 98201 92834',
    travelDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    slotsHeld: 6,
    heldAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    // 36 hours remaining on a 48-hour hold
    expiresAt: new Date(Date.now() + 36 * 3600000).toISOString(),
    status: 'active',
    retailPricePerPerson: 32000,
    wholesaleRatePerPerson: 26240, // 18% Gold margin
    totalWholesaleNetCost: 157440,
    depositPaid: 6000,
    notes: 'Oxygen concentrator requested for elderly traveler in group.',
  },
];

export const INITIAL_B2B_QUOTES: B2BQuotation[] = [
  {
    id: 'qt-01',
    quotationCode: 'QT-2026-NE-4491',
    agencyId: 'b2b-ag-01',
    agencyName: 'Khasi Hills Eco-Tourism Cooperative Society',
    agencyContact: '+91 94361 24890',
    agencyEmail: 'wanphrang@khasiecotours.coop',
    agencyLicense: 'MEGH-TOUR-DMC-2022-814',
    packageId: 'pkg-living-root-bridges',
    packageTitle: 'Living Root Bridges & Meghalaya Waterfalls Trek',
    packageLocation: 'Meghalaya (Cherrapunji & Mawlynnong)',
    duration: '5 Days / 4 Nights',
    clientName: 'Amitav Sen & Associates',
    clientPhone: '+91 98311 02934',
    clientEmail: 'amitav.sen@consulting.in',
    travelDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    travelersCount: 4,
    wholesaleNetPayable: 56160,
    retailQuotedPrice: 72000,
    agencyMarkupAmount: 15840,
    inclusions: [
      'All indigenous Khasi homestays with hot water',
      'Native certified Khasi trek guides (1 guide per 4 guests)',
      'Dedicated 4x4 Bolero / Scorpio throughout trip from Guwahati',
      'Traditional organic breakfast and tribal dinners',
      'Living root bridge and village conservation permits',
    ],
    exclusions: ['Airfare or train to Guwahati', 'Personal expenses & alcohol'],
    dayPlan: [
      {
        day: 1,
        title: 'Guwahati to Cherrapunji Heritage Ridge',
        description: 'Airport reception and scenic drive through Umiam Lake and Mawkdok Dympep Valley.',
        highlights: ['Scenic gorge viewpoint', 'Native herbal welcome tea', 'Homestay briefing'],
      },
      {
        day: 2,
        title: 'Nongriat Double Decker Living Root Bridge',
        description: 'Descend 3,500 historic steps through subtropical rainforest into the sacred valley.',
        highlights: ['Natural stone pools', 'Bio-engineered root architecture', 'Forest immersion'],
      },
    ],
    createdAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    customNotes: 'Includes airport pickup from Guwahati (GAU) at 10:00 AM.',
  },
];

export const INITIAL_B2B_LEDGER: B2BLedgerEntry[] = [
  {
    id: 'ledg-01',
    agencyId: 'b2b-ag-01',
    timestamp: '2026-09-28T14:30:00Z',
    type: 'slot_hold_deposit',
    amount: 4000,
    direction: 'credit',
    referenceId: 'HOLD-2026-NE-8812',
    description: '4-Slot Inventory Hold Deposit for Dr. Ananya Roy (Meghalaya Trek)',
    balanceAfter: 45000,
    razorpayPaymentId: 'pay_ThhSample8812',
  },
  {
    id: 'ledg-02',
    agencyId: 'b2b-ag-01',
    timestamp: '2026-09-26T11:15:00Z',
    type: 'advance_payment',
    amount: 14040,
    direction: 'credit',
    referenceId: 'JT-2026-NORTHEAST-9921',
    description: 'B2B Wholesale Net Advance via Razorpay Live (2 Pax Living Root Bridges)',
    balanceAfter: 41000,
    razorpayPaymentId: 'pay_ThhSample9921',
  },
  {
    id: 'ledg-03',
    agencyId: 'b2b-ag-01',
    timestamp: '2026-09-20T16:00:00Z',
    type: 'commission_credit',
    amount: 7920,
    direction: 'credit',
    referenceId: 'COMM-2026-09-18',
    description: 'Platinum Tier 22% Retained Commission Settlement on Group Booking',
    balanceAfter: 26960,
  },
];

// Storage keys
const B2B_AGENCIES_KEY = 'jatingaa_b2b_agencies_v1';
const B2B_HOLDS_KEY = 'jatingaa_b2b_holds_v1';
const B2B_QUOTES_KEY = 'jatingaa_b2b_quotes_v1';
const B2B_LEDGER_KEY = 'jatingaa_b2b_ledger_v1';
const B2B_ACTIVE_AGENCY_ID_KEY = 'jatingaa_b2b_active_agency_id';

export function getStoredB2BAgencies(): B2BAgency[] {
  try {
    const raw = localStorage.getItem(B2B_AGENCIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse B2B agencies:', e);
  }
  return INITIAL_B2B_AGENCIES;
}

export function saveStoredB2BAgencies(agencies: B2BAgency[]) {
  try {
    localStorage.setItem(B2B_AGENCIES_KEY, JSON.stringify(agencies));
  } catch (e) {
    console.error('Failed to save B2B agencies:', e);
  }
}

export function getStoredB2BHolds(): B2BHoldSlot[] {
  try {
    const raw = localStorage.getItem(B2B_HOLDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse B2B holds:', e);
  }
  return INITIAL_B2B_HOLDS;
}

export function saveStoredB2BHolds(holds: B2BHoldSlot[]) {
  try {
    localStorage.setItem(B2B_HOLDS_KEY, JSON.stringify(holds));
  } catch (e) {
    console.error('Failed to save B2B holds:', e);
  }
}

export function getStoredB2BQuotes(): B2BQuotation[] {
  try {
    const raw = localStorage.getItem(B2B_QUOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse B2B quotes:', e);
  }
  return INITIAL_B2B_QUOTES;
}

export function saveStoredB2BQuotes(quotes: B2BQuotation[]) {
  try {
    localStorage.setItem(B2B_QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save B2B quotes:', e);
  }
}

export function getStoredB2BLedger(): B2BLedgerEntry[] {
  try {
    const raw = localStorage.getItem(B2B_LEDGER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse B2B ledger:', e);
  }
  return INITIAL_B2B_LEDGER;
}

export function saveStoredB2BLedger(entries: B2BLedgerEntry[]) {
  try {
    localStorage.setItem(B2B_LEDGER_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save B2B ledger:', e);
  }
}

export function getStoredActiveB2BAgencyId(): string {
  try {
    return localStorage.getItem(B2B_ACTIVE_AGENCY_ID_KEY) || INITIAL_B2B_AGENCIES[0].id;
  } catch (e) {
    return INITIAL_B2B_AGENCIES[0].id;
  }
}

export function saveStoredActiveB2BAgencyId(id: string) {
  try {
    localStorage.setItem(B2B_ACTIVE_AGENCY_ID_KEY, id);
  } catch (e) {
    console.error('Failed to save active B2B agency id:', e);
  }
}
