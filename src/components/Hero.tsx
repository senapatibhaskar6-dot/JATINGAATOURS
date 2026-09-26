import React, { useState, useEffect } from 'react';
import { Search, Compass, Users, Sparkles, MapPin, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';

// Curated high-resolution imagery showcasing Assam tea gardens, Brahmaputra, Meghalaya hills & national heritage
const BACKGROUND_DESTINATIONS = [
  {
    id: 'northeast-tea-hills',
    title: 'Emerald Tea Gardens & Misty Hills',
    region: 'Assam & Meghalaya, Northeast India',
    tag: 'NORTHEAST UNTAMED',
    // High-res Unsplash scenic lush green landscape & tea gardens of Northeast India
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop',
    alt: 'Lush green tea estate and mist covered hills of Assam and Meghalaya',
  },
  {
    id: 'brahmaputra-valleys',
    title: 'Brahmaputra River Valleys & Living Bridges',
    region: 'Kaziranga & Cherrapunji',
    tag: 'SACRED WATERS & FORESTS',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
    alt: 'Scenic Brahmaputra river canyon and pristine waterfall valleys',
  },
  {
    id: 'himalayan-passes',
    title: 'High-Altitude Peaks & Monasteries',
    region: 'Arunachal, Sikkim & Ladakh',
    tag: 'HIMALAYAN FRONTIER',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
    alt: 'Majestic mountain ranges and pristine valleys',
  },
  {
    id: 'heritage-wonders',
    title: 'Living Heritage & Ancient Architecture',
    region: 'Heritage Citadels & Sacred Temples',
    tag: 'INCREDIBLE INDIA HERITAGE',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070&auto=format&fit=crop',
    alt: 'Iconic royal heritage and ancient stone craftsmanship across India',
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

  // Auto-transition background imagery every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_DESTINATIONS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(internalSearch);
    }
    onExploreClick();
  };

  const currentDestination = BACKGROUND_DESTINATIONS[activeImageIndex];

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none">
      
      {/* ========================================================================= */}
      {/* 1. VISUAL BACKGROUND LAYER (Lush Green Northeast & National Heritage)    */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_DESTINATIONS.map((dest, index) => (
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
            />
          </div>
        ))}

        {/* ========================================================================= */}
        {/* 2. READABILITY OVERLAY (Subtle Dark Gradient & Vignette Scrim)            */}
        {/* Deep Charcoal & Forest Green tint guarantees crisp white text contrast    */}
        {/* ========================================================================= */}
        {/* Central dark scrim for text clarity */}
        <div className="absolute inset-0 bg-stone-950/75 sm:bg-stone-950/70 backdrop-blur-[0.5px]" />
        
        {/* Vertical gradient: darker on top and bottom for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-transparent to-stone-950/95" />
        
        {/* Subtle radial forest green brand illumination */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,70,25,0.35)_0%,rgba(12,10,9,0.85)_100%)] pointer-events-none" />
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
          
          {/* Primary CTA: Search / Browse Tours */}
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

        {/* Trust Badges / Assurance Row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Local Hosts</span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f39c12]" />
            <span>Transparent 5% Platform Fee</span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>{currentDestination.region}</span>
          </div>
        </div>

      </div>

      {/* Slide Indicator Bar at Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
        {BACKGROUND_DESTINATIONS.map((dest, i) => (
          <button
            key={dest.id}
            onClick={() => setActiveImageIndex(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === activeImageIndex ? 'w-6 bg-[#f39c12]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            title={`Slide ${i + 1}: ${dest.title}`}
          />
        ))}
      </div>

    </section>
  );
};
