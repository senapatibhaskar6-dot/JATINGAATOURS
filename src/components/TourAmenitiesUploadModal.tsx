import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Building2,
  Compass,
  Bed,
  Utensils,
  Car,
  Shield,
  Ticket,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { TourPackage, Agency } from '../types';
import { GuideProfile } from '../data/guidesData';
import { formatINR } from '../utils/pricing';
import heroImg from '../assets/images/hero_jatingaa_landscape_1790299532077.jpg';
import scenicImg from '../assets/images/scenic_nature_hero_1790322395376.jpg';
import keralaImg from '../assets/images/tour_kerala_backwaters_1790299559090.jpg';
import ladakhImg from '../assets/images/tour_ladakh_himalayas_1790299546121.jpg';
import rajasthanImg from '../assets/images/tour_rajasthan_heritage_1790299571893.jpg';

interface TourAmenitiesUploadModalProps {
  onClose: () => void;
  onAddPackage: (pkg: TourPackage) => void;
  agencies: Agency[];
  guides: GuideProfile[];
  preSelectedAgencyId?: string;
  preSelectedGuideId?: string;
}

export const TourAmenitiesUploadModal: React.FC<TourAmenitiesUploadModalProps> = ({
  onClose,
  onAddPackage,
  agencies,
  guides,
  preSelectedAgencyId,
  preSelectedGuideId,
}) => {
  // Host type: Agency Owner or Guide
  const [hostType, setHostType] = useState<'agency' | 'guide'>(
    preSelectedGuideId ? 'guide' : 'agency'
  );

  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(
    preSelectedAgencyId || (agencies[0]?.id || 'ag-custom-1')
  );
  const [selectedGuideId, setSelectedGuideId] = useState<string>(
    preSelectedGuideId || (guides[0]?.id || 'gd-01')
  );

  // Package Core Info
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3 Days / 2 Nights');
  const [daysCount, setDaysCount] = useState<number>(3);
  const [pricePerPerson, setPricePerPerson] = useState<number>(5000); // Default ₹5,000 as per prompt!
  const [selectedImage, setSelectedImage] = useState<string>(heroImg);
  const [region, setRegion] = useState<'northeast' | 'himalayas' | 'south' | 'west' | 'islands'>('northeast');

  // Pre-configured Amenities Categories
  const defaultInclusions = [
    '2 Nights Heritage Eco-Cottage / Homestay Stay (Hot Water & Clean Bath)',
    'Daily Healthy Morning Tea & Fresh Local Breakfast',
    'Authentic Traditional Lunch Thali (Local Cuisine)',
    'Deluxe Dinner Included Every Evening',
    'Daily Packaged Mineral Water Bottles per Traveler',
    'Private AC Vehicle / 4x4 Gypsy for All Sightseeing (Fuel & Driver Allowance included)',
    'Airport or Railway Station Pick-up and Drop-off Transfers',
    'Certified Native Field Naturalist / Tour Guide Throughout',
    '1 National Park Jeep Safari with Forest Permits & Entry Passes',
    'Local Cultural Village Walk, Mask Crafts & Folk Performance',
    'Emergency First-Aid Medical Kit & Safety Assistance',
  ];

  const [inclusions, setInclusions] = useState<string[]>(defaultInclusions);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // Exclusions (Not Covered)
  const defaultExclusions = [
    'Personal shopping, souvenirs, and tips',
    'Airfare or interstate train tickets to base airport/station',
    'Commercial video / camera permit fees charged by forest dept',
  ];
  const [exclusions, setExclusions] = useState<string[]>(defaultExclusions);
  const [customExclusionInput, setCustomExclusionInput] = useState('');

  // Sample quick amenity choices
  const quickAmenities = [
    '🏨 Verified Homestay / Eco-Resort Accommodation',
    '☕ Morning Tea & Fresh Local Breakfast Daily',
    '🍛 Traditional Organic Lunch (Local Cuisine)',
    '🍲 Delicious Dinner Included Every Night',
    '🚙 Dedicated AC Vehicle / 4x4 Gypsy with Fuel',
    '🛬 Airport & Railway Station Pick-up / Drop',
    '🧗 Certified Native Local Tour Guide Included',
    '🎟️ National Park Jeep Safari & Forest Permits',
    '🚣 Country Boat River Cruise & Sunset Experience',
    '🔥 Evening Campfire & Cultural Music',
    '💧 Daily Mineral Water Bottles Provided',
    '🩹 First-Aid Kit & 24/7 Field Safety Assistance',
  ];

  const handleToggleQuickAmenity = (item: string) => {
    if (inclusions.includes(item)) {
      setInclusions(inclusions.filter((i) => i !== item));
    } else {
      setInclusions([...inclusions, item]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenityInput.trim()) {
      if (!inclusions.includes(customAmenityInput.trim())) {
        setInclusions([...inclusions, customAmenityInput.trim()]);
      }
      setCustomAmenityInput('');
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setInclusions(inclusions.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomExclusion = () => {
    if (customExclusionInput.trim()) {
      if (!exclusions.includes(customExclusionInput.trim())) {
        setExclusions([...exclusions, customExclusionInput.trim()]);
      }
      setCustomExclusionInput('');
    }
  };

  const handleRemoveExclusion = (indexToRemove: number) => {
    setExclusions(exclusions.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please provide a tour package title.');
      return;
    }
    if (!destination.trim()) {
      alert('Please provide destination location.');
      return;
    }
    if (pricePerPerson <= 0) {
      alert('Price must be greater than 0.');
      return;
    }
    if (inclusions.length === 0) {
      alert('Please select at least 1 included amenity.');
      return;
    }

    // Resolve Host
    let agencyObj: Agency;
    if (hostType === 'agency') {
      const found = agencies.find((a) => a.id === selectedAgencyId);
      agencyObj = found || {
        id: `ag-${Date.now()}`,
        name: 'Registered Tourism Operator',
        founder: 'Agency Owner',
        baseCity: 'Guwahati',
        state: 'Assam',
        phone: '+91 94361 00000',
        whatsapp: '+91 94361 00000',
        email: 'agency@jatingaatours.com',
        licenseNumber: 'ASM-TOUR-2026-REG',
        verifiedSince: '2026',
        rating: 4.95,
        totalToursCompleted: 24,
        bio: 'Verified tourist agency operating curated native cultural expeditions.',
      };
    } else {
      const foundGuide = guides.find((g) => g.id === selectedGuideId);
      agencyObj = {
        id: `guide-host-${foundGuide?.id || Date.now()}`,
        name: foundGuide ? `${foundGuide.name} (Native Guide Collective)` : 'Certified Native Guide',
        founder: foundGuide?.name || 'Lead Guide',
        baseCity: foundGuide?.region || 'Kaziranga / Sohra',
        state: foundGuide?.state || 'Assam',
        phone: foundGuide?.phone || '+91 94361 00000',
        whatsapp: foundGuide?.whatsapp || '+91 94361 00000',
        email: 'guide@jatingaatours.com',
        licenseNumber: foundGuide?.licenseNo || 'GOVT-VERIFIED-GUIDE-001',
        verifiedSince: foundGuide?.verifiedSince || '2022',
        rating: foundGuide?.rating || 4.98,
        totalToursCompleted: foundGuide?.totalExpeditions || 140,
        bio: `Led directly by certified native naturalist ${foundGuide?.name || 'Local Guide'} (${foundGuide?.experienceYears || 10} yrs experience in ${foundGuide?.specialty || 'Ecology'}). 100% direct local tourism earnings.`,
      };
    }

    const newPackage: TourPackage = {
      id: `pkg-${Date.now()}-${Math.floor(Math.random() * 900)}`,
      title: title.trim(),
      tagline:
        tagline.trim() ||
        `All-inclusive verified expedition at ${formatINR(pricePerPerson)}/person with ${inclusions.length} amenities`,
      region,
      regionLabel: region === 'northeast' ? 'Northeast India' : region.toUpperCase(),
      location: destination.trim(),
      duration: duration.trim(),
      daysCount: daysCount || 3,
      groupType: 'Private Guided',
      fitnessLevel: 'Easy',
      pricePerPerson: Number(pricePerPerson),
      image: selectedImage,
      gallery: [selectedImage, scenicImg, heroImg],
      agency: agencyObj,
      inclusions,
      exclusions,
      bestSeason: 'All Year Round',
      startingPoint: 'Guwahati / Local Hub',
      itinerary: [
        {
          day: 1,
          title: 'Day 1: Arrival, Warm Welcome & Eco-Cottage Check-in',
          description: `Airport / Station pickup, traditional welcome, check-in to eco-resort, and evening riverbank walk. Inclusions: ${inclusions.slice(0, 3).join(', ')}.`,
          highlights: ['Pickup & Eco-Stay', 'Local Nutritious Dinner', 'Sunset Country View'],
        },
        {
          day: 2,
          title: 'Day 2: Wilderness Safari, Living Heritage & Native Trails',
          description: `After morning tea and breakfast, guided field safari and exploration of protected forest/cultural sites. Inclusions: ${inclusions.slice(3, 7).join(', ')}.`,
          highlights: ['Guided Wilderness Safari', 'Expert Naturalist Commentary', 'Evening Campfire'],
        },
        {
          day: 3,
          title: 'Day 3: Craft Village Trails & Smooth Departure',
          description: `Morning breakfast, souvenir shopping at artisan collective, and comfortable transfer to airport/station.`,
          highlights: ['Village Craft Tour', 'Farewell Memento', 'Safe Drop-off'],
        },
      ],
      featured: true,
      moderationStatus: 'published',
      isUserGenerated: true,
      destinationDescription: `This complete tour includes all ${inclusions.length} amenities. Transparent pricing at only ${formatINR(pricePerPerson)} per person covering accommodation, meals, transport, and expert guide.`,
    };

    onAddPackage(newPackage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display">
                  Tour Package & Amenities Upload Form
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-bold">
                  Amenities Checklist
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                Agency operators and certified guides can upload verified packages with all inclusions, stays, meals, and transport at a fixed per-person rate.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* STEP 1: WHO IS UPLOADING? (Agency Owner or Guide) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0b4619]" />
                1. Operator / Host Selection
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Agency Owner or Guide</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHostType('agency')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  hostType === 'agency'
                    ? 'border-[#0b4619] bg-emerald-50/70 text-[#0b4619] ring-2 ring-[#0b4619]/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0b4619] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Tourist Agency Owner</div>
                  <div className="text-[10px] text-stone-500">DMC / Operator Profile</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setHostType('guide')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  hostType === 'guide'
                    ? 'border-[#0b4619] bg-emerald-50/70 text-[#0b4619] ring-2 ring-[#0b4619]/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Certified Local Guide</div>
                  <div className="text-[10px] text-stone-500">Field Naturalist / Guide Profile</div>
                </div>
              </button>
            </div>

            {/* Selector based on hostType */}
            {hostType === 'agency' ? (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Agency Owner:
                </label>
                <select
                  value={selectedAgencyId}
                  onChange={(e) => setSelectedAgencyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                >
                  {agencies.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} (Founder: {ag.founder} · {ag.state})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Certified Guide:
                </label>
                <select
                  value={selectedGuideId}
                  onChange={(e) => setSelectedGuideId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                >
                  {guides.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.specialty} · Lic: {g.licenseNo} · {g.state})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* STEP 2: PRICE & TOUR BASICS */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                2. Price Per Person & Tour Details
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Fixed Per-Person Rate
              </span>
            </div>

            {/* THE USER'S EXACT REQUIREMENT: 1 Pax ₹5,000 OR CUSTOM PRICE */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/90 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-900">
                    Total Price Per Person (INR): *
                  </label>
                  <p className="text-[11px] text-stone-600">
                    Enter the total cost per traveler (e.g. <strong>₹5,000</strong>)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#0b4619] font-mono">₹</span>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(Number(e.target.value))}
                    className="w-36 px-3 py-2 text-base font-bold text-stone-900 bg-white rounded-lg border-2 border-[#0b4619] font-mono focus:outline-none focus:ring-2 focus:ring-[#0b4619]/20"
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-stone-500 font-medium text-[11px]">Quick Presets:</span>
                {[3000, 5000, 8000, 12000, 18000].map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPricePerPerson(pr)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      pricePerPerson === pr
                        ? 'bg-[#0b4619] text-white'
                        : 'bg-white border border-stone-300 text-stone-700 hover:border-[#0b4619]'
                    }`}
                  >
                    ₹{pr.toLocaleString('en-IN')} {pr === 5000 && '(Recommended)'}
                  </button>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
                  <span className="text-stone-500 block font-medium">5% Platform Fee:</span>
                  <span className="text-base font-extrabold text-[#0b4619] font-mono tabular-nums">
                    {formatINR(Math.round(pricePerPerson * 0.05))}
                  </span>
                  <span className="text-[10px] text-emerald-800 block">(Paid by Traveler)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-300 shadow-2xs">
                  <span className="text-stone-600 block font-medium">Instant Host Advance:</span>
                  <span className="text-base font-extrabold text-amber-900 font-mono tabular-nums">
                    ₹1,000
                  </span>
                  <span className="text-[10px] text-amber-800 block">(Direct to Bank on Booking)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200 shadow-2xs">
                  <span className="text-stone-500 block font-medium">Balance Tour Payout:</span>
                  <span className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                    {formatINR(Math.max(0, pricePerPerson - 1000))}
                  </span>
                  <span className="text-[10px] text-stone-500 block">(Paid directly by traveler at tour start)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tour Package Name (Package Title): *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kaziranga Safari & Living Root Bridges Trail"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Destination / Location: *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kaziranga & Majuli, Assam"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Duration (Days / Nights):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3 Days / 2 Nights"
                    className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                  <select
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                    className="px-2 py-2 rounded-lg border border-stone-300 bg-white text-stone-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                      <option key={d} value={d}>
                        {d} Days
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Region:
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="northeast">Northeast (Assam, Meghalaya, Arunachal)</option>
                  <option value="himalayas">Himalayas (Ladakh, Kashmir, Sikkim)</option>
                  <option value="south">South (Kerala, Wayanad, Karnataka)</option>
                  <option value="west">West (Rajasthan, Thar Desert)</option>
                </select>
              </div>
            </div>

            {/* Photo Selection */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1 text-xs">
                Package Cover Photo:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { img: heroImg, label: 'Meghalaya / Nature' },
                  { img: scenicImg, label: 'Kaziranga / Forest' },
                  { img: keralaImg, label: 'Kerala / Backwaters' },
                  { img: ladakhImg, label: 'Ladakh / Himalayas' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(item.img)}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer aspect-video group ${
                      selectedImage === item.img ? 'border-[#0b4619] ring-2 ring-[#0b4619]/20' : 'border-stone-200'
                    }`}
                  >
                    <img src={item.img} alt="Tour thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-0.5 text-center font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: THE CORE REQUIREMENT - KHUBIDHA (Amenities Form) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0b4619]" />
                  3. Included Amenities at {formatINR(pricePerPerson)}/Pax (Amenities Checklist) *
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Select and customize all facilities included in your per-person rate below
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 tabular-nums">
                {inclusions.length} Amenities Active
              </span>
            </div>

            {/* Quick Toggle Common Categories */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-700 block">
                Quick Presets (Click to add or remove):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickAmenities.map((q) => {
                  const isChecked = inclusions.includes(q);
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleToggleQuickAmenity(q)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{q}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amenity Adder */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Add Custom Amenity or Special Facility:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                  placeholder="e.g. Complimentary binoculars & forest permits during jeep safari..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="px-4 py-2 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add</span>
                </button>
              </div>
            </div>

            {/* Active Inclusions List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-stone-600 block">
                Included in this Tour (Travelers will receive all of these):
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {inclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/90 flex items-center justify-between text-xs text-emerald-950 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0b4619] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        ✓
                      </span>
                      <span className="font-medium">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(idx)}
                      className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 4: EXCLUSIONS */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <X className="w-4 h-4 text-stone-500" />
              4. Exclusions / Not Covered
            </span>

            <div className="flex gap-2">
              <input
                type="text"
                value={customExclusionInput}
                onChange={(e) => setCustomExclusionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomExclusion();
                  }
                }}
                placeholder="e.g. Personal medical expenses & shopping..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
              />
              <button
                type="button"
                onClick={handleAddCustomExclusion}
                className="px-3.5 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {exclusions.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-stone-100 border border-stone-200 text-stone-700"
                >
                  <span className="text-stone-400 font-bold">✕</span>
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExclusion(idx)}
                    className="text-stone-400 hover:text-red-600 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* STEP 5: LIVE PREVIEW OF THE PACKAGE CARD */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              5. Live Tour Card Preview
            </span>

            <div className="max-w-md mx-auto bg-white rounded-xl border border-stone-200 shadow-md overflow-hidden">
              <div className="relative aspect-video">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {destination || 'Destination'}
                </div>
                <div className="absolute bottom-2 right-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {duration}
                </div>
              </div>
              <div className="p-3.5 space-y-2">
                <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                  {title || 'Tour Package Title'}
                </h4>
                <div className="text-[11px] text-emerald-900 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  ✓ {inclusions.length} Amenities Included (Stay, Meals, Transport, Guide)
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500">Price per person: </span>
                    <strong className="text-sm font-bold text-[#0b4619]">{formatINR(pricePerPerson)}</strong>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Lock with ₹{(1000 + Math.round(pricePerPerson * 0.05)).toLocaleString('en-IN')} Advance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 to-[#0b4619] text-white flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 shadow-lg">
            <div>
              <div className="text-xs text-emerald-200">
                Total Price: <strong className="text-amber-300 text-base">{formatINR(pricePerPerson)}</strong> / per traveler
              </div>
              <div className="text-[11px] text-stone-300">
                Will be published live with {inclusions.length} verified amenities
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span>Upload Package & Amenities Live</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
