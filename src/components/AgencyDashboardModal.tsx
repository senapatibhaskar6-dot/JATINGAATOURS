import React, { useState } from 'react';
import { BookingRecord, Agency, TourPackage, TravelStory } from '../types';
import { formatINR } from '../utils/pricing';
import {
  X, ShieldCheck, Phone, MessageSquare, Calendar, Users, ArrowUpRight,
  Banknote, CheckCircle2, Clock, Sparkles, Plus, Trash2, Edit3, MapPin,
  Compass, BookOpen, Code2, AlertCircle, FileText, ChevronDown, Check,
  Camera, Image as ImageIcon
} from 'lucide-react';

import heroImg from '../assets/images/hero_jatingaa_landscape_1790299532077.jpg';
import ladakhImg from '../assets/images/tour_ladakh_himalayas_1790299546121.jpg';
import keralaImg from '../assets/images/tour_kerala_backwaters_1790299559090.jpg';
import rajasthanImg from '../assets/images/tour_rajasthan_heritage_1790299571893.jpg';
import scenicImg from '../assets/images/scenic_nature_hero_1790322395376.jpg';
import { PhotoCaptureUploader } from './PhotoCaptureUploader';

const DESTINATION_PRESETS = [
  { name: 'Khasi Hills (Sohra)', img: heroImg },
  { name: 'Ladakh Passes', img: ladakhImg },
  { name: 'Kerala Backwaters', img: keralaImg },
  { name: 'Thar Heritage Desert', img: rajasthanImg },
  { name: 'Scenic River Valleys', img: scenicImg },
];

interface AgencyDashboardModalProps {
  bookings: BookingRecord[];
  packages: TourPackage[];
  stories: TravelStory[];
  activeAgency: Agency;
  allAgencies: Agency[];
  onSwitchAgency: (agency: Agency) => void;
  onUpdateAgencyProfile: (agency: Agency) => void;
  onAddTourPackage: (pkg: TourPackage) => void;
  onDeleteTourPackage: (pkgId: string) => void;
  onAddTravelStory: (story: TravelStory) => void;
  onDeleteTravelStory: (storyId: string) => void;
  onClose: () => void;
  onSimulateNewBooking: () => void;
  onOpenRegisterModal: () => void;
  onOpenCodeGuidance: () => void;
}

