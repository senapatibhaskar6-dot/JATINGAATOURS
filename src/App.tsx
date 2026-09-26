import React, { useState, useMemo } from 'react';
import { TourPackage, BookingRecord, Agency, TravelStory } from './types';
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
  const [isCodeGuidanceOpen, setIsCodeGuidanceOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

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
    setIsRegisterAgencyOpen(false);
    setIsAgencyPortalOpen(true);
    showToast(`Agency "${newAgency.name}" onboarded! Opened your Vendor Portal to list packages.`);
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

      {/* Top Header */}
      <Header
        onOpenAgencyPortal={() => setIsAgencyPortalOpen(true)}
        onOpenBookings={() => setIsMyBookingsOpen(true)}
        onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
        onOpenCodeGuidance={() => setIsCodeGuidanceOpen(true)}
        bookingsCount={bookings.length}
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

        {/* Curated Package Grid (Dynamically includes newly added vendor packages!) */}
        <PackageGrid
          packages={filteredPackages}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPackage={(tour) => setSelectedPackage(tour)}
          onBookPackage={(tour) => handleOpenBooking(tour, 1)}
          onResetFilters={handleResetFilters}
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
      </main>

      {/* Footer */}
      <Footer
        onOpenAgencyPortal={() => setIsAgencyPortalOpen(true)}
        onOpenRegisterAgency={() => setIsRegisterAgencyOpen(true)}
        onOpenCodeGuidance={() => setIsCodeGuidanceOpen(true)}
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
    </div>
  );
}
