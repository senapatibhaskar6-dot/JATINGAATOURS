import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Users, Sparkles, MapPin, ShieldCheck, ChevronRight, ArrowRight, Camera, Upload, Sun, RotateCcw, X, ChevronLeft } from 'lucide-react';

// Local high-fidelity photography assets
import northeastTeaImg from '../assets/images/hero_jatingaa_landscape_1790299532077.jpg';
import kazirangaImg from '../assets/images/scenic_nature_hero_1790322395376.jpg';
import vibrantHillsImg from '../assets/images/hero_vibrant_landscape_1790322285172.jpg';
import ladakhImg from '../assets/images/tour_ladakh_himalayas_1790299546121.jpg';
import keralaImg from '../assets/images/tour_kerala_backwaters_1790299559090.jpg';
import rajasthanImg from '../assets/images/tour_rajasthan_heritage_1790299571893.jpg';

// Exactly 8 curated high-resolution destinations representing the diverse beauty of India
export const BACKGROUND_DESTINATIONS = [
  {
    id: 'assam-tea-gardens',
    title: 'Emerald Tea Estates of Assam',
    region: 'Jorhat & Upper Assam',
    tag: 'NORTHEAST TEA HERITAGE',
    imageUrl: northeastTeaImg,
    alt: 'Lush green tea gardens and rolling hills of Assam',
  },
  {
    id: 'brahmaputra-kaziranga',
    title: 'Brahmaputra Basin & Kaziranga Sanctuary',
    region: 'Kaziranga & Brahmaputra River',
    tag: 'UNESCO WILDLIFE & RIVERS',
    imageUrl: kazirangaImg,
    alt: 'Scenic Brahmaputra river valley, lush greenery and wildlife reserve',
  },
  {
    id: 'meghalaya-living-root',
    title: 'Living Root Bridges & Nohkalikai Waterfalls',
    region: 'Cherrapunji & Mawlynnong, Meghalaya',
    tag: 'RAINFOREST WONDERS',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
    alt: 'Sacred waterfalls and living root bridges in Meghalaya mist valleys',
  },
  {
    id: 'majuli-river-island',
    title: 'Majuli River Island & Vaishnavite Satras',
    region: 'Majuli, Brahmaputra Island',
    tag: 'CULTURAL RIVER ISLAND',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop',
    alt: 'World largest inhabited river island on the Brahmaputra at sunset',
  },
  {
    id: 'arunachal-tawang',
    title: 'Tawang Monasteries & Sela Pass',
    region: 'Arunachal Pradesh, Eastern Himalayas',
    tag: 'HIMALAYAN FRONTIER',
    imageUrl: vibrantHillsImg,
    alt: 'Mighty snow-capped mountain passes and mountain streams of Arunachal',
  },
  {
    id: 'ladakh-pangong',
    title: 'Ladakh High-Altitude Passes & Pangong Lake',
    region: 'Ladakh, Zanskar & Spiti',
    tag: 'ROOF OF THE WORLD',
    imageUrl: ladakhImg,
    alt: 'Deep blue alpine waters of Pangong Tso surrounded by rugged peaks',
  },
  {
    id: 'kerala-backwaters',
    title: 'Alleppey Palm Backwaters & Munnar Hills',
    region: 'Alleppey & Munnar, Kerala',
    tag: 'SOUTH INDIA WATERWAYS',
    imageUrl: keralaImg,
    alt: 'Traditional wooden houseboat gliding through palm fringed canals',
  },
  {
    id: 'rajasthan-heritage',
    title: 'Golden Sandstone Citadels & Thar Desert',
    region: 'Jaisalmer & Jodhpur, Rajasthan',
    tag: 'ROYAL HERITAGE & DESERT',
    imageUrl: rajasthanImg,
    alt: 'Majestic golden sandstone fort rising over royal desert landscape',
  },
];

