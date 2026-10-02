import React, { useState, useMemo, useEffect } from 'react';
import {
  TourPackage, BookingRecord, Agency, TravelStory,
  B2BAgency, B2BHoldSlot, B2BQuotation, B2BLedgerEntry, B2BPartnerTier
} from './types';
import { TOUR_PACKAGES } from './data/packages';
import { INITIAL_TRAVEL_STORIES } from './data/travelStories';
import { calculateBookingFees } from './utils/pricing';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FinancialExplainer } from './components/FinancialExplainer';
import { PackageGrid } from './components/PackageGrid';
import { PackageModal } from './components/PackageModal';
import { BookingModal } from './components/BookingModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { TravelStoriesSection } from './components/TravelStoriesSection';
import { TravelStoryModal } from './components/TravelStoryModal';
import { HowItWorks } from './components/HowItWorks';
import { AgencySection } from './components/AgencySection';
import { AgencyDashboardModal } from './components/AgencyDashboardModal';
import { AgencyRegisterModal } from './components/AgencyRegisterModal';
import { CodeIntegrationModal } from './components/CodeIntegrationModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { B2BHeaderBanner } from './components/B2BHeaderBanner';
import { B2BOperatorHubModal } from './components/B2BOperatorHubModal';
import { B2BQuotationVoucherModal } from './components/B2BQuotationVoucherModal';
import { B2BHoldSlotModal } from './components/B2BHoldSlotModal';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { AgenciesDirectoryModal } from './components/AgenciesDirectoryModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AboutUsModal } from './components/AboutUsModal';
import { AboutUsSection } from './components/AboutUsSection';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { getIsAdminLoggedIn, setIsAdminLoggedIn } from './utils/adminAuth';
import { supabase, fetchAgenciesFromSupabase, SupabaseAgencyRow } from './utils/supabaseClient';
import {
  getStoredB2BAgencies, saveStoredB2BAgencies,
  getStoredB2BHolds, saveStoredB2BHolds,
  getStoredB2BQuotes, saveStoredB2BQuotes,
  getStoredB2BLedger, saveStoredB2BLedger,
  getStoredActiveB2BAgencyId, saveStoredActiveB2BAgencyId,
} from './data/b2bData';
import { Footer } from './components/Footer';

// Seed sample initial confirmed bookings
const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-init-1',
    bookingCode: 'JT-2026-NORTHEAST-8421',
    packageId: 'pkg-meghalaya-cloud-valleys',
    packageTitle: 'Living Root Bridges & Cloud Valleys of Meghalaya',
    packageLocation: 'Sohra (Cherrapunji) & Dawki, Meghalaya',
    travelDate: '2026-10-15',
    travelersCount: 2,
    customerName: 'Priya Narayanan',
    customerEmail: 'priya.narayanan@gmail.com',
    customerPhone: '+91 98201 44521',
    customerCity: 'Mumbai, Maharashtra',
    specialRequests: 'Need early morning pickup from Guwahati airport; 1 vegetarian meal preference.',
    paymentMethod: 'upi',
    paymentTransactionId: 'TXN-UPI994208',
    calculation: calculateBookingFees(18500, 2),
    bookingTimestamp: '2026-09-22T10:30:00Z',
    status: 'confirmed',
    agency: TOUR_PACKAGES[0].agency,
  },
  {
    id: 'bk-init-2',
    bookingCode: 'JT-2026-HIMALAYAS-9104',
    packageId: 'pkg-ladakh-monasteries-himalayas',
    packageTitle: 'High Ladakh Monasteries, Nubra Valley & Pangong Lake',
    packageLocation: 'Leh, Nubra Valley & Pangong Tso, Ladakh',
    travelDate: '2026-10-22',
    travelersCount: 1,
    customerName: 'Rohan Deshmukh',
    customerEmail: 'rohan.deshmukh@techcorp.in',
    customerPhone: '+91 97654 32180',
    customerCity: 'Pune, Maharashtra',
    specialRequests: 'Would like extra acclimatization assistance and oxygen monitor check on Day 1.',
    paymentMethod: 'card',
    paymentTransactionId: 'TXN-CRD441098',
    calculation: calculateBookingFees(24500, 1),
    bookingTimestamp: '2026-09-23T14:15:00Z',
    status: 'confirmed',
    agency: TOUR_PACKAGES[1].agency,
  },
];

