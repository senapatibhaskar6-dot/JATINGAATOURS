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

  // Pre-configured Amenities Categories (সা-সুবিধাসমূহ)
  const defaultInclusions = [
    '২ ৰাতি পৰম্পৰাগত ইক\' কটেজ / হোমষ্টে\'ত থকাৰ সু-ব্যৱস্থা (Hot Water & Clean Bath)',
    'প্ৰতিদিনে পুৱাৰ স্বাস্থ্যকৰ চাহ আৰু থলুৱা ব্ৰেকফাষ্ট',
    'দুপৰীয়াৰ খাঁটি পৰম্পৰাগত থালি আহাৰ (Traditional Lunch)',
    'ৰাতিৰ সাজ সুস্বাদু আহাৰ (Dinner Included)',
    'প্ৰতিজনৰ বাবে দৈনিক পেকড মিনাৰেল ৱাটাৰ বটল',
    'সমগ্ৰ ভ্ৰমণৰ বাবে ব্যক্তিগত এচি বাহন / ৪x৪ জীপ (ইন্ধন আৰু চালকৰ মাচুলসহ)',
    'বিমানকোঠ বা ৰেল ষ্টেচনৰ পৰা পিক-আপ আৰু ড্ৰপ সুবিধা',
    'চৰকাৰীভাৱে প্ৰমাণিত অভিজ্ঞ থলুৱা গাইডৰ সার্বক্ষণিক সহযোগিতা',
    'ৰাষ্ট্ৰীয় উদ্যানৰ ১ টা বিশেষ জীপ চাফাৰী আৰু প্ৰৱেশ অনুমতি পত্ৰ',
    'থলুৱা গাঁৱৰ মুখাশিল্প / হস্তশিল্প কাৰখানা পৰিদৰ্শন আৰু সাংস্কৃতিক কাৰ্যসূচী',
    'জৰুৰীকালীন প্ৰাথমিক চিকিৎসা কিট আৰু সুৰক্ষা সহযোগিতা',
  ];

  const [inclusions, setInclusions] = useState<string[]>(defaultInclusions);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // Exclusions (কি কি সুবিধা অন্তৰ্ভুক্ত নহয়)
  const defaultExclusions = [
    'ব্যক্তিগত কেনা-কটা আৰু টিপছ (Personal expenses & shopping)',
    'বিমান বা ৰেলৰ টিকট (Flight/train tickets to destination)',
    'কেমেৰা বা ভিডিঅ\'গ্ৰাফীৰ বিশেষ টোল মাচুল (Camera permit fees)',
  ];
  const [exclusions, setExclusions] = useState<string[]>(defaultExclusions);
  const [customExclusionInput, setCustomExclusionInput] = useState('');

  // Sample quick amenity choices
  const quickAmenities = [
    '🏨 হোমষ্টে\' / ইক\' ৰিজৰ্টত থকাৰ সু-ব্যৱস্থা',
    '☕ পুৱাৰ চাহ আৰু থলুৱা পুষ্টিকৰ জলপান',
    '🍛 দুপৰীয়াৰ খাঁটি পৰম্পৰাগত থালি আহাৰ',
    '🍲 ৰাতিৰ সুস্বাদু আহাৰ (Dinner Included)',
    '🚙 ব্যক্তিগত এচি বাহন / ৪x৪ জীপ (ইন্ধনসহ)',
    '🛬 বিমানকোঠ বা ৰেল ষ্টেচনৰ পৰা পিক-আপ আৰু ড্ৰপ',
    '🧗 চৰকাৰী প্ৰমাণিত থলুৱা গাইডৰ সার্বক্ষণিক সংগ',
    '🎟️ ৰাষ্ট্ৰীয় উদ্যানৰ ১ টা বিশেষ জীপ চাফাৰী',
    '🚣 নদীৰ নাও চলোৱাৰ সুন্দৰ অভিজ্ঞতা',
    '🔥 সন্ধিয়া কেম্পফায়াৰ আৰু থলুৱা সংগীত',
    '💧 প্ৰতিদিনে পেকড খোৱাপানীৰ বটল',
    '🩹 প্ৰাথমিক চিকিৎসা কিট আৰু সুৰক্ষা সহযোগিতা',
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
      alert('অনুগ্ৰহ কৰি ট্যুৰ পেকেজৰ এটা নাম দিয়ক (Please provide a tour package title)');
      return;
    }
    if (!destination.trim()) {
      alert('অনুগ্ৰহ কৰি ভ্ৰমণৰ স্থানৰ নাম দিয়ক (Please provide destination location)');
      return;
    }
    if (pricePerPerson <= 0) {
      alert('প্ৰতিজনৰ মূল্য সঠিকভাৱে দিয়ক (Price must be greater than 0)');
      return;
    }
    if (inclusions.length === 0) {
      alert('অনুগ্ৰহ কৰি অতি কমেও এটা সা-সুবিধা নিৰ্বাচন কৰক (Please select at least 1 included amenity)');
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
        phone: '+91 69135 14367',
        whatsapp: '+91 69135 14367',
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
        phone: foundGuide?.phone || '+91 69135 14367',
        whatsapp: foundGuide?.whatsapp || '+91 69135 14367',
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
        `১ জনৰ ${formatINR(pricePerPerson)} টকাত ${inclusions.length} টা সম্পূৰ্ণ সা-সুবিধাসহ প্ৰাকৃতিক ভ্ৰমণ`,
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
          title: 'প্ৰথম দিন: আগমন, আদৰণি আৰু স্থানীয় পৰিদৰ্শন',
          description: `স্থানীয় হোষ্ট আৰু গাইডৰ লগত চিনাকি, বাহনৰে হোটেল/হোমষ্টে'লৈ যাত্ৰা আৰু বিশ্ৰাম। অন্তৰ্ভুক্ত সুবিধা: ${inclusions.slice(0, 3).join(', ')}।`,
          highlights: ['পিক-আপ আৰু থকাৰ সুবিধা', 'থলুৱা পুষ্টিকৰ আহাৰ', 'স্থানীয় দৃশ্য উপভোগ'],
        },
        {
          day: 2,
          title: 'দ্বিতীয় দিন: মূল চাফাৰী, প্ৰকৃতি আৰু কৃষ্টি ভ্ৰমণ',
          description: `পুৱাৰ চাহ-জলপানৰ পিছত নিৰ্বাচিত পৰ্যটন ক্ষেত্ৰ আৰু ৰাষ্ট্ৰীয় উদ্যান/নৈ/পাহাৰ পৰিদৰ্শন। অন্তৰ্ভুক্ত সুবিধা: ${inclusions.slice(3, 7).join(', ')}।`,
          highlights: ['মূল ভ্ৰমণ আৰু চাফাৰী', 'থলুৱা গাইডৰ ব্যাখ্যা', 'সন্ধিয়া কেম্পফায়াৰ/আড্ডা'],
        },
        {
          day: 3,
          title: 'তৃতীয় দিন: স্মৃতি বুটলি ঘৰমুৱা যাত্ৰা',
          description: `পুৱাৰ আহাৰ গ্ৰহণ কৰি স্থানীয় হস্তশিল্প সংগ্ৰহ আৰু বিদায় সংবর্ধনাৰে পিক-আপ বাহনেৰে প্ৰস্থান।`,
          highlights: ['হস্তশিল্প পৰিদৰ্শন', 'স্মৃতিৰ আলোকচিত্ৰ', 'সুৰক্ষিত ড্ৰপ-অফ'],
        },
      ],
      featured: true,
      moderationStatus: 'published',
      isUserGenerated: true,
      destinationDescription: `এই ভ্ৰমণত আপোনাক প্ৰদান কৰা হ'ব সম্পূৰ্ণ ${inclusions.length} টা সু-ব্যৱস্থা। ১ জনৰ মাত্ৰ ${formatINR(pricePerPerson)} টকাৰ ভিতৰতে থকা, খোৱা, যাতায়াত আৰু গাইডৰ সকলো খৰচ অন্তৰ্ভুক্ত কৰা হৈছে।`,
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
                  ট্যুৰ পেকেজ আৰু সা-সুবিধা আপলোড ফৰ্ম
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-bold">
                  Khubidha Form
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                এজেন্সী মালিক আৰু গাইডসকলে প্ৰতিজনৰ নিৰ্দিষ্ট মূল্যত (যেনে: ₹৫,০০০) কি কি সুবিধা দিব তাৰ তালিকা ফিলাপ কৰি আপলোড কৰক
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
          {/* STEP 1: WHO IS UPLOADING? (এজেন্সী মালিক নে থলুৱা গাইড) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0b4619]" />
                ১. অপাৰেটৰ / আপলোডকাৰীৰ চিনাক্তকৰণ (Host Selection)
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
                  <div className="text-xs font-bold">টুৰিষ্ট এজেন্সী মালিক (Agency Owner)</div>
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
                  <div className="text-xs font-bold">প্ৰমাণিত থলুৱা গাইড (Native Guide)</div>
                  <div className="text-[10px] text-stone-500">Field Naturalist / Guide Profile</div>
                </div>
              </button>
            </div>

            {/* Selector based on hostType */}
            {hostType === 'agency' ? (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  এজেন্সী নিৰ্বাচন কৰক (Select Agency Owner):
                </label>
                <select
                  value={selectedAgencyId}
                  onChange={(e) => setSelectedAgencyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                >
                  {agencies.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} (মালিক/পৰিচালক: {ag.founder} · {ag.state})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  গাইড নিৰ্বাচন কৰক (Select Certified Guide):
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

          {/* STEP 2: PRICE & TOUR BASICS (মূল্য আৰু পেকেজৰ তথ্য) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                ২. ১ জনৰ ভ্ৰমণ মূল্য আৰু মৌলিক বিৱৰণ (Price & Details)
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                প্ৰতিজনৰ মূল্য নিৰ্ধাৰণ
              </span>
            </div>

            {/* THE USER'S EXACT REQUIREMENT: 1 Pax ₹5,000 OR CUSTOM PRICE */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/90 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-900">
                    ১ জন ভ্ৰমণকাৰীৰ মুঠ মূল্য (Price Per Person - INR): *
                  </label>
                  <p className="text-[11px] text-stone-600">
                    আপুনি বিচৰা ধৰণে ১ জনৰ বাবে মুঠ খৰচ ইয়াত দিয়ক (যেনে: <strong>₹5,000</strong>)
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
                <span className="text-stone-500 font-medium text-[11px]">প্ৰস্তুত বাছনি:</span>
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
                    ₹{pr.toLocaleString('en-IN')} {pr === 5000 && '(আপোনাৰ নিৰ্দেশিত)'}
                  </button>
                ))}
              </div>

              {/* Financial Breakdown for ₹5,000 Package */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
                  <span className="text-stone-500 block font-medium">৫% প্লেটফৰ্ম মাচুল:</span>
                  <span className="text-base font-extrabold text-[#0b4619] font-mono tabular-nums">
                    {formatINR(Math.round(pricePerPerson * 0.05))}
                  </span>
                  <span className="text-[10px] text-emerald-800 block">(গ্ৰাহকে পৰিশোধ কৰিব)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-300 shadow-2xs">
                  <span className="text-stone-600 block font-medium">হোষ্টৰ অগ্ৰিম (Cashfree):</span>
                  <span className="text-base font-extrabold text-amber-900 font-mono tabular-nums">
                    ₹১,০০০
                  </span>
                  <span className="text-[10px] text-amber-800 block">(বুকিঙৰ লগে লগে বেংকত পাব)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200 shadow-2xs">
                  <span className="text-stone-500 block font-medium">বাকী থকা পাৰিশ্ৰমিক:</span>
                  <span className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                    {formatINR(Math.max(0, pricePerPerson - 1000))}
                  </span>
                  <span className="text-[10px] text-stone-500 block">(ট্যুৰৰ সময়ত গ্ৰাহকে এজেন্সী/গাইডক দিব)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  ট্যুৰ পেকেজৰ নাম (Package Title): *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেনে: কাজিৰঙা চাফাৰী আৰু মাজুলী ঐতিহ্য ভ্ৰমণ"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  ভ্ৰমণৰ স্থান (Destination / Location): *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="যেনে: Kaziranga & Majuli, Assam"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  সময়সীমা / দিন (Duration):
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
                        {d} দিন
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  অঞ্চল (Region):
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="northeast">Northeast (অসম, মেঘালয়, অৰুণাচল)</option>
                  <option value="himalayas">Himalayas (লাডাখ, কাশ্মীৰ, ছিকিম)</option>
                  <option value="south">South (কেৰালা, ৱায়ানাড, কৰ্ণাটক)</option>
                  <option value="west">West (ৰাজস্থান, মৰুভূমি)</option>
                </select>
              </div>
            </div>

            {/* Photo Selection */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1 text-xs">
                পেকেজৰ প্ৰচ্ছদ ফটো (Cover Photo):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { img: heroImg, label: 'মেঘালয় / প্ৰকৃতি' },
                  { img: scenicImg, label: 'পাহাৰ / কাজিৰঙা' },
                  { img: keralaImg, label: 'কেৰালা / নদী' },
                  { img: ladakhImg, label: 'লাডাখ / হিমালয়' },
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

          {/* STEP 3: THE CORE REQUIREMENT - KHUBIDHA (সা-সুবিধাসমূহৰ ফৰ্ম) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0b4619]" />
                  ৩. {formatINR(pricePerPerson)} টকাত কি কি সা-সুবিধা দিব? (Included Amenities / Khubidha) *
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  প্ৰতিজনৰ ৫০০০ টকাত অন্তৰ্ভুক্ত সকলো সুবিধা তলত নিৰ্বাচন আৰু সম্পাদনা কৰক
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 tabular-nums">
                {inclusions.length} টা সুবিধা সক্ৰিয়
              </span>
            </div>

            {/* Quick Toggle Common Categories */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-700 block">
                দ্ৰুত বাছনিৰ সুবিধা (Quick Presets - ক্লিক কৰি যোগ বা বাতিল কৰক):
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
                অন্য কোনো বিশেষ সুবিধা যোগ কৰক (Add Custom Amenity / Facility):
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
                  placeholder="যেনে: জীপ চাফাৰীত বিনামূলীয়া বাইনকুলাৰ আৰু অৰণ্য অনুমতি..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="px-4 py-2 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ যোগ কৰক</span>
                </button>
              </div>
            </div>

            {/* Active Inclusions List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-stone-600 block">
                বৰ্তমান পেকেজত থকা সা-সুবিধাসমূহ (গ্ৰাহকে এই সকলোবোৰ লাভ কৰিব):
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
                      title="বাতিল কৰক"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 4: EXCLUSIONS (সুবিধা বহিৰ্ভূত) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <X className="w-4 h-4 text-stone-500" />
              ৪. কি কি সুবিধা অন্তৰ্ভুক্ত নহয় (Exclusions / Not Covered)
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
                placeholder="যেনে: ব্যক্তিগত চিকিৎসাজনিত খৰচ..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
              />
              <button
                type="button"
                onClick={handleAddCustomExclusion}
                className="px-3.5 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>যোগ কৰক</span>
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
              ৫. গ্ৰাহকে ৱেবছাইটত যেনেদৰে দেখিব (Live Tour Card Preview)
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
                  {title || 'ট্যুৰ পেকেজৰ নাম (Title)'}
                </h4>
                <div className="text-[11px] text-emerald-900 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  ✓ {inclusions.length} টা সা-সুবিধা অন্তৰ্ভুক্ত (থকা, খোৱা, বাহন, গাইড)
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500">প্ৰতিজনৰ মূল্য: </span>
                    <strong className="text-sm font-bold text-[#0b4619]">{formatINR(pricePerPerson)}</strong>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    লক কৰিবলৈ ₹{(1000 + Math.round(pricePerPerson * 0.05)).toLocaleString('en-IN')} অগ্ৰিম
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 to-[#0b4619] text-white flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 shadow-lg">
            <div>
              <div className="text-xs text-emerald-200">
                মুঠ মূল্য: <strong className="text-amber-300 text-base">{formatINR(pricePerPerson)}</strong> / প্ৰতিজন ভ্ৰমণকাৰী
              </div>
              <div className="text-[11px] text-stone-300">
                {inclusions.length} টা সু-ব্যৱস্থাসহ ৱেবছাইটত লাইভ প্ৰদৰ্শিত হ'ব
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                বাতিল (Cancel)
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span>পেকেজ আৰু সা-সুবিধাসমূহ লাইভ আপলোড কৰক</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