export interface HeroProps {
  onExploreClick?: () => void;
  onPartnerClick?: () => void;
  onOpenCalculator?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick = () => {
    const el = document.getElementById('packages-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
  onPartnerClick = () => {
    const el = document.getElementById('vendor-partner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
  searchQuery = '',
  onSearchChange,
  selectedRegion = 'all',
  onSelectRegion,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // 'bright' = open & very clear image (low dark overlay)
  // 'balanced' = moderate overlay
  // 'high-contrast' = dark overlay for maximum reading comfort
  const [overlayIntensity, setOverlayIntensity] = useState<'bright' | 'balanced' | 'high-contrast'>('balanced');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-transition background imagery every 6.5 seconds through all 8 destinations
  useEffect(() => {
    if (customImage || isPaused) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_DESTINATIONS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [customImage, isPaused]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(internalSearch);
    }
    onExploreClick();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrevImage = () => {
    setCustomImage(null);
    setActiveImageIndex((prev) => (prev - 1 + BACKGROUND_DESTINATIONS.length) % BACKGROUND_DESTINATIONS.length);
  };

  const handleNextImage = () => {
    setCustomImage(null);
    setActiveImageIndex((prev) => (prev + 1) % BACKGROUND_DESTINATIONS.length);
  };

  const safeIndex =
    typeof activeImageIndex === 'number' &&
    activeImageIndex >= 0 &&
    activeImageIndex < BACKGROUND_DESTINATIONS.length
      ? activeImageIndex
      : 0;

  const currentDestination = BACKGROUND_DESTINATIONS[safeIndex] || BACKGROUND_DESTINATIONS[0];

  return (
    <section
      className="relative w-full min-h-[90vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* ========================================================================= */}
      {/* 1. VISUAL BACKGROUND LAYER (8 DIVERSE HIGHLIGHTS ACROSS INDIA)             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        {customImage ? (
          <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100 scale-100">
            <img
              src={customImage}
              alt="Custom uploaded background"
              className="w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out scale-105"
            />
          </div>
        ) : (
          BACKGROUND_DESTINATIONS.map((dest, index) => (
            <div
              key={dest.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={dest.imageUrl}
                alt={dest.alt}
                className="w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out scale-105"
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = northeastTeaImg;
                }}
              />
            </div>
          ))
        )}

        {/* ========================================================================= */}
        {/* 2. READABILITY OVERLAY (Adjustable brightness & openness)                 */}
        {/* ========================================================================= */}
        {overlayIntensity === 'bright' && (
          // Bright / Open mode: Image is vivid and very open
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[0px] transition-all duration-500" />
        )}

        {overlayIntensity === 'balanced' && (
          // Balanced mode: Clear image + crisp text readability
          <>
            <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[0.5px] transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,70,25,0.25)_0%,rgba(12,10,9,0.75)_100%)] pointer-events-none" />
          </>
        )}

        {overlayIntensity === 'high-contrast' && (
          // High Contrast mode: Deep scrim for maximal focus
          <>
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[0.5px] transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/95 via-stone-950/60 to-stone-950/95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,70,25,0.35)_0%,rgba(12,10,9,0.85)_100%)] pointer-events-none" />
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. CENTERED HERO CONTENT LAYOUT                                           */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#f39c12] animate-ping" />
          <span className="tracking-widest uppercase font-mono text-[11px]">Direct Native Tourism</span>
          <span className="text-white/40">·</span>
          <span className="text-white font-medium">0% Commission Deducted from Guides</span>
        </div>

        {/* Main Headline (Centered) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-display max-w-4xl drop-shadow-md">
          Explore the Untamed Beauty of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#f39c12] to-emerald-300">
            India.
          </span>
        </h1>

        {/* Sub-headline (Centered) */}
        <p className="mt-6 text-base sm:text-xl text-stone-200 leading-relaxed max-w-2xl font-normal drop-shadow">
          Discover curated eco-tours, ancient living root bridges, and tea valley sanctuaries directly from verified native guides in Northeast India.
        </p>

        {/* Prominent Search Bar (Interactive) */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 w-full max-w-2xl p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={onSearchChange ? searchQuery : internalSearch}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Search destinations, waterfalls, homestays, or trekking trails..."
              className="w-full pl-10 pr-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-[#0b4619] hover:bg-[#073011] active:bg-[#041c09] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
          >
            <Compass className="w-4 h-4 text-[#f39c12]" />
            <span>Search Tours</span>
          </button>
        </form>

        {/* ========================================================================= */}
        {/* TWO PROMINENT CALL-TO-ACTION (CTA) BUTTONS                                */}
        {/* ========================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          
          {/* Primary CTA: Search Tours */}
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-stone-950 bg-[#f39c12] hover:bg-amber-400 active:bg-amber-500 shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
          >
            <Compass className="w-5 h-5 text-stone-950" />
            <span>Search Tours</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary CTA: Become a Partner */}
          <button
            type="button"
            onClick={onPartnerClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/30 backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Become a Partner</span>
            <ChevronRight className="w-4 h-4 text-stone-300 transform group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

        {/* Current Active Destination Banner (Highlights the 8 destinations with count) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-stone-200">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-[#f39c12]" />
            <span className="font-semibold text-white">
              {customImage ? 'Custom Photo' : `${currentDestination?.title || 'Incredible India'}`}
            </span>
            <span className="text-[10px] text-amber-300 bg-white/10 px-1.5 py-0.5 rounded font-mono">
              {activeImageIndex + 1}/8
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Local Hosts</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>0% Commission Deducted</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDE CONTROLS: 8 INDICATOR DOTS & PREV/NEXT ARROWS                    */}
      {/* ========================================================================= */}
      {!customImage && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-xl">
          <button
            type="button"
            onClick={handlePrevImage}
            className="text-stone-300 hover:text-white p-0.5 cursor-pointer"
            title="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 8 Destination Indicator Dots */}
          <div className="flex items-center gap-1.5 px-1">
            {BACKGROUND_DESTINATIONS.map((dest, i) => (
              <button
                key={dest.id}
                onClick={() => setActiveImageIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === activeImageIndex
                    ? 'w-7 bg-[#f39c12] shadow-sm'
                    : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
                title={`Image ${i + 1} of 8: ${dest.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextImage}
            className="text-stone-300 hover:text-white p-0.5 cursor-pointer"
            title="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BACKGROUND CONTROLS BUTTON & 8-IMAGE GALLERY POPUP                      */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/85 hover:bg-stone-900 active:scale-95 text-stone-200 border border-white/20 backdrop-blur-md text-xs font-medium shadow-xl transition-all cursor-pointer"
          title="Customize background image & brightness"
        >
          <Camera className="w-3.5 h-3.5 text-[#f39c12]" />
          <span>ফটো গেলৰী (৮ খন ছবি)</span>
        </button>

        {/* Customization Popup Menu displaying all 8 destinations */}
        {isCustomizing && (
          <div className="absolute bottom-11 right-0 w-80 sm:w-96 p-4 rounded-2xl bg-stone-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white text-xs z-40 animate-fade-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 shrink-0">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Sun className="w-4 h-4 text-[#f39c12]" />
                <span>ভাৰতৰ ৮ খন আকৰ্ষণীয় ফটো (Gallery)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="text-stone-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-3 mt-3 scrollbar-thin">
              {/* 1. All 8 Curated Indian Visuals */}
              <div>
                <div className="text-[11px] font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>১. যিকোনো এখন ফটো বাছক (৮ খন):</span>
                  <span className="text-[10px] text-amber-400 font-mono">৮ টা অঞ্চল</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5">
                  {BACKGROUND_DESTINATIONS.map((dest, i) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        setCustomImage(null);
                        setActiveImageIndex(i);
                      }}
                      className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer group ${
                        !customImage && activeImageIndex === i
                          ? 'border-[#f39c12] bg-[#f39c12]/20 text-amber-200 ring-1 ring-[#f39c12]/50'
                          : 'border-stone-800 bg-stone-950/50 text-stone-300 hover:bg-stone-800/80 hover:text-white'
                      }`}
                    >
                      <img
                        src={dest.imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-xs"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = northeastTeaImg;
                        }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[10px] font-semibold leading-tight">
                          {i + 1}. {dest?.title ? dest.title.split('&')[0] : 'Tour'}
                        </div>
                        <div className="truncate text-[9px] text-stone-400">
                          {dest?.region ? dest.region.split(',')[0] : 'India'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Brightness / Openness Toggle */}
              <div className="pt-2 border-t border-stone-800">
                <div className="text-[11px] font-semibold text-stone-300 mb-1.5">
                  ২. ফটোৰ পোহৰ আৰু স্বচ্ছতা (Light Intensity):
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950/80 rounded-xl border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setOverlayIntensity('bright')}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      overlayIntensity === 'bright'
                        ? 'bg-[#f39c12] text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    উজ্জ্বল (Bright)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverlayIntensity('balanced')}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      overlayIntensity === 'balanced'
                        ? 'bg-[#f39c12] text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    মধ্যম (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverlayIntensity('high-contrast')}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      overlayIntensity === 'high-contrast'
                        ? 'bg-[#f39c12] text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    ডাৰ্ক (Dark)
                  </button>
                </div>
              </div>

              {/* 3. Upload Own Image */}
              <div className="pt-2 border-t border-stone-800">
                <div className="text-[11px] font-semibold text-stone-300 mb-1.5">
                  ৩. নিজৰ ডিভাইচৰ পৰা ফটো আপলোড:
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>মোবাইল/PC ৰ পৰা ফটো দিয়ক</span>
                </button>
              </div>

              {/* Reset option */}
              {customImage && (
                <button
                  type="button"
                  onClick={() => setCustomImage(null)}
                  className="w-full py-1.5 text-[11px] text-stone-400 hover:text-white flex items-center justify-center gap-1 border-t border-stone-800 pt-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>মূল ৮ খন ফটোৰ গেলৰীলৈ উভতি যাওক (Reset)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </section>
  );
};
