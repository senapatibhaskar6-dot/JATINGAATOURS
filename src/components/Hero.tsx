import React from 'react';
import { HERO_IMAGE } from '../data/packages';
import heroBg from '../assets/images/scenic_nature_hero_1790322395376.jpg';
import { Search, MapPin, ShieldCheck, PhoneCall, Sparkles, Compass } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenCalculator: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenCalculator,
  searchQuery,
  onSearchChange,
  selectedRegion,
  onSelectRegion,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-stone-950 text-white border-b border-stone-800">
      {/* High-Resolution Scenic Nature Background with High Contrast Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Majestic scenic Indian hills, emerald river, and mist-covered forest canopy at sunrise"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-subtle-zoom"
          loading="eager"
        />
        {/* Multi-Stop Gradient Scrim (Deep Forest Green #0b4619 to Dark Charcoal Stone-950) */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-[#062b0f]/90 to-stone-950/75 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-radial-at-t from-transparent via-stone-950/40 to-stone-950/90" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left Column: Proposition & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Glowing Brand Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 w-fit mb-5 shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f39c12] animate-pulse" />
              <span className="tracking-wide">ALL-INDIA LOCAL TOURISM AGGREGATOR</span>
              <span className="text-white/40" aria-hidden="true">·</span>
              <span className="text-white font-medium">VERIFIED NATIVE GUIDES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-display [text-wrap:balance] drop-shadow-md">
              Direct Travel With India’s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#f39c12] to-amber-200">
                Native Masters.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl drop-shadow">
              Skip predatory 30% online travel agent markups. Jatingaa Tours connects you directly
              with state-registered local guides, homestays, and expedition collectives across India with an honest{' '}
              <strong className="text-white font-semibold underline decoration-amber-400 decoration-2 underline-offset-2">
                5% platform fee paid on top
              </strong>,{' '}
              <strong className="text-white font-semibold">0% agency deductions</strong>, and a{' '}
              <strong className="text-white font-semibold">guaranteed ₹1,000 upfront advance</strong> directly for the local host.
            </p>

            {/* Quick Feature Highlights (Vibrant Glassmorphic Cards) */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/15 transition-all">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">0% Agency Deduction</div>
                  <div className="text-stone-300 text-[11px] mt-0.5">100% of package price to host</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/15 transition-all">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Sparkles className="w-4 h-4 text-[#f39c12]" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">₹1,000 Agency Lock-in</div>
                  <div className="text-stone-300 text-[11px] mt-0.5">Guaranteed upfront advance</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/15 transition-all">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Direct Contact Unlock</div>
                  <div className="text-stone-300 text-[11px] mt-0.5">Instant phone & WhatsApp access</div>
                </div>
              </div>
            </div>

            {/* Interactive Search Bar (Crisp Elevated Light Card on Dark) */}
            <div className="mt-8 p-2 bg-white rounded-2xl border border-white/40 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by state, trek, monastery, backwaters (e.g. Meghalaya, Ladakh, Kerala)..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
                />
              </div>

              <button
                onClick={onExploreClick}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#0b4619] hover:bg-[#062b0f] active:bg-[#041c09] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap hover:shadow-lg"
              >
                <Compass className="w-4 h-4 text-[#f39c12]" />
                <span>Browse Packages</span>
              </button>
            </div>

            {/* Popular Region Quick Filters (Subtle Frosted Glass Pills) */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-stone-300">Popular:</span>
              {[
                { id: 'all', label: 'All Regions' },
                { id: 'northeast', label: 'Northeast & Assam' },
                { id: 'himalayas', label: 'Ladakh & Spiti' },
                { id: 'south', label: 'Kerala Backwaters' },
                { id: 'west', label: 'Rajasthan Deserts' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRegion(r.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer ${
                    selectedRegion === r.id
                      ? 'bg-[#f39c12] text-stone-950 font-bold shadow-md'
                      : 'bg-white/15 hover:bg-white/25 text-stone-100 border border-white/20 backdrop-blur-sm'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Tour Glass Card */}
          <div className="lg:col-span-5 relative">
            <div className="p-2.5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/25 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-stone-900">
                <img
                  src={HERO_IMAGE}
                  alt="Living root bridges and rolling mist-clad valleys of Meghalaya and Northeast India"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* High Legibility Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#f39c12]" />
                    <span>Jatinga Ridge & Sohra, Northeast India</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">
                    Living Root Bridges & Mist Canopies
                  </h3>
                  <p className="text-xs text-stone-200 mt-1 line-clamp-2">
                    Handled directly by indigenous Khasi mountain guides with zero corporate agency markup.
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-300">Package Base: </span>
                      <span className="font-bold text-white tabular-nums">₹18,500</span>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-300 font-medium">Advance to Lock: </span>
                      <span className="font-bold text-white tabular-nums">₹1,925</span>
                      <span className="text-[10px] text-stone-300 ml-1">(5% fee on top + ₹1k)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 bg-stone-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-white/20 flex items-center gap-3 max-w-xs text-white">
              <div className="w-10 h-10 rounded-xl bg-[#0b4619] flex items-center justify-center text-[#f39c12] shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">100% Verified Govt Licenses</div>
                <div className="text-stone-300 text-[11px] mt-0.5">Instant WhatsApp & Phone unlock upon booking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
