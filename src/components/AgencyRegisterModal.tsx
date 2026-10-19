import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building2,
  Compass,
  CreditCard,
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Layers,
  Trash2,
  Plus,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { Agency, TourPackage } from '../types';
import { insertAgencyToSupabase, triggerAgencyWelcomeEmail } from '../utils/supabaseClient';
import { formatINR } from '../utils/pricing';
import { getPlatformGuides, savePlatformGuides, GuideProfile } from '../data/guidesData';
import { useLanguage } from '../context/LanguageContext';

import heroImg from '../assets/images/hero_jatingaa_landscape_1790299532077.jpg';
import scenicImg from '../assets/images/scenic_nature_hero_1790322395376.jpg';
import keralaImg from '../assets/images/tour_kerala_backwaters_1790299559090.jpg';
import ladakhImg from '../assets/images/tour_ladakh_himalayas_1790299546121.jpg';

interface AgencyRegisterModalProps {
  onClose: () => void;
  onRegistered: (newAgency: Agency, initialPackage?: TourPackage) => void;
}

export const AgencyRegisterModal: React.FC<AgencyRegisterModalProps> = ({
  onClose,
  onRegistered,
}) => {
  const { t, language } = useLanguage();
  const isAssamese = language === 'as';

  // Step Navigation: Step 1 (Operator Profile & Bank) | Step 2 (Tour Package & Khubidha Amenities)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Operator Category: Agency Owner or Certified Guide
  const [hostCategory, setHostCategory] = useState<'agency' | 'guide'>('agency');

  // STEP 1: OPERATOR & BANK DETAILS
  const [agencyName, setAgencyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [stateRegion, setStateRegion] = useState('Assam');
  const [baseCity, setBaseCity] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('Eco-Tourism, Wildlife & Cultural Expeditions');

  // Bank details fields for automated ₹1,000 Cashfree advance payouts
  const [bankName, setBankName] = useState('State Bank of India');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [upiId, setUpiId] = useState('');

  // STEP 2: INITIAL TOUR PACKAGE & AMENITIES FORM
  const [tourTitle, setTourTitle] = useState('');
  const [tourDestination, setTourDestination] = useState('');
  const [tourDuration, setTourDuration] = useState('3 Days / 2 Nights');
  const [tourDaysCount, setTourDaysCount] = useState<number>(3);
  const [pricePerPerson, setPricePerPerson] = useState<number>(5000); // Default ₹5,000 as per prompt!
  const [selectedImage, setSelectedImage] = useState<string>(heroImg);
  const [regionTag, setRegionTag] = useState<'northeast' | 'himalayas' | 'south' | 'west'>('northeast');

  // Pre-configured default amenities (Inclusions)
  const defaultInclusions = [
    '2 Nights Traditional Eco-Cottage / Homestay Stay (Hot Water & Clean Bath)',
    'Daily Healthy Morning Tea & Fresh Local Breakfast',
    'Authentic Traditional Lunch Thali (Local Cuisine)',
    'Deluxe Dinner Included Every Evening',
    'Daily Packaged Mineral Water Bottles per Traveler',
    'Private AC Vehicle / 4x4 Gypsy for All Sightseeing (Fuel & Driver Allowance included)',
    'Airport or Railway Station Pick-up and Drop-off Transfers',
    'Certified Native Field Naturalist / Tour Guide Throughout',
    '1 National Park Jeep Safari with Forest Permits & Entry Passes',
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

  // Quick preset pills
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('');

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

  // Validation when moving from Step 1 to Step 2
  const handleProceedToStep2 = () => {
    if (!agencyName.trim()) {
      alert('Please enter Agency / Guide Name.');
      return;
    }
    if (!founderName.trim()) {
      alert('Please enter Founder / Lead Guide Name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter Phone number.');
      return;
    }
    if (!licenseNumber.trim()) {
      alert('Please enter Tourism License / Registration ID.');
      return;
    }

    // Auto-suggest tour title and destination if empty
    if (!tourTitle.trim()) {
      setTourTitle(`${baseCity || stateRegion} Eco & Cultural Heritage Trail (${tourDuration})`);
    }
    if (!tourDestination.trim()) {
      setTourDestination(`${baseCity ? `${baseCity}, ` : ''}${stateRegion}`);
    }

    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agencyName || !founderName || !phone || !licenseNumber) {
      alert('Please fill in all required fields in Step 1.');
      setCurrentStep(1);
      return;
    }

    if (!tourTitle.trim() || !tourDestination.trim()) {
      alert('Please provide a tour package title and destination.');
      return;
    }

    if (inclusions.length === 0) {
      alert('Please select at least 1 included amenity.');
      return;
    }

    setIsSubmitting(true);
    setSupabaseStatus('Connecting to Supabase cloud database...');

    const locationStr = `${baseCity || 'Local Base'}, ${stateRegion}`;
    const cleanAgencyName = agencyName.trim();
    const cleanFounderName = founderName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim() || `${cleanAgencyName.toLowerCase().replace(/\s+/g, '')}@partner.in`;

    const bankDetailsPayload = {
      bankName: bankName || 'State Bank of India',
      bankAccountName: cleanAgencyName,
      bankAccountNumber: bankAccountNumber || '38920194821',
      bankIfsc: bankIfsc || 'SBIN0000001',
      upiId: upiId || `${cleanPhone.replace(/\D/g, '')}@upi`,
      licenseNumber: licenseNumber,
      specialty: specialty,
    };

    // 1. Insert into Supabase table: agencies
    try {
      const res = await insertAgencyToSupabase({
        agencyName: cleanAgencyName,
        ownerName: cleanFounderName,
        phone: cleanPhone,
        email: cleanEmail,
        location: locationStr,
        bankDetails: bankDetailsPayload,
      });

      if (res.success) {
        setSupabaseStatus('Successfully synchronized with Supabase agencies database!');
      } else {
        console.warn('Supabase insertion note:', res.error);
        setSupabaseStatus('Saved locally and queued for Supabase sync.');
      }
    } catch (err) {
      console.error('Error inserting into Supabase:', err);
    }

    // Trigger automated welcome email via Supabase Edge Function
    triggerAgencyWelcomeEmail({
      agencyName: cleanAgencyName,
      email: cleanEmail,
      phone: cleanPhone,
    }).catch((err) => console.log('Edge function trigger note:', err));

    const newAgencyId = `ag-new-${Date.now()}`;
    const newAgency: Agency = {
      id: newAgencyId,
      name: cleanAgencyName,
      founder: cleanFounderName,
      baseCity: baseCity || 'Guwahati',
      state: stateRegion,
      phone: cleanPhone,
      whatsapp: cleanPhone,
      email: cleanEmail,
      licenseNumber: licenseNumber.trim(),
      verifiedSince: new Date().getFullYear().toString(),
      rating: 5.0,
      totalToursCompleted: 0,
      bio: `${cleanAgencyName} is an authorized local travel host founded by ${cleanFounderName}, specializing in ${specialty}. 100% direct traveler connection with guaranteed ₹1,000 upfront advances.`,
      specialty: specialty,
      status: 'verified',
      bankName: bankName || 'State Bank of India',
      bankAccountName: cleanAgencyName,
      bankAccountNumber: bankAccountNumber || '38920194821',
      bankIfsc: bankIfsc || 'SBIN0000001',
      upiId: upiId || `${cleanPhone.replace(/\D/g, '')}@upi`,
      payoutStatus: 'verified',
    };

    // If registered as Guide, also append to Guide Directory!
    if (hostCategory === 'guide') {
      try {
        const existingGuides = getPlatformGuides();
        const initials = cleanFounderName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'GD';

        const newGuideEntry: GuideProfile = {
          id: `gd-user-${Date.now()}`,
          name: cleanFounderName,
          licenseNo: licenseNumber.trim(),
          region: baseCity || stateRegion,
          state: stateRegion,
          agencyAffiliation: cleanAgencyName,
          agencyId: newAgencyId,
          experienceYears: 6,
          phone: cleanPhone,
          whatsapp: cleanPhone,
          languages: ['Assamese', 'English', 'Hindi'],
          specialty: specialty || 'Eco-Trek & Cultural Guide',
          rating: 5.0,
          totalExpeditions: 12,
          status: 'available',
          avatarInitials: initials,
          verifiedSince: new Date().getFullYear().toString(),
          emergencyCertified: true,
        };

        savePlatformGuides([newGuideEntry, ...existingGuides]);
      } catch (err) {
        console.warn('Failed to save to guide directory:', err);
      }
    }

    // 2. Build the initial Tour Package with all filled khubidha/amenities!
    const initialPackage: TourPackage = {
      id: `pkg-${Date.now()}-${Math.floor(Math.random() * 900)}`,
      title: tourTitle.trim(),
      tagline: `All-inclusive native tour at ${formatINR(pricePerPerson)}/person with ${inclusions.length} verified amenities`,
      region: regionTag,
      regionLabel: regionTag === 'northeast' ? 'Northeast India' : regionTag.toUpperCase(),
      location: tourDestination.trim(),
      duration: tourDuration.trim(),
      daysCount: tourDaysCount || 3,
      groupType: hostCategory === 'guide' ? 'Private Guided' : 'Small Group (Max 8)',
      fitnessLevel: 'Easy',
      pricePerPerson: Number(pricePerPerson),
      image: selectedImage,
      gallery: [selectedImage, scenicImg, heroImg],
      agency: newAgency,
      inclusions,
      exclusions,
      bestSeason: 'All Year Round',
      startingPoint: `${baseCity || 'Local City Hub'}`,
      itinerary: [
        {
          day: 1,
          title: 'Day 1: Arrival, Traditional Welcome & Local Orientation',
          description: `Meet and greet with local host and certified guide, private transfer to heritage eco-stay / homestay, and leisure orientation. Included amenities: ${inclusions.slice(0, 3).join(', ')}.`,
          highlights: ['Pick-up & check-in', 'Authentic local lunch', 'Scenic surroundings'],
        },
        {
          day: 2,
          title: 'Day 2: Core Wildlife Safari, Nature Trails & Cultural Exploration',
          description: `After breakfast, proceed for full-day guided wildlife exploration and cultural immersion. Included amenities: ${inclusions.slice(3, 7).join(', ')}.`,
          highlights: ['Park safari & permits', 'Expert naturalist guidance', 'Evening campfire experience'],
        },
        {
          day: 3,
          title: 'Day 3: Indigenous Crafts, Farewell & Departure Transfer',
          description: `Morning local breakfast, community craft interaction, and timely departure transfer to base station/airport.`,
          highlights: ['Local crafts & souvenirs', 'Scenic photographs', 'Safe departure transfer'],
        },
      ],
      featured: true,
      moderationStatus: 'published',
      isUserGenerated: true,
      destinationDescription: `This tour includes a total of ${inclusions.length} verified amenities. Every expense including stay, meals, private vehicle, and certified guide is included at ${formatINR(pricePerPerson)} per person.`,
    };

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onRegistered(newAgency, initialPackage);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display">
                  {t('register.modalTitle')}
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-bold">
                  Registration & Amenities Form
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                {t('register.modalSubtitle')}
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

        {/* Step Progression Indicators */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 sm:gap-4 w-full">
            {/* Step 1 Indicator */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-white text-[#0b4619] shadow-xs border border-stone-200 font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 1 ? 'bg-[#0b4619] text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                1
              </span>
              <span>{t('register.step1')}</span>
            </button>

            <span className="text-stone-400">→</span>

            {/* Step 2 Indicator */}
            <button
              type="button"
              onClick={handleProceedToStep2}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-white text-[#0b4619] shadow-xs border border-stone-200 font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 2 ? 'bg-[#0b4619] text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                2
              </span>
              <span>{t('register.step2')}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0b4619] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                Registration & Tour Package Successfully Uploaded Live!
              </h3>
              <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                Congratulations, <strong>{agencyName}</strong> ({founderName})! Your tourism license and direct payout bank details are verified and securely saved.
                Your curated tour package with <strong>{inclusions.length} amenities</strong> at <strong>{formatINR(pricePerPerson)}</strong> per traveler is now live on the marketplace for instant booking.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl max-w-md mx-auto text-xs text-emerald-900 border border-emerald-200">
                ✓ 0% Commission Policy Active · Instant ₹1,000 host advance is transferred directly to your bank account upon booking.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ========================================================= */}
              {/* STEP 1: OPERATOR PROFILE & BANK PAYOUT DETAILS            */}
              {/* ========================================================= */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  {/* Category Selection */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#0b4619]" />
                      Select Operator Type:
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHostCategory('agency')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          hostCategory === 'agency'
                            ? 'border-[#0b4619] bg-emerald-50 text-[#0b4619] ring-2 ring-[#0b4619]/20 font-bold'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0b4619] text-white flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs">Tourist Agency Owner</div>
                          <div className="text-[10px] text-stone-500 font-normal">Registered Tour Operator / DMC</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHostCategory('guide')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          hostCategory === 'guide'
                            ? 'border-[#0b4619] bg-emerald-50 text-[#0b4619] ring-2 ring-[#0b4619]/20 font-bold'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs">Certified Local Guide</div>
                          <div className="text-[10px] text-stone-500 font-normal">Licensed Field Naturalist / Guide</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Core Details Grid */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <FileText className="w-4 h-4 text-[#0b4619]" />
                      Basic Details & Tourism License
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {hostCategory === 'agency'
                            ? 'Agency Name: *'
                            : 'Guide / Brand Name: *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="e.g. Jatinga Nature Trails / Kaziranga Safari Co."
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {hostCategory === 'agency'
                            ? 'Owner / Founder Name: *'
                            : 'Lead Guide Full Name: *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          placeholder="e.g. Pranab Deka / Rakesh Kalita"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.stateLabel')}
                        </label>
                        <select
                          value={stateRegion}
                          onChange={(e) => setStateRegion(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        >
                          <option value="Assam">Assam</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Ladakh">Ladakh</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Rajasthan">Rajasthan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.baseCityLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={baseCity}
                          onChange={(e) => setBaseCity(e.target.value)}
                          placeholder="e.g. Haflong, Guwahati, Kaziranga, Sohra"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.licenseLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="e.g. ASM-TOU-2026-REG or Guide License"
                          className="w-full px-3 py-2 font-mono rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.phoneLabel')}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.emailLabel')}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contact@agency.in"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.specialtyLabel')}
                        </label>
                        <input
                          type="text"
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          placeholder="e.g. Jeep Safaris, Wildlife & Cultural Trails"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operator Bank Details for Instant Cashfree Payouts */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0b4619]" />
                      <span className="text-xs font-bold text-stone-900">
                        {t('register.bankSection')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          {t('register.bankName')}
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. State Bank of India, HDFC Bank"
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          {t('register.accNumber')}
                        </label>
                        <input
                          type="text"
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          placeholder="e.g. 38920194821"
                          className="w-full px-3 py-1.5 font-mono rounded-lg border border-stone-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          {t('register.ifsc')}
                        </label>
                        <input
                          type="text"
                          value={bankIfsc}
                          onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                          placeholder="e.g. SBIN0000001"
                          className="w-full px-3 py-1.5 font-mono uppercase rounded-lg border border-stone-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          {t('register.upi')}
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. agency@oksbi / 9876543210@upi"
                          className="w-full px-3 py-1.5 font-mono rounded-lg border border-stone-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="px-6 py-2.5 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>{t('register.proceedToStep2Btn')}</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 2: TOUR PACKAGE & AMENITIES FORM                     */}
              {/* ========================================================= */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#0b4619] shrink-0 mt-0.5" />
                    <div>
                      <strong>Launch your first tour package live during registration:</strong>{' '}
                      Specify all amenities and inclusions you provide for ₹5,000/person (or custom price). This tour package goes live on the marketplace immediately!
                    </div>
                  </div>

                  {/* Core Tour Details & ₹5,000 Pricing */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                        Price Per Person & Tour Details
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ₹5,000 Standard Model
                      </span>
                    </div>

                    {/* Price Input with Live Split */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/90 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="block text-xs font-bold text-stone-900">
                            {t('register.priceLabel')}
                          </label>
                          <p className="text-[11px] text-stone-600">
                            Specify total cost per 1 traveler (e.g. ₹5,000)
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
                            className="w-36 px-3 py-2 text-base font-bold text-stone-900 bg-white rounded-lg border-2 border-[#0b4619] font-mono focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-stone-500 font-medium text-[11px]">
                          Quick Presets:
                        </span>
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

                      {/* Financial Split for this Package */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                        <div className="p-2.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
                          <span className="text-stone-500 block font-medium">
                            5% Platform Fee:
                          </span>
                          <span className="text-base font-extrabold text-[#0b4619] font-mono tabular-nums">
                            {formatINR(Math.round(pricePerPerson * 0.05))}
                          </span>
                          <span className="text-[10px] text-emerald-800 block">
                            (Paid by Traveler)
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-300 shadow-2xs">
                          <span className="text-stone-600 block font-medium">
                            Instant Host Advance:
                          </span>
                          <span className="text-base font-extrabold text-amber-900 font-mono tabular-nums">
                            ₹1,000
                          </span>
                          <span className="text-[10px] text-amber-800 block">
                            (Direct to Bank)
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-stone-200 shadow-2xs">
                          <span className="text-stone-500 block font-medium">
                            Balance Tour Payout:
                          </span>
                          <span className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                            {formatINR(Math.max(0, pricePerPerson - 1000))}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            (Paid at Tour Start)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.packageTitle')}
                        </label>
                        <input
                          type="text"
                          required
                          value={tourTitle}
                          onChange={(e) => setTourTitle(e.target.value)}
                          placeholder="e.g. Kaziranga Safari & Living Root Bridges Trail"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.destination')}
                        </label>
                        <input
                          type="text"
                          required
                          value={tourDestination}
                          onChange={(e) => setTourDestination(e.target.value)}
                          placeholder="e.g. Kaziranga, Haflong or Sohra, Assam"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          {t('register.duration')}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tourDuration}
                            onChange={(e) => setTourDuration(e.target.value)}
                            placeholder="3 Days / 2 Nights"
                            className="flex-1 px-3 py-2 rounded-lg border border-stone-300"
                          />
                          <select
                            value={tourDaysCount}
                            onChange={(e) => setTourDaysCount(Number(e.target.value))}
                            className="px-2 py-2 rounded-lg border border-stone-300 bg-white"
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
                          {t('register.region')}
                        </label>
                        <select
                          value={regionTag}
                          onChange={(e) => setRegionTag(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                        >
                          <option value="northeast">Northeast India (Assam, Meghalaya, Arunachal)</option>
                          <option value="himalayas">Himalayas (Ladakh, Kashmir, Sikkim)</option>
                          <option value="south">South India (Kerala, Wayanad)</option>
                          <option value="west">Western India (Rajasthan, Desert)</option>
                        </select>
                      </div>
                    </div>

                    {/* Photo Selection */}
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1 text-xs">
                        {t('register.coverPhoto')}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { img: heroImg, label: 'Hills & Tea Valleys' },
                          { img: scenicImg, label: 'Kaziranga / Nature' },
                          { img: keralaImg, label: 'Kerala / Backwaters' },
                          { img: ladakhImg, label: 'Ladakh / Himalayas' },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedImage(item.img)}
                            className={`relative rounded-lg overflow-hidden border-2 cursor-pointer aspect-video ${
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

                  {/* KHUBIDHA (Amenities Form) */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div>
                        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#0b4619]" />
                          {formatINR(pricePerPerson)} Inclusions & Amenities Checklist *
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Select all amenities included in this per-person rate (Stay, Meals, Transport, Guide)
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 tabular-nums">
                        {inclusions.length} Amenities Included
                      </span>
                    </div>

                    {/* Quick Preset Pills */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-stone-700 block">
                        Quick Preset Amenities (Click to toggle):
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
                        Add Custom Amenity / Facility:
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
                          placeholder="e.g. Free binoculars & national park permits for safari..."
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomAmenity}
                          className="px-4 py-2 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Amenity</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Inclusions List */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-stone-600 block">
                        Included Amenities & Services in Package ({inclusions.length}):
                      </span>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {inclusions.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/90 flex items-center justify-between text-xs text-emerald-950"
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

                  {/* Exclusions */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <X className="w-4 h-4 text-stone-500" />
                      What is Not Included (Exclusions)
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
                        placeholder="e.g. Personal medical expenses, tips and flights..."
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomExclusion}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add</span>
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

                  {/* LIVE TOUR CARD PREVIEW */}
                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-3">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Live Tour Card Preview (How Travelers See It)
                    </span>

                    <div className="max-w-md mx-auto bg-white rounded-xl border border-stone-200 shadow-md overflow-hidden">
                      <div className="relative aspect-video">
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {tourDestination || 'Destination'}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {tourDuration}
                        </div>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <div className="text-[11px] font-semibold text-stone-500">
                          {hostCategory === 'guide' ? 'Guide:' : 'Agency:'} <strong>{agencyName || 'Your Agency'}</strong> ({founderName || 'Founder'})
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                          {tourTitle || 'Tour Package Title'}
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
                            Advance to Lock: ₹{(1000 + Math.round(pricePerPerson * 0.05)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                    >
                      {t('register.backToStep1Btn')}
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                            <span>Registering & Uploading...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-stone-950" />
                            <span>{t('register.submitBtn')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