export const AgencyDashboardModal: React.FC<AgencyDashboardModalProps> = ({
  bookings,
  packages,
  stories,
  activeAgency,
  allAgencies,
  onSwitchAgency,
  onUpdateAgencyProfile,
  onAddTourPackage,
  onDeleteTourPackage,
  onAddTravelStory,
  onDeleteTravelStory,
  onClose,
  onSimulateNewBooking,
  onOpenRegisterModal,
  onOpenCodeGuidance,
}) => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'packages' | 'stories' | 'profile' | 'code'>('dispatch');

  // Filter bookings, packages, and stories for active agency
  const agencyBookings = bookings.filter((b) => b.agency.id === activeAgency.id);
  const agencyPackages = packages.filter((p) => p.agency.id === activeAgency.id);
  const agencyStories = stories.filter((s) => s.authorAgency.id === activeAgency.id);

  // Stats
  const totalAdvancesCollected = agencyBookings.reduce((sum, b) => sum + b.calculation.agencyAdvanceFee, 0);
  const totalArrivalDue = agencyBookings.reduce((sum, b) => sum + b.calculation.remainingBalanceDueOnArrival, 0);

  // Edit Profile Form State
  const [profileName, setProfileName] = useState(activeAgency.name);
  const [profileFounder, setProfileFounder] = useState(activeAgency.founder);
  const [profilePhone, setProfilePhone] = useState(activeAgency.phone);
  const [profileWhatsapp, setProfileWhatsapp] = useState(activeAgency.whatsapp);
  const [profileEmail, setProfileEmail] = useState(activeAgency.email);
  const [profileCity, setProfileCity] = useState(activeAgency.baseCity);
  const [profileState, setProfileState] = useState(activeAgency.state);
  const [profileLicense, setProfileLicense] = useState(activeAgency.licenseNumber);
  const [profileBio, setProfileBio] = useState(activeAgency.bio);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // New Package Form State
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgTagline, setNewPkgTagline] = useState('');
  const [newPkgRegion, setNewPkgRegion] = useState<'northeast' | 'himalayas' | 'south' | 'west' | 'islands'>('northeast');
  const [newPkgLocation, setNewPkgLocation] = useState('');
  const [newPkgStartPoint, setNewPkgStartPoint] = useState('');
  const [newPkgDuration, setNewPkgDuration] = useState('5 Days / 4 Nights');
  const [newPkgDays, setNewPkgDays] = useState<number>(5);
  const [newPkgPrice, setNewPkgPrice] = useState<number>(18000);
  const [newPkgImage, setNewPkgImage] = useState<string>(heroImg);
  const [newPkgBestSeason, setNewPkgBestSeason] = useState('October – April');
  const [newPkgGroupType, setNewPkgGroupType] = useState<'Small Group (Max 8)' | 'Private Guided' | 'Community Homestay'>('Small Group (Max 8)');
  const [newPkgFitness, setNewPkgFitness] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');
  const [newPkgInclusions, setNewPkgInclusions] = useState('All indigenous homestays, native guide fee, local 4x4 transport, traditional breakfast & dinner, village conservation permits');
  const [newPkgExclusions, setNewPkgExclusions] = useState('Flights or train tickets, personal gear, items not listed');

  // Itinerary in New Package Form
  const [itineraryDays, setItineraryDays] = useState([
    {
      day: 1,
      title: 'Arrival & Native Welcome Gathering',
      description: 'Receive personal greeting from lead local guide, transfer to heritage homestay, and enjoy traditional dinner.',
      highlights: 'Airport / station pickup, indigenous herbal welcome tea, detailed route briefing',
    },
    {
      day: 2,
      title: 'Forest Trail & Community Homestay Immersion',
      description: 'Gentle trek through native valleys, sacred streams, and interaction with village artisans.',
      highlights: 'Natural spring waterfalls, craft demonstration, farm-fresh lunch',
    },
  ]);

  // New Story Form State
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStorySubtitle, setNewStorySubtitle] = useState('');
  const [newStoryDestination, setNewStoryDestination] = useState('');
  const [newStoryRegion, setNewStoryRegion] = useState<'northeast' | 'himalayas' | 'south' | 'west' | 'islands'>('northeast');
  const [newStoryReadTime, setNewStoryReadTime] = useState<number>(5);
  const [newStoryImage, setNewStoryImage] = useState<string>(scenicImg);
  const [newStoryParagraphs, setNewStoryParagraphs] = useState('');
  const [newStoryTips, setNewStoryTips] = useState('');
  const [newStoryEtiquette, setNewStoryEtiquette] = useState('');
  const [newStorySeason, setNewStorySeason] = useState('October to May');
  const [newStoryTags, setNewStoryTags] = useState('Native Guide, Sustainable Travel, Heritage');

  // Switch operator helper
  const handleSelectAgencyChange = (agencyId: string) => {
    const found = allAgencies.find((a) => a.id === agencyId);
    if (found) {
      onSwitchAgency(found);
      setProfileName(found.name);
      setProfileFounder(found.founder);
      setProfilePhone(found.phone);
      setProfileWhatsapp(found.whatsapp);
      setProfileEmail(found.email);
      setProfileCity(found.baseCity);
      setProfileState(found.state);
      setProfileLicense(found.licenseNumber);
      setProfileBio(found.bio);
    }
  };

  // Submit profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Agency = {
      ...activeAgency,
      name: profileName,
      founder: profileFounder,
      phone: profilePhone,
      whatsapp: profileWhatsapp,
      email: profileEmail,
      baseCity: profileCity,
      state: profileState,
      licenseNumber: profileLicense,
      bio: profileBio,
    };
    onUpdateAgencyProfile(updated);
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  // Add Day to Itinerary
  const handleAddItineraryDay = () => {
    const nextDay = itineraryDays.length + 1;
    setItineraryDays((prev) => [
      ...prev,
      {
        day: nextDay,
        title: `Day ${nextDay} Exploration`,
        description: 'Guided excursion to sacred viewpoints and cultural exchange with local elders.',
        highlights: 'Native meal, scenic photo vantage point',
      },
    ]);
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (itineraryDays.length <= 1) return;
    setItineraryDays((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit New Tour Package
  const handleSubmitNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle || !newPkgLocation || newPkgPrice <= 0) {
      alert('Please fill in title, location, and a valid package price.');
      return;
    }

    const regionLabels = {
      northeast: 'Northeast India',
      himalayas: 'Himalayan Frontier',
      south: 'South India',
      west: 'Western Deserts',
      islands: 'Islands & Coastal',
    };

    const newTour: TourPackage = {
      id: `pkg-ugc-${Date.now()}`,
      title: newPkgTitle,
      tagline: newPkgTagline || `Experience ${newPkgLocation} with native guide ${activeAgency.founder}.`,
      region: newPkgRegion,
      regionLabel: regionLabels[newPkgRegion],
      location: newPkgLocation,
      duration: newPkgDuration,
      daysCount: newPkgDays,
      groupType: newPkgGroupType,
      fitnessLevel: newPkgFitness,
      pricePerPerson: newPkgPrice,
      image: newPkgImage,
      gallery: [newPkgImage],
      agency: activeAgency,
      itinerary: itineraryDays.map((d, idx) => ({
        day: idx + 1,
        title: d.title,
        description: d.description,
        highlights: d.highlights ? d.highlights.split(',').map((h) => h.trim()) : [],
      })),
      inclusions: newPkgInclusions.split(',').map((s) => s.trim()).filter(Boolean),
      exclusions: newPkgExclusions.split(',').map((s) => s.trim()).filter(Boolean),
      bestSeason: newPkgBestSeason,
      startingPoint: newPkgStartPoint || newPkgLocation,
      moderationStatus: 'published', // Verified agencies publish live directly
      isUserGenerated: true,
      featured: true,
    };

    onAddTourPackage(newTour);
    setIsCreatingPackage(false);
    // Reset form
    setNewPkgTitle('');
    setNewPkgTagline('');
    setNewPkgLocation('');
  };

  // Submit New Travel Story
  const handleSubmitNewStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle || !newStoryDestination || !newStoryParagraphs) {
      alert('Please enter a story title, destination, and article paragraphs.');
      return;
    }

    const regionLabels = {
      northeast: 'Northeast India',
      himalayas: 'Himalayan Frontier',
      south: 'South India',
      west: 'Western Deserts',
      islands: 'Islands & Coastal',
    };

    const newStory: TravelStory = {
      id: `story-ugc-${Date.now()}`,
      title: newStoryTitle,
      subtitle: newStorySubtitle || `An insider travel journal to ${newStoryDestination} from ${activeAgency.name}.`,
      slug: newStoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      coverImage: newStoryImage,
      galleryImages: [newStoryImage],
      region: newStoryRegion,
      regionLabel: regionLabels[newStoryRegion],
      destination: newStoryDestination,
      authorAgency: activeAgency,
      authorRole: `${activeAgency.founder} (Lead Native Guide)`,
      readTimeMinutes: newStoryReadTime || 5,
      publishedDate: new Date().toISOString().split('T')[0],
      contentParagraphs: newStoryParagraphs.split('\n\n').map((p) => p.trim()).filter(Boolean),
      insiderTips: newStoryTips ? newStoryTips.split('\n').map((t) => t.trim()).filter(Boolean) : [
        'Connect directly with village elders before exploring sacred paths.',
        'Carry reusable filtered water bottles to protect forest streams.',
      ],
      culturalEtiquette: newStoryEtiquette ? newStoryEtiquette.split('\n').map((e) => e.trim()).filter(Boolean) : [
        'Respect indigenous customs and dress modestly when entering village pathways.',
        'Do not litter or leave non-biodegradable waste.',
      ],
      bestVisitingMonths: newStorySeason,
      associatedPackageId: agencyPackages[0]?.id,
      tags: newStoryTags.split(',').map((t) => t.trim()).filter(Boolean),
      moderationStatus: 'published',
      likesCount: 1,
      isUserGenerated: true,
    };

    onAddTravelStory(newStory);
    setIsCreatingStory(false);
    // Reset form
    setNewStoryTitle('');
    setNewStorySubtitle('');
    setNewStoryDestination('');
    setNewStoryParagraphs('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header with Operator Profile & Account Switcher */}
        <div className="px-6 py-4 bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b4619] flex items-center justify-center text-[#f39c12] shrink-0 border border-emerald-400/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  {activeAgency.name}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-medium border border-emerald-500/30">
                  GOVT VERIFIED COLLECTIVE
                </span>
                <span className="text-[10px] bg-[#f39c12]/20 text-[#f39c12] px-2 py-0.5 rounded font-semibold">
                  0% Agency Deduction Policy
                </span>
              </div>
              <div className="text-xs text-stone-400 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>Host: <strong>{activeAgency.founder}</strong></span>
                <span>·</span>
                <span>{activeAgency.baseCity}, {activeAgency.state}</span>
                <span>·</span>
                <span className="font-mono text-[11px] text-stone-300">Reg: {activeAgency.licenseNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick Operator Switcher & Close */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <div className="relative">
              <select
                value={activeAgency.id}
                onChange={(e) => handleSelectAgencyChange(e.target.value)}
                className="bg-stone-800 text-stone-200 text-xs px-3 py-1.5 rounded-lg border border-stone-700 hover:border-stone-600 focus:outline-none cursor-pointer"
                title="Switch active tour operator account"
              >
                {allAgencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    Switch to: {agency.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenRegisterModal}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#f39c12] bg-[#f39c12]/10 hover:bg-[#f39c12]/20 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Register a new agency account"
            >
              + Register
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('dispatch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dispatch'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bookings & Direct Dispatch</span>
              {agencyBookings.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                  {agencyBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'packages'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>My Tour Packages (UGC)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-300 text-stone-800 font-mono">
                {agencyPackages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stories'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Destination Travel Guides (UGC)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-300 text-stone-800 font-mono">
                {agencyStories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manage Profile & Credentials</span>
            </button>
          </div>

          <button
            onClick={onOpenCodeGuidance}
            className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Code2 className="w-3.5 h-3.5 text-[#0b4619]" />
            <span>Dev Blueprint (Supabase / Storage)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* TAB 1: DISPATCH & BOOKINGS */}
          {activeTab === 'dispatch' && (
            <div className="space-y-6">
              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                  <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                    Instant Advances Credited
                  </div>
                  <div className="text-2xl font-bold text-[#0b4619] font-mono tabular-nums mt-1">
                    {formatINR(totalAdvancesCollected)}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    ₹1,000 upfront advance per verified booking
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 shadow-xs">
                  <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Balance Due On Arrival (Direct Cash/UPI)
                  </div>
                  <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                    {formatINR(totalArrivalDue)}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    100% collected by you when guests arrive
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Confirmed Bookings
                    </div>
                    <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                      {agencyBookings.length}
                    </div>
                  </div>
                  <button
                    onClick={onSimulateNewBooking}
                    className="mt-2 px-3 py-1.5 text-xs font-semibold text-[#0b4619] bg-emerald-100/70 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#f39c12]" />
                    <span>Simulate Incoming Booking</span>
                  </button>
                </div>
              </div>

              {/* Verified Bookings List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                    Direct Traveler Dispatch Feed ({agencyBookings.length})
                  </h3>
                  <span className="text-xs text-stone-500">
                    Direct phone & WhatsApp numbers unlocked with zero platform commission
                  </span>
                </div>

                {agencyBookings.length > 0 ? (
                  <div className="space-y-4">
                    {agencyBookings.map((b) => {
                      const cleanPhone = b.customerPhone.replace(/[^0-9]/g, '');
                      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Namaste ${b.customerName}! This is ${b.agency.founder} from ${b.agency.name}. We have received your confirmed booking ${b.bookingCode} for ${b.packageTitle} starting ${b.travelDate}. We look forward to hosting you!`
                      )}`;

                      return (
                        <div
                          key={b.id}
                          className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-stone-300 transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#0b4619] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {b.bookingCode}
                                </span>
                                <h4 className="text-sm font-bold text-stone-900 font-display">
                                  {b.packageTitle}
                                </h4>
                              </div>
                              <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                <span>Travel Date: <strong>{b.travelDate}</strong></span>
                                <span>·</span>
                                <Users className="w-3.5 h-3.5 text-stone-400" />
                                <span>{b.travelersCount} Traveler(s)</span>
                              </div>
                            </div>

                            <div className="text-right text-xs">
                              <span className="font-semibold text-emerald-800">
                                Advance Credited: +{formatINR(b.calculation.agencyAdvanceFee)}
                              </span>
                              <div className="text-[11px] text-stone-500">
                                Collect on arrival: <strong>{formatINR(b.calculation.remainingBalanceDueOnArrival)}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-8 space-y-1 text-xs">
                              <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                                Direct Traveler Contact
                              </div>
                              <div className="text-sm font-semibold text-stone-900">
                                {b.customerName} <span className="text-stone-400 font-normal">from {b.customerCity}</span>
                              </div>
                              <div className="text-stone-600 flex flex-wrap items-center gap-3">
                                <span>{b.customerEmail}</span>
                                <span>·</span>
                                <span className="font-mono font-medium">{b.customerPhone}</span>
                              </div>
                              {b.specialRequests && (
                                <div className="p-2 rounded bg-stone-50 border border-stone-200 text-stone-600 text-[11px] italic mt-1">
                                  &ldquo;{b.specialRequests}&rdquo;
                                </div>
                              )}
                            </div>

                            <div className="sm:col-span-4 flex flex-col sm:items-end gap-2">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Phone className="w-3 h-3 text-[#0b4619]" />
                                <span>Call Traveler</span>
                              </a>

                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <MessageSquare className="w-3 h-3 text-white" />
                                <span>WhatsApp Traveler</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-center text-stone-500 text-xs space-y-2">
                    <p>No traveler bookings dispatched yet for {activeAgency.name}.</p>
                    <button
                      onClick={onSimulateNewBooking}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#0b4619] bg-white border border-[#0b4619]/30 rounded-lg hover:bg-[#0b4619]/5 transition-colors cursor-pointer"
                    >
                      Simulate Incoming Traveler Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TOUR PACKAGES (UGC) */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Your Listed Tour Packages ({agencyPackages.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Direct expedition packages displayed dynamically on Jatingaa Tours.
                  </p>
                </div>

                {!isCreatingPackage && (
                  <button
                    onClick={() => setIsCreatingPackage(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-[#f39c12]" />
                    <span>List New Tour Package</span>
                  </button>
                )}
              </div>

              {/* CREATE PACKAGE FORM */}
              {isCreatingPackage ? (
                <form onSubmit={handleSubmitNewPackage} className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#0b4619]" />
                      <h4 className="text-sm font-bold text-stone-900 font-display">
                        Create & Publish New Tour Package
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreatingPackage(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Tour Package Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hidden Waterfalls & Ancient Root Bridges of Sohra"
                        value={newPkgTitle}
                        onChange={(e) => setNewPkgTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Region & Territory *
                      </label>
                      <select
                        value={newPkgRegion}
                        onChange={(e) => setNewPkgRegion(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                      >
                        <option value="northeast">Northeast India (Meghalaya, Assam, Arunachal)</option>
                        <option value="himalayas">Himalayan Frontier (Ladakh, Spiti, Kashmir)</option>
                        <option value="south">South India (Kerala, Western Ghats, Karnataka)</option>
                        <option value="west">Western Deserts (Rajasthan, Thar, Kutch)</option>
                        <option value="islands">Islands & Coastal (Andamans, Lakshadweep)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Specific Location / Route *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nongriat & Cherrapunji, Meghalaya"
                        value={newPkgLocation}
                        onChange={(e) => setNewPkgLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Starting Point / Airport *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Guwahati Airport (GAU) or Leh Airport"
                        value={newPkgStartPoint}
                        onChange={(e) => setNewPkgStartPoint(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Duration Label & Days Count *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5 Days / 4 Nights"
                          value={newPkgDuration}
                          onChange={(e) => setNewPkgDuration(e.target.value)}
                          className="px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                        />
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={newPkgDays}
                          onChange={(e) => setNewPkgDays(Number(e.target.value))}
                          className="px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                          title="Days count"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Package Price Per Person (INR) *
                      </label>
                      <input
                        type="number"
                        min={1000}
                        step={500}
                        required
                        value={newPkgPrice}
                        onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 font-mono bg-white"
                      />
                    </div>
                  </div>

                  {/* Financial Breakdown Card for this price */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-[#0b4619] flex items-center justify-between">
                      <span>Transparent Financial Settlement:</span>
                      <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">
                        0% Commission Deducted from Agency
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div>
                        Traveler pays on checkout: <strong className="text-stone-900">₹1,000</strong> (Instant Advance) + <span className="text-stone-500">5% fee (₹{Math.round(newPkgPrice * 0.05)})</span>
                      </div>
                      <div>
                        Instant advance credited to you: <strong className="text-emerald-800">₹1,000 / booking</strong>
                      </div>
                      <div>
                        Balance collected directly on arrival: <strong className="text-stone-900 font-mono">₹{(newPkgPrice - 1000).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Photo & Live Camera Uploader */}
                  <PhotoCaptureUploader
                    label="Destination Cover Photo & Live Camera Capture"
                    helpText="Take a live photo using device camera (triggers browser camera permission prompt / কেমেৰা পাৰ্মিছন ল'ব), browse gallery, or pick a verified preset."
                    currentImage={newPkgImage}
                    onImageChange={setNewPkgImage}
                    presets={DESTINATION_PRESETS}
                  />

                  {/* Itinerary Builder */}
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Day-by-Day Itinerary Plan
                      </label>
                      <button
                        type="button"
                        onClick={handleAddItineraryDay}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0b4619] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Day</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {itineraryDays.map((dayItem, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0b4619]">Day {idx + 1}</span>
                            {itineraryDays.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItineraryDay(idx)}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer"
                                title="Remove Day"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Day Title"
                            value={dayItem.title}
                            onChange={(e) => {
                              const updated = [...itineraryDays];
                              updated[idx].title = e.target.value;
                              setItineraryDays(updated);
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs text-stone-900"
                          />
                          <textarea
                            placeholder="Description of activities and sights"
                            rows={2}
                            value={dayItem.description}
                            onChange={(e) => {
                              const updated = [...itineraryDays];
                              updated[idx].description = e.target.value;
                              setItineraryDays(updated);
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs text-stone-900"
                          />
                          <input
                            type="text"
                            placeholder="Key Highlights (comma-separated)"
                            value={dayItem.highlights}
                            onChange={(e) => {
                              const updated = [...itineraryDays];
                              updated[idx].highlights = e.target.value;
                              setItineraryDays(updated);
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs text-stone-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions & Exclusions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Package Inclusions (comma-separated)
                      </label>
                      <textarea
                        rows={2}
                        value={newPkgInclusions}
                        onChange={(e) => setNewPkgInclusions(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 text-stone-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Package Exclusions (comma-separated)
                      </label>
                      <textarea
                        rows={2}
                        value={newPkgExclusions}
                        onChange={(e) => setNewPkgExclusions(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 text-stone-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPackage(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-[#f39c12]" />
                      <span>Publish Package Live</span>
                    </button>
                  </div>
                </form>
              ) : null}

              {/* LIST OF PACKAGES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agencyPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2.5 bg-stone-900">
                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#f39c12] text-stone-950 px-2 py-0.5 rounded shadow-xs uppercase">
                          {pkg.regionLabel}
                        </span>
                        <span className="absolute top-2 right-2 text-[10px] font-semibold bg-emerald-700 text-white px-1.5 py-0.5 rounded shadow-xs">
                          Live On Site
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 font-display line-clamp-2">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {pkg.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-[#0b4619]">
                          {formatINR(pkg.pricePerPerson)}
                        </div>
                        <div className="text-[10px] text-stone-400">{pkg.duration}</div>
                      </div>

                      <button
                        onClick={() => onDeleteTourPackage(pkg.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Tour Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DESTINATION TRAVEL GUIDES & PHOTO STORIES (UGC) */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Your Destination Guides & Field Journals ({agencyStories.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    High-value insider articles providing authentic knowledge, cultural etiquette, and SEO reach.
                  </p>
                </div>

                {!isCreatingStory && (
                  <button
                    onClick={() => setIsCreatingStory(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-[#f39c12]" />
                    <span>Write Destination Guide</span>
                  </button>
                )}
              </div>

              {/* CREATE STORY FORM */}
              {isCreatingStory ? (
                <form onSubmit={handleSubmitNewStory} className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#0b4619]" />
                      <h4 className="text-sm font-bold text-stone-900 font-display">
                        Write a New Destination Field Guide
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreatingStory(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Guide Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Walking Ancient Trails: The Hidden Waterfalls of Nongriat"
                        value={newStoryTitle}
                        onChange={(e) => setNewStoryTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Destination & Region *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sohra, Meghalaya"
                          value={newStoryDestination}
                          onChange={(e) => setNewStoryDestination(e.target.value)}
                          className="px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                        />
                        <select
                          value={newStoryRegion}
                          onChange={(e) => setNewStoryRegion(e.target.value as any)}
                          className="px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                        >
                          <option value="northeast">Northeast</option>
                          <option value="himalayas">Himalayas</option>
                          <option value="south">South India</option>
                          <option value="west">Western Deserts</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Short Subtitle / Hook *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. An indigenous guide's perspective on visiting root bridges with zero plastic waste."
                      value={newStorySubtitle}
                      onChange={(e) => setNewStorySubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                    />
                  </div>

                  {/* Article Body with Live Word Count & Writing Guidelines */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-stone-700">
                        Article Body (Double line break between paragraphs) *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                          (newStoryParagraphs.trim() ? newStoryParagraphs.trim().split(/\s+/).length : 0) < 50
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : (newStoryParagraphs.trim() ? newStoryParagraphs.trim().split(/\s+/).length : 0) <= 800
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {newStoryParagraphs.trim() ? newStoryParagraphs.trim().split(/\s+/).length : 0} words
                          {' '}(~{Math.max(1, Math.ceil((newStoryParagraphs.trim() ? newStoryParagraphs.trim().split(/\s+/).length : 0) / 180))} min read)
                        </span>
                      </div>
                    </div>

                    <textarea
                      required
                      rows={6}
                      placeholder="Share real local history, geographical details, hidden spots, and personal experiences as an indigenous guide..."
                      value={newStoryParagraphs}
                      onChange={(e) => setNewStoryParagraphs(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white leading-relaxed focus:ring-1 focus:ring-[#0b4619]"
                    />

                    {/* Word Limit & Length Guidance Bar */}
                    <div className="mt-1.5 p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-[11px] text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-stone-800">শব্দৰ পৰিমাণ (Word Guidance):</span>
                        <span className="text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                          আদৰ্শ দৈৰ্ঘ্য: ৩০০ — ৮০০ শব্দ
                        </span>
                        <span className="text-stone-500">
                          (নূন্যতম ৫০ শব্দৰ পৰা সৰ্বোচ্চ ৩,০০০+ শব্দলৈকে লিখিব পাৰিব)
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 italic">
                        SEO & Reader Engagement Friendly
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Native Insider Tips (One per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Start descent before 7:30 AM to beat midday heat&#10;Carry bamboo walking stick&#10;Taste wild honey from village mothers"
                        value={newStoryTips}
                        onChange={(e) => setNewStoryTips(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Cultural Etiquette & Respect (One per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Never scratch root bark on living bridges&#10;Dress modestly on village paths&#10;Ask before photographing elders"
                        value={newStoryEtiquette}
                        onChange={(e) => setNewStoryEtiquette(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Field Guide Cover Photo with Live Camera & Gallery */}
                  <PhotoCaptureUploader
                    label="Destination Story Cover Photo & Live Camera"
                    helpText="Snap photos with your live camera (browser asks for camera permission / কেমেৰা পাৰ্মিছন ল'ব), upload from phone storage, or select a preset."
                    currentImage={newStoryImage}
                    onImageChange={setNewStoryImage}
                    presets={DESTINATION_PRESETS}
                  />

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingStory(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-[#f39c12]" />
                      <span>Publish Travel Guide</span>
                    </button>
                  </div>
                </form>
              ) : null}

              {/* LIST OF STORIES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agencyStories.map((story) => (
                  <div
                    key={story.id}
                    className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2.5 bg-stone-900">
                        <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#f39c12] text-stone-950 px-2 py-0.5 rounded shadow-xs uppercase">
                          {story.regionLabel}
                        </span>
                        <span className="absolute top-2 right-2 text-[10px] font-semibold bg-emerald-700 text-white px-1.5 py-0.5 rounded shadow-xs">
                          Published
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 font-display line-clamp-2">
                        {story.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {story.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>{story.destination}</span>
                      <button
                        onClick={() => onDeleteTravelStory(story.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & CREDENTIALS */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="pb-3 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Agency Profile & Govt Tourism Credentials
                </h3>
                <p className="text-xs text-stone-500">
                  Update your contact details, lead guide credentials, and regional license number.
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0b4619]" />
                  <span>Agency profile and credentials successfully updated!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Founder / Lead Native Guide
                    </label>
                    <input
                      type="text"
                      required
                      value={profileFounder}
                      onChange={(e) => setProfileFounder(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Direct WhatsApp (For Travelers)
                    </label>
                    <input
                      type="text"
                      required
                      value={profileWhatsapp}
                      onChange={(e) => setProfileWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Govt Tourism Reg / GSTIN #
                    </label>
                    <input
                      type="text"
                      required
                      value={profileLicense}
                      onChange={(e) => setProfileLicense(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Base City
                    </label>
                    <input
                      type="text"
                      required
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      State / UT
                    </label>
                    <input
                      type="text"
                      required
                      value={profileState}
                      onChange={(e) => setProfileState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Agency Mission & Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#f39c12]" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 hidden sm:block">
            Logged in as: <strong className="text-stone-800">{activeAgency.name}</strong> · 100% Package Value Retained
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer ml-auto"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