export default function App() {
  // Tour packages state (dynamically updated by vendor additions)
  const [packages, setPackages] = useState<TourPackage[]>(TOUR_PACKAGES);

  // User-Generated Content: Travel Stories & Field Journals
  const [stories, setStories] = useState<TravelStory[]>(INITIAL_TRAVEL_STORIES);

  // Registered Agencies
  const initialAgencies = useMemo(() => {
    const map = new Map<string, Agency>();
    TOUR_PACKAGES.forEach((p) => {
      if (!map.has(p.agency.id)) {
        map.set(p.agency.id, p.agency);
      }
    });
    return Array.from(map.values());
  }, []);
  const [agenciesList, setAgenciesList] = useState<Agency[]>(initialAgencies);
  const [activeAgency, setActiveAgency] = useState<Agency>(initialAgencies[0]);

  // Search & Filter state
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null);
  const [bookingTour, setBookingTour] = useState<TourPackage | null>(null);
  const [bookingTravelersCount, setBookingTravelersCount] = useState<number>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const [isAgencyPortalOpen, setIsAgencyPortalOpen] = useState(false);
  const [isRegisterAgencyOpen, setIsRegisterAgencyOpen] = useState(false);
  const [isAgenciesDirectoryOpen, setIsAgenciesDirectoryOpen] = useState(false);
  const [isCodeGuidanceOpen, setIsCodeGuidanceOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isPaymentSettingsOpen, setIsPaymentSettingsOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(getIsAdminLoggedIn);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoggedInState(true);
    setIsB2BMode(true);
    setIsAdminLoginModalOpen(false);
    showToast('👑 Admin Mode unlocked! All administrative tools are now active.');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminLoggedInState(false);
    setIsB2BMode(false);
    setIsAdminLoginModalOpen(false);
    showToast('Admin Mode locked. Confidential agency & payment tools are now protected.');
  };

  // B2B Operator Network State - Only active when Admin is logged in
  const [isB2BMode, setIsB2BMode] = useState<boolean>(() => getIsAdminLoggedIn());
  const [b2bAgencies, setB2bAgencies] = useState<B2BAgency[]>(getStoredB2BAgencies);
  const [activeB2BAgencyId, setActiveB2BAgencyId] = useState<string>(getStoredActiveB2BAgencyId);
  const [b2bHolds, setB2bHolds] = useState<B2BHoldSlot[]>(getStoredB2BHolds);
  const [b2bQuotes, setB2bQuotes] = useState<B2BQuotation[]>(getStoredB2BQuotes);
  const [b2bLedger, setB2bLedger] = useState<B2BLedgerEntry[]>(getStoredB2BLedger);

  // Helper to map Supabase row to B2BAgency
  const mapSupabaseRowToB2BAgency = (row: SupabaseAgencyRow): B2BAgency => {
    let parsedBank: Record<string, any> = {};
    if (typeof row.bank_details === 'string') {
      try {
        parsedBank = JSON.parse(row.bank_details);
      } catch {
        parsedBank = { bankName: row.bank_details };
      }
    } else if (row.bank_details && typeof row.bank_details === 'object') {
      parsedBank = row.bank_details as Record<string, any>;
    }

    const locParts = (row.location || 'Guwahati, Assam').split(',');
    const city = (locParts[0] || 'Guwahati').trim();
    const state = (locParts[1] || 'Assam').trim();

    return {
      id: row.id || `sb-${row.agency_name.toLowerCase().replace(/\s+/g, '-')}`,
      agencyName: row.agency_name,
      tradeName: row.agency_name,
      contactPerson: row.owner_name,
      designation: 'Managing Director / Founder',
      email: row.email,
      phone: row.phone,
      whatsapp: row.whatsapp || row.phone,
      gstin: parsedBank.licenseNumber || 'VERIFIED-REG',
      panNumber: 'VERIFIED',
      tourismLicenseNo: parsedBank.licenseNumber || 'REG-TOUR-VERIFIED',
      state: row.state || state,
      city: row.city || city,
      address: row.location || `${city}, ${state}`,
      operatorType: parsedBank.specialty || 'DMC',
      tier: 'Gold',
      wholesaleMarginPercent: 18,
      status: (row.status as any) || 'verified',
      registeredAt: row.created_at || new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      walletBalance: 0,
      creditLimit: 50000,
      activeHoldsCount: 0,
      totalWholesaleBookings: 0,
      bankName: parsedBank.bankName || 'State Bank of India',
      bankAccountName: parsedBank.bankAccountName || row.agency_name,
      bankAccountNumber: parsedBank.bankAccountNumber || '38920194821',
      bankIfsc: parsedBank.bankIfsc || 'SBIN0000001',
      upiId: parsedBank.upiId || `${row.phone.replace(/\D/g, '')}@upi`,
      payoutStatus: 'verified',
    };
  };

  // Real-time synchronization with Supabase cloud database
  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch from Supabase 'agencies' table
    async function loadSupabaseAgencies() {
      const res = await fetchAgenciesFromSupabase();
      if (res.success && res.data && res.data.length > 0 && isMounted) {
        const fetchedB2B: B2BAgency[] = res.data.map(mapSupabaseRowToB2BAgency);

        setB2bAgencies(prev => {
          // Merge with existing avoiding duplicates by agencyName
          const existingNames = new Set(prev.map(p => p.agencyName.toLowerCase()));
          const newEntries = fetchedB2B.filter(f => !existingNames.has(f.agencyName.toLowerCase()));
          const updated = [...newEntries, ...prev];
          saveStoredB2BAgencies(updated);
          return updated;
        });

        // Also sync into agenciesList for tours & UGC
        setAgenciesList(prev => {
          const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
          const newAg: Agency[] = fetchedB2B
            .filter(f => !existingNames.has(f.agencyName.toLowerCase()))
            .map(f => ({
              id: f.id,
              name: f.agencyName,
              founder: f.contactPerson,
              baseCity: f.city,
              state: f.state,
              phone: f.phone,
              whatsapp: f.whatsapp,
              email: f.email,
              licenseNumber: f.tourismLicenseNo,
              verifiedSince: '2023',
              rating: 5.0,
              totalToursCompleted: 0,
              bio: `${f.agencyName} is a verified local tour operator.`,
              specialty: f.operatorType,
              status: f.status,
              bankName: f.bankName,
              bankAccountName: f.bankAccountName,
              bankAccountNumber: f.bankAccountNumber,
              bankIfsc: f.bankIfsc,
              upiId: f.upiId,
              payoutStatus: 'verified',
            }));
          return [...newAg, ...prev];
        });
      }
    }

    loadSupabaseAgencies();

    // 2. Real-time subscription to 'agencies' changes in Supabase
    const subscription = supabase
      .channel('public:agencies')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agencies' },
        (payload) => {
          if (!isMounted) return;
          if (payload.eventType === 'INSERT' && payload.new) {
            const newAgency = mapSupabaseRowToB2BAgency(payload.new as SupabaseAgencyRow);
            setB2bAgencies(prev => {
              if (prev.some(p => p.agencyName.toLowerCase() === newAgency.agencyName.toLowerCase())) {
                return prev;
              }
              const updated = [newAgency, ...prev];
              saveStoredB2BAgencies(updated);
              return updated;
            });
            showToast(`Real-time: New agency "${newAgency.agencyName}" registered via Supabase!`);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedAgency = mapSupabaseRowToB2BAgency(payload.new as SupabaseAgencyRow);
            setB2bAgencies(prev => {
              const updated = prev.map(p => p.agencyName.toLowerCase() === updatedAgency.agencyName.toLowerCase() ? updatedAgency : p);
              saveStoredB2BAgencies(updated);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  const [isB2BHubOpen, setIsB2BHubOpen] = useState(false);
  const [b2bHubInitialTab, setB2bHubInitialTab] = useState<'inventory' | 'holds' | 'quotes' | 'ledger' | 'admin' | 'payout'>('inventory');
  const [activeHoldPackage, setActiveHoldPackage] = useState<TourPackage | null>(null);
  const [activeQuotePackage, setActiveQuotePackage] = useState<TourPackage | null>(null);
  const [activeQuotationData, setActiveQuotationData] = useState<B2BQuotation | null>(null);

  const handleOpenB2BHubWithTab = (tab: 'inventory' | 'holds' | 'quotes' | 'ledger' | 'admin' | 'payout' = 'inventory') => {
    setB2bHubInitialTab(tab);
    setIsB2BHubOpen(true);
  };

  const handleUpdateAgencyBankPayout = (agencyId: string, bankDetails: {
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankIfsc: string;
    upiId: string;
  }) => {
    setB2bAgencies(prev => {
      const updated = prev.map(a => {
        if (a.id === agencyId) {
          return {
            ...a,
            ...bankDetails,
            payoutStatus: 'verified' as const,
          };
        }
        return a;
      });
      saveStoredB2BAgencies(updated);
      return updated;
    });

    setAgenciesList(prev => prev.map(ag => {
      if (ag.id === agencyId || ag.name === activeB2BAgency.agencyName) {
        return {
          ...ag,
          ...bankDetails,
          payoutStatus: 'verified' as const,
        };
      }
      return ag;
    }));

    setActiveAgency(prev => ({
      ...prev,
      ...bankDetails,
      payoutStatus: 'verified' as const,
    }));

    showToast(`Bank & Payout Account updated and verified for ${bankDetails.bankName}!`);
  };

  const activeB2BAgency = useMemo(() => {
    return b2bAgencies.find(a => a.id === activeB2BAgencyId) || b2bAgencies[0];
  }, [b2bAgencies, activeB2BAgencyId]);

  const handleSwitchB2BAgency = (agency: B2BAgency) => {
    setActiveB2BAgencyId(agency.id);
    saveStoredActiveB2BAgencyId(agency.id);
    showToast(`Switched active B2B session to: ${agency.agencyName} (${agency.tier} Tier)`);
  };

  const handleUpdateB2BAgencyStatus = (agencyId: string, status: 'verified' | 'pending' | 'suspended', tier?: B2BPartnerTier) => {
    setB2bAgencies(prev => {
      const updated = prev.map(a => {
        if (a.id === agencyId) {
          const newTier = tier || a.tier;
          const newMargin = newTier === 'Platinum' ? 22 : newTier === 'Gold' ? 18 : 12;
          return {
            ...a,
            status,
            tier: newTier,
            wholesaleMarginPercent: newMargin,
            approvedAt: status === 'verified' ? new Date().toISOString() : a.approvedAt,
          };
        }
        return a;
      });
      saveStoredB2BAgencies(updated);
      return updated;
    });
    showToast(`Agency status updated to "${status}"!`);
  };

  const handleAddNewB2BAgency = (agency: B2BAgency) => {
    setB2bAgencies(prev => {
      const updated = [agency, ...prev];
      saveStoredB2BAgencies(updated);
      return updated;
    });
    showToast(`Registered new agency: ${agency.agencyName}`);
  };

  const handleConfirmHold = (hold: B2BHoldSlot) => {
    setB2bHolds(prev => {
      const updated = [hold, ...prev];
      saveStoredB2BHolds(updated);
      return updated;
    });
    // Record ledger entry if deposit paid
    if (hold.depositPaid > 0) {
      setB2bLedger(prev => {
        const entry: B2BLedgerEntry = {
          id: `ledg-${Date.now()}`,
          agencyId: hold.agencyId,
          timestamp: new Date().toISOString(),
          type: 'slot_hold_deposit',
          amount: hold.depositPaid,
          direction: 'credit',
          referenceId: hold.holdCode,
          description: `Hold Deposit for ${hold.clientName} (${hold.packageTitle})`,
          balanceAfter: activeB2BAgency.walletBalance + hold.depositPaid,
        };
        const updated = [entry, ...prev];
        saveStoredB2BLedger(updated);
        return updated;
      });
    }
    setActiveHoldPackage(null);
    showToast(`Blocked ${hold.slotsHeld} slots on ${hold.packageTitle} (Code: ${hold.holdCode})`);
  };

  const handleReleaseHold = (holdId: string) => {
    setB2bHolds(prev => {
      const updated = prev.filter(h => h.id !== holdId);
      saveStoredB2BHolds(updated);
      return updated;
    });
    showToast(`Released held slots back into inventory pool.`);
  };

  const handleConvertHoldToBooking = (hold: B2BHoldSlot) => {
    const pkg = packages.find(p => p.id === hold.packageId) || packages[0];
    setBookingTour(pkg);
    setBookingTravelersCount(hold.slotsHeld);
    setIsB2BHubOpen(false);
  };

  const handleSaveQuotation = (quote: B2BQuotation) => {
    setB2bQuotes(prev => {
      const existing = prev.findIndex(q => q.id === quote.id);
      let updated: B2BQuotation[];
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = quote;
      } else {
        updated = [quote, ...prev];
      }
      saveStoredB2BQuotes(updated);
      return updated;
    });
    showToast(`Saved quotation ${quote.quotationCode} for ${quote.clientName}`);
  };

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchRegion =
        selectedRegion === 'all' || pkg.region === selectedRegion;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        pkg.location.toLowerCase().includes(q) ||
        pkg.regionLabel.toLowerCase().includes(q) ||
        pkg.tagline.toLowerCase().includes(q) ||
        pkg.agency.name.toLowerCase().includes(q) ||
        pkg.agency.baseCity.toLowerCase().includes(q);

      return matchRegion && matchQuery;
    });
  }, [packages, selectedRegion, searchQuery]);

  // Handlers for Bookings
  const handleOpenBooking = (tour: TourPackage, travelersCount: number = 1) => {
    setSelectedPackage(null);
    setSelectedStory(null);
    setBookingTour(tour);
    setBookingTravelersCount(travelersCount);
  };

  const handleBookingSuccess = (record: BookingRecord) => {
    setBookings((prev) => [record, ...prev]);
    setBookingTour(null);
    setConfirmedBooking(record);
    showToast(`Booking ${record.bookingCode} confirmed! Unlocked direct contact for ${record.agency.name}.`);

    // Fire Google Ads conversion tracking event
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18477707405',
          value: record.calculation.totalAdvancePayable,
          currency: 'INR',
          transaction_id: record.bookingCode,
        });
      } catch (e) {
        // Silently ignore if blocked by ad-blocker
      }
    }
  };

  const handleSimulateNewBooking = () => {
    const randomTour = packages[Math.floor(Math.random() * packages.length)];
    const names = ['Vikram Sethi', 'Ananya Roy', 'Kabir Sen', 'Meera Nair', 'Aditya Iyer', 'Pooja Hegde'];
    const cities = ['Bengaluru', 'Delhi', 'Hyderabad', 'Kolkata', 'Chennai', 'Ahmedabad'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomCount = Math.floor(1 + Math.random() * 3);

    const newRecord: BookingRecord = {
      id: 'bk-sim-' + Date.now(),
      bookingCode: `JT-2026-${randomTour.region.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      packageId: randomTour.id,
      packageTitle: randomTour.title,
      packageLocation: randomTour.location,
      travelDate: '2026-11-10',
      travelersCount: randomCount,
      customerName: randomName,
      customerEmail: `${randomName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      customerPhone: `+91 ${Math.floor(90000 + Math.random() * 9999)} ${Math.floor(10000 + Math.random() * 90000)}`,
      customerCity: randomCity,
      specialRequests: 'Simulated direct traveler request via live aggregator engine.',
      paymentMethod: 'upi',
      paymentTransactionId: 'TXN-DEMO' + Math.floor(100000 + Math.random() * 900000),
      calculation: calculateBookingFees(randomTour.pricePerPerson, randomCount),
      bookingTimestamp: new Date().toISOString(),
      status: 'confirmed',
      agency: randomTour.agency,
    };

    setBookings((prev) => [newRecord, ...prev]);
    showToast(`New incoming booking ${newRecord.bookingCode} received for ${randomTour.agency.name}! ₹1,000 advance credited.`);
  };

  // Handlers for UGC & Agency Management
  const handleAgencyRegistered = (newAgency: Agency) => {
    setAgenciesList((prev) => [newAgency, ...prev]);
    setActiveAgency(newAgency);

    // Also register into B2B Agencies network and persist to localStorage
    const newB2BAgency: B2BAgency = {
      id: newAgency.id,
      agencyName: newAgency.name,
      tradeName: newAgency.name,
      contactPerson: newAgency.founder,
      designation: 'Managing Director / Founder',
      email: newAgency.email,
      phone: newAgency.phone,
      whatsapp: newAgency.whatsapp,
      gstin: newAgency.licenseNumber,
      panNumber: 'VERIF_PENDING',
      tourismLicenseNo: newAgency.licenseNumber,
      state: newAgency.state,
      city: newAgency.baseCity,
      address: `${newAgency.baseCity}, ${newAgency.state}`,
      operatorType: 'DMC',
      tier: 'Gold',
      wholesaleMarginPercent: 18,
      status: 'verified',
      registeredAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      walletBalance: 0,
      creditLimit: 50000,
      activeHoldsCount: 0,
      totalWholesaleBookings: 0,
      bankName: 'State Bank of India',
      bankAccountName: newAgency.name,
      bankAccountNumber: '38920194821',
      bankIfsc: 'SBIN0000001',
      payoutStatus: 'verified',
    };

    setB2bAgencies((prev) => {
      const updated = [newB2BAgency, ...prev];
      saveStoredB2BAgencies(updated);
      return updated;
    });

    setIsRegisterAgencyOpen(false);
    setIsAgencyPortalOpen(true);
    showToast(`Agency "${newAgency.name}" onboarded! Total registered agencies: ${b2bAgencies.length + 1}`);
  };

  const handleUpdateAgencyProfile = (updatedAgency: Agency) => {
    setActiveAgency(updatedAgency);
    setAgenciesList((prev) => prev.map((a) => (a.id === updatedAgency.id ? updatedAgency : a)));
    // Sync across packages
    setPackages((prev) =>
      prev.map((p) => (p.agency.id === updatedAgency.id ? { ...p, agency: updatedAgency } : p))
    );
    // Sync across stories
    setStories((prev) =>
      prev.map((s) => (s.authorAgency.id === updatedAgency.id ? { ...s, authorAgency: updatedAgency } : s))
    );
    showToast(`Profile updated for ${updatedAgency.name}. All tours updated.`);
  };

  const handleAddTourPackage = (newPkg: TourPackage) => {
    setPackages((prev) => [newPkg, ...prev]);
    showToast(`Tour package "${newPkg.title}" published live on the marketplace!`);
  };

  const handleDeleteTourPackage = (pkgId: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
    showToast('Tour package removed.');
  };

  const handleAddTravelStory = (newStory: TravelStory) => {
    setStories((prev) => [newStory, ...prev]);
    showToast(`Destination guide "${newStory.title}" published to Stories Hub!`);
  };

  const handleDeleteTravelStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    showToast('Destination guide removed.');
  };

  const handleResetFilters = () => {
    setSelectedRegion('all');
    setSearchQuery('');
  };

  const scrollToPackages = () => {
    const el = document.getElementById('packages-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('financial-model');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col font-sans text-stone-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl bg-stone-900 text-white shadow-2xl border border-stone-700 flex items-center justify-between gap-3 animate-fade-in text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top B2B Operator Network Banner */}
      <B2BHeaderBanner
        activeAgency={activeB2BAgency}
        isB2BMode={isB2BMode}
        activeHoldsCount={b2bHolds.filter(h => h.status === 'active').length}
        totalAgenciesCount={b2bAgencies.length}
        isAdminLoggedIn={isAdminLoggedIn}
        onToggleB2BMode={() => setIsB2BMode(!isB2BMode)}
        onOpenB2BHub={() => handleOpenB2BHubWithTab('inventory')}
        onOpenHolds={() => handleOpenB2BHubWithTab('holds')}
        onOpenBankPayout={() => handleOpenB2BHubWithTab('payout')}
        onOpenAgenciesDirectory={() => setIsAgenciesDirectoryOpen(true)}
      />

      {/* Top Header */}
      <Header
        onOpenAgencyPortal={() => setIsAgencyPortalOpen(true)}
        onOpenBookings={() => setIsMyBookingsOpen(true)}
        onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
        onOpenCodeGuidance={() => setIsCodeGuidanceOpen(true)}
        onOpenPaymentSettings={() => setIsPaymentSettingsOpen(true)}
        onOpenB2BHub={() => setIsB2BHubOpen(true)}
        isB2BMode={isB2BMode}
        onToggleB2BMode={() => setIsB2BMode(!isB2BMode)}
        bookingsCount={bookings.length}
        agenciesCount={b2bAgencies.length}
        onOpenAgenciesDirectory={() => setIsAgenciesDirectoryOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onOpenAboutUs={() => setIsAboutUsOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={scrollToPackages}
          onPartnerClick={() => setIsRegisterAgencyOpen(true)}
          onOpenCalculator={scrollToCalculator}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* 5% + ₹1,000 Pricing & Financial Model Explainer */}
        <FinancialExplainer />

        {/* Curated Package Grid (Dynamically includes B2B Wholesale Pricing and Actions) */}
        <PackageGrid
          packages={filteredPackages}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPackage={(tour) => setSelectedPackage(tour)}
          onBookPackage={(tour) => handleOpenBooking(tour, 1)}
          onResetFilters={handleResetFilters}
          isB2BMode={isB2BMode}
          b2bAgency={activeB2BAgency}
          onHoldSlot={(pkg) => setActiveHoldPackage(pkg)}
          onGenerateQuote={(pkg) => setActiveQuotePackage(pkg)}
        />

        {/* User-Generated Content: Local Destination Stories & Travel Guides */}
        <TravelStoriesSection
          stories={stories}
          packages={packages}
          onSelectStory={(story) => setSelectedStory(story)}
          onBookPackage={(pkg) => handleOpenBooking(pkg, 1)}
          onOpenAgencyPortal={() => setIsAgencyPortalOpen(true)}
        />

        {/* How It Works (Ethical 4-Step Direct Connection) */}
        <HowItWorks />

        {/* Dedicated Local Agencies Section with Comparative Calculator */}
        <AgencySection
          onOpenAgencyPortal={() => setIsAgencyPortalOpen(true)}
          onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
        />

        {/* Verified Traveler Testimonials Carousel */}
        <TestimonialCarousel onExploreTours={scrollToPackages} />

        {/* About Us: Global Reach for Local Agencies & Direct Cost-Effective Travel */}
        <AboutUsSection
          onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
          onExploreTours={scrollToPackages}
          onOpenFullAboutModal={() => setIsAboutUsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAgencyPortal={() => setIsAgencyPortalOpen(true)}
        onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
        onOpenCodeGuidance={() => setIsCodeGuidanceOpen(true)}
        onOpenPaymentSettings={() => setIsPaymentSettingsOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onOpenAgenciesDirectory={() => setIsAgenciesDirectoryOpen(true)}
        onOpenAboutUs={() => setIsAboutUsOpen(true)}
      />

      {/* MODALS */}

      {/* 1. Package Detail Modal */}
      {selectedPackage && (
        <PackageModal
          tour={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onBook={(tour, count) => handleOpenBooking(tour, count)}
        />
      )}

      {/* 2. Destination Story / Field Journal Reader Modal */}
      {selectedStory && (
        <TravelStoryModal
          story={selectedStory}
          packages={packages}
          onClose={() => setSelectedStory(null)}
          onBookPackage={(pkg) => handleOpenBooking(pkg, 1)}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
        />
      )}

      {/* 3. Booking & Digital Payment Modal */}
      {bookingTour && (
        <BookingModal
          tour={bookingTour}
          initialTravelersCount={bookingTravelersCount}
          onClose={() => setBookingTour(null)}
          onBookingSuccess={handleBookingSuccess}
          onOpenPaymentSettings={() => setIsPaymentSettingsOpen(true)}
        />
      )}

      {/* 4. Direct Contact Unlock & Voucher Confirmation Modal */}
      {confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onOpenAgencyPortal={() => {
            setConfirmedBooking(null);
            setIsAgencyPortalOpen(true);
          }}
        />
      )}

      {/* 5. Comprehensive Vendor/Agency Dashboard & UGC Portal */}
      {isAgencyPortalOpen && (
        <AgencyDashboardModal
          bookings={bookings}
          packages={packages}
          stories={stories}
          activeAgency={activeAgency}
          allAgencies={agenciesList}
          onSwitchAgency={setActiveAgency}
          onUpdateAgencyProfile={handleUpdateAgencyProfile}
          onAddTourPackage={handleAddTourPackage}
          onDeleteTourPackage={handleDeleteTourPackage}
          onAddTravelStory={handleAddTravelStory}
          onDeleteTravelStory={handleDeleteTravelStory}
          onClose={() => setIsAgencyPortalOpen(false)}
          onSimulateNewBooking={handleSimulateNewBooking}
          onOpenRegisterModal={() => setIsRegisterAgencyOpen(true)}
          onOpenCodeGuidance={() => setIsCodeGuidanceOpen(true)}
        />
      )}

      {/* 6. Agency Partner Registration Modal */}
      {isRegisterAgencyOpen && (
        <AgencyRegisterModal
          onClose={() => setIsRegisterAgencyOpen(false)}
          onRegistered={handleAgencyRegistered}
        />
      )}

      {/* 7. Engineering & Code Integration Blueprint Modal */}
      {isCodeGuidanceOpen && (
        <CodeIntegrationModal
          onClose={() => setIsCodeGuidanceOpen(false)}
        />
      )}

      {/* 8. Traveler My Bookings Modal */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setIsMyBookingsOpen(false)}
          onSelectBooking={(b) => {
            setIsMyBookingsOpen(false);
            setConfirmedBooking(b);
          }}
        />
      )}

      {/* 9. Payment Gateway & UPI Settings Modal */}
      {isPaymentSettingsOpen && (
        <PaymentGatewayModal
          onClose={() => setIsPaymentSettingsOpen(false)}
        />
      )}

      {/* 10. B2B Operator Console & Collaboration Hub Modal */}
      {isB2BHubOpen && (
        <B2BOperatorHubModal
          packages={packages}
          activeAgency={activeB2BAgency}
          allAgencies={b2bAgencies}
          holds={b2bHolds}
          quotations={b2bQuotes}
          ledger={b2bLedger}
          initialTab={b2bHubInitialTab}
          isAdmin={isAdminLoggedIn}
          onClose={() => setIsB2BHubOpen(false)}
          onSwitchAgency={handleSwitchB2BAgency}
          onUpdateAgencyStatus={handleUpdateB2BAgencyStatus}
          onAddNewAgency={handleAddNewB2BAgency}
          onUpdateAgencyBankPayout={handleUpdateAgencyBankPayout}
          onOpenHoldModalForPackage={(pkg) => {
            setIsB2BHubOpen(false);
            setActiveHoldPackage(pkg);
          }}
          onOpenQuotationModalForPackage={(pkg) => {
            setIsB2BHubOpen(false);
            setActiveQuotePackage(pkg);
            setActiveQuotationData(null);
          }}
          onOpenBookingModalForPackage={(pkg, isB2B) => {
            setIsB2BHubOpen(false);
            handleOpenBooking(pkg, 1);
          }}
          onReleaseHold={handleReleaseHold}
          onConvertHoldToBooking={handleConvertHoldToBooking}
        />
      )}

      {/* 11. Real-Time Slot Blocking & Hold Engine Modal */}
      {activeHoldPackage && (
        <B2BHoldSlotModal
          packageData={activeHoldPackage}
          activeAgency={activeB2BAgency}
          onClose={() => setActiveHoldPackage(null)}
          onConfirmHold={handleConfirmHold}
          onPayHoldDepositWithRazorpay={(hold) => {
            handleConfirmHold(hold);
            handleConvertHoldToBooking(hold);
          }}
        />
      )}

      {/* 12. Instant Custom-Branded Quotation & Itinerary Voucher Modal */}
      {activeQuotePackage && (
        <B2BQuotationVoucherModal
          packageData={activeQuotePackage}
          activeAgency={activeB2BAgency}
          initialQuotation={activeQuotationData}
          onClose={() => {
            setActiveQuotePackage(null);
            setActiveQuotationData(null);
          }}
          onSaveQuotation={handleSaveQuotation}
          onProceedToPayAdvance={(quote) => {
            handleSaveQuotation(quote);
            setActiveQuotePackage(null);
            const pkg = packages.find(p => p.id === quote.packageId) || activeQuotePackage;
            setBookingTour(pkg);
            setBookingTravelersCount(quote.travelersCount);
          }}
        />
      )}

      {/* 13. Registered Agencies & Operators Directory Modal */}
      {isAgenciesDirectoryOpen && (
        <AgenciesDirectoryModal
          agencies={b2bAgencies}
          activeAgencyId={activeB2BAgencyId}
          onClose={() => setIsAgenciesDirectoryOpen(false)}
          onSwitchAgency={handleSwitchB2BAgency}
          onUpdateAgencyStatus={handleUpdateB2BAgencyStatus}
          onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
          onRefreshFromSupabase={async () => {
            const res = await fetchAgenciesFromSupabase();
            if (res.success && res.data) {
              const fetchedB2B = res.data.map(mapSupabaseRowToB2BAgency);
              setB2bAgencies(prev => {
                const existingNames = new Set(prev.map(p => p.agencyName.toLowerCase()));
                const newEntries = fetchedB2B.filter(f => !existingNames.has(f.agencyName.toLowerCase()));
                const updated = [...newEntries, ...prev];
                saveStoredB2BAgencies(updated);
                return updated;
              });
              showToast(`Refreshed ${res.data.length} agencies from Supabase!`);
            }
          }}
          onOpenAgencyPortalFor={(b2bAg) => {
            const matchedAgency: Agency = agenciesList.find(a => a.id === b2bAg.id || a.name === b2bAg.agencyName) || {
              id: b2bAg.id,
              name: b2bAg.agencyName,
              founder: b2bAg.contactPerson,
              baseCity: b2bAg.city,
              state: b2bAg.state,
              phone: b2bAg.phone,
              whatsapp: b2bAg.whatsapp,
              email: b2bAg.email,
              licenseNumber: b2bAg.tourismLicenseNo,
              verifiedSince: '2023',
              rating: 5.0,
              totalToursCompleted: b2bAg.totalWholesaleBookings || 12,
              bio: `${b2bAg.agencyName} is an authorized local travel operator.`,
              specialty: b2bAg.operatorType,
              status: b2bAg.status,
              bankName: b2bAg.bankName,
              bankAccountNumber: b2bAg.bankAccountNumber,
              bankIfsc: b2bAg.bankIfsc,
              upiId: b2bAg.upiId,
              payoutStatus: b2bAg.payoutStatus,
            };
            setActiveAgency(matchedAgency);
            setIsAgencyPortalOpen(true);
          }}
        />
      )}

      {/* 14. Platform Admin Security & Login Modal */}
      {isAdminLoginModalOpen && (
        <AdminLoginModal
          isAdminLoggedIn={isAdminLoggedIn}
          onClose={() => setIsAdminLoginModalOpen(false)}
          onLoginSuccess={handleAdminLoginSuccess}
          onLogout={handleAdminLogout}
        />
      )}

      {/* 15. About Us Modal */}
      {isAboutUsOpen && (
        <AboutUsModal
          onClose={() => setIsAboutUsOpen(false)}
          onOpenRegisterAgency={() => {
            setIsAboutUsOpen(false);
            setIsRegisterAgencyOpen(true);
          }}
          onExploreTours={() => {
            setIsAboutUsOpen(false);
            scrollToPackages();
          }}
        />
      )}

      {/* Official Floating WhatsApp Chat Widget */}
      <FloatingWhatsAppButton phoneNumber="6913514367" />
    </div>
  );
}
