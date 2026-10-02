import React from 'react';
import {
  X,
  Globe2,
  Users2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  TrendingUp,
  HeartHandshake,
  MapPin,
  Building2,
  DollarSign
} from 'lucide-react';
import jatingaaLogo from '../assets/images/jatingaa_tours_logo.png';

interface AboutUsModalProps {
  onClose: () => void;
  onOpenRegisterAgency: () => void;
  onExploreTours: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({
  onClose,
  onOpenRegisterAgency,
  onExploreTours,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-[#0b4619] border border-emerald-600/40 shrink-0 flex items-center justify-center p-1">
              <img
                src={jatingaaLogo}
                alt="Jatingaa Tours"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Our Mission & Vision
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-800">
                  Global Tourism Network
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                About Jatingaa Tours
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-10 text-stone-800">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#072d10] via-[#0b4619] to-[#041a0a] text-white p-6 sm:p-8 shadow-md">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/15">
                <Compass className="w-3.5 h-3.5" />
                <span>Ethical Travel Aggregator for India & the World</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                Bridging Local Heritage with the Global World
              </h1>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
                Jatingaa Tours is a modern, transparent travel aggregator born to empower grassroots
                tour operators, homestay owners, and cultural custodians across India by connecting them
                directly with travelers from across the globe.
              </p>
            </div>
          </div>

          {/* Core Values Section (TWO MAIN PROPOSITIONS PROMINENTLY HIGHLIGHTED) */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0b4619]">
                Our Twin Pillars
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                Transforming Tourism for Both Sides of the Journey
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                We eliminate exploitative broker layers to deliver true value to local communities and worldly adventurers alike.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Proposition 1: Global Market Access for Local Agencies */}
              <div className="rounded-2xl bg-gradient-to-b from-emerald-50/70 to-emerald-100/40 border-2 border-emerald-300/80 p-6 sm:p-7 relative flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0b4619] text-white flex items-center justify-center shadow-sm">
                    <Globe2 className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Empowering Local Enterprises</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                      Global Market Access for Local Agencies
                    </h4>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed font-medium">
                    We actively promote our platform beyond India's borders, providing local tourism
                    agencies with direct access to an international market. This empowers local
                    agencies to expand their reach, grow their client base, and scale their businesses
                    globally.
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-emerald-200/60">
                    <div className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>0% Commission Deducted from Agency:</strong> You keep 100% of your listed package earnings.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Instant ₹1,000 Upfront Advance:</strong> Transferred directly to lock in slots without financial strain.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Unrestricted Client Contact:</strong> Direct WhatsApp and phone communication with prospective travelers worldwide.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-200">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRegisterAgency();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0b4619] hover:bg-[#072d10] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Building2 className="w-4 h-4 text-amber-300" />
                    <span>Register Your Agency with Jatingaa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Core Proposition 2: Direct Connection & Cost-Effective Travel for Travelers */}
              <div className="rounded-2xl bg-gradient-to-b from-amber-50/70 to-amber-100/40 border-2 border-amber-300/80 p-6 sm:p-7 relative flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-sm">
                    <HeartHandshake className="w-6 h-6 text-stone-950" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Authentic & Transparent Travel</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                      Direct Connection & Cost-Effective Travel for Travelers
                    </h4>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed font-medium">
                    Travelers using our platform book their trips by connecting directly with local
                    agencies, cutting out all middlemen. This ensures transparent communication,
                    significantly lower costs, and a safe, budget-friendly, and memorable journey.
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-amber-200/60">
                    <div className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span><strong>No Hidden 20-30% Markups:</strong> We charge a nominal, fully transparent 5% platform service fee.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span><strong>Tailored & Native Itineraries:</strong> Speak directly with native hosts who know every hidden valley and trail.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span><strong>Safe Arrival Balance:</strong> Pay the remaining package cost only when you arrive and meet your operator.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200">
                  <button
                    onClick={() => {
                      onClose();
                      onExploreTours();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Verified Local Packages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* The Story & Inspiration Behind "Jatingaa" */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0b4619] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>The Legend of Jatingaa</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
              Rooted in the Mystical Valleys of Assam
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Jatingaa Tours draws its name and spirit from the enchanting valley of <strong>Jatinga</strong>, nestled
              among the misty folds of the Dima Hasao mountains in Assam. Famous for its seasonal cloud inversions,
              untamed beauty, and vibrant indigenous traditions, Jatinga serves as our metaphor for guided navigation
              through mysterious, pristine landscapes.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              In a digital era dominated by faceless aggregators and inflated markups, Jatingaa Tours brings back the
              warmth of human connection. We believe the best travel experiences happen when guests can look their local
              host in the eye, know their story, and support the families that protect India’s biodiversity and heritage.
            </p>
          </div>

          {/* Key Facts / Trust Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#0b4619] font-display">100%</div>
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Direct Operator Payout
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#0b4619] font-display">5%</div>
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Transparent Platform Fee
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#0b4619] font-display">Global</div>
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Traveler Audience
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#0b4619] font-display">Instant</div>
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                WhatsApp Unlocked
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-500 font-medium">
            Jatingaa Tours — Empowering Local Tour Operators & Authentic Travel Experiences Across India & Beyond.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
