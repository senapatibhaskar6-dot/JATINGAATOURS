import React from 'react';
import {
  Globe2,
  HeartHandshake,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Compass,
  Building2,
  Sparkles,
  MapPin
} from 'lucide-react';
import jatingaaLogo from '../assets/images/jatingaa_tours_logo.png';

interface AboutUsSectionProps {
  onOpenRegisterAgency: () => void;
  onExploreTours: () => void;
  onOpenFullAboutModal?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  onOpenRegisterAgency,
  onExploreTours,
  onOpenFullAboutModal,
}) => {
  return (
    <section id="about-us" className="py-16 sm:py-24 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#0b4619]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-amber-300 text-xs font-bold uppercase tracking-widest border border-emerald-800/80">
            <Compass className="w-3.5 h-3.5" />
            <span>About Jatingaa Tours</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
            Redefining Travel by Connecting Local Passion with Global Explorers
          </h2>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            We are India's premier ethical local tourism aggregator. We bypass corporate middlemen to
            foster direct, fair, and enriching travel partnerships between authentic regional agencies
            and travelers worldwide.
          </p>
        </div>

        {/* 2 Core Value Propositions (PROMINENTLY HIGHLIGHTED AS REQUESTED) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Proposition 1: Global Market Access for Local Agencies */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0a3314] to-[#041a0a] border border-emerald-700/60 p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/80 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe2 className="w-32 h-32 text-emerald-400" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800/70 border border-emerald-600/70 text-amber-300 shadow-md">
                <Globe2 className="w-7 h-7" />
              </div>

              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Empowering Local Agencies</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Global Market Access for Local Agencies
                </h3>
              </div>

              {/* Exact core proposition statement */}
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-medium">
                We actively promote our platform beyond India's borders, providing local tourism agencies
                with direct access to an international market. This empowers local agencies to expand their
                reach, grow their client base, and scale their businesses globally.
              </p>

              <div className="space-y-3 pt-3 border-t border-emerald-800/60 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Commission Deducted from Agency:</strong> You retain 100% of your listed tour price.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Guaranteed ₹1,000 Upfront Advance:</strong> Transferred immediately upon booking to secure slots without cash crunch.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Direct International Communication:</strong> Unlocked WhatsApp and phone access to speak directly with overseas guests.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800/60 relative z-10">
              <button
                onClick={onOpenRegisterAgency}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                <Building2 className="w-4 h-4 text-stone-950" />
                <span>Register Your Agency (0% Commission)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Proposition 2: Direct Connection & Cost-Effective Travel for Travelers */}
          <div className="rounded-3xl bg-gradient-to-b from-stone-800/90 to-stone-900 border border-stone-700/80 p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-amber-400/60 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <HeartHandshake className="w-32 h-32 text-amber-400" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-md">
                <HeartHandshake className="w-7 h-7" />
              </div>

              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Safe, Transparent & Authentic</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Direct Connection & Cost-Effective Travel for Travelers
                </h3>
              </div>

              {/* Exact core proposition statement */}
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-medium">
                Travelers using our platform book their trips by connecting directly with local agencies,
                cutting out all middlemen. This ensures transparent communication, significantly lower
                costs, and a safe, budget-friendly, and memorable journey.
              </p>

              <div className="space-y-3 pt-3 border-t border-stone-700/60 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Fair 5% Platform Fee:</strong> Transparent pricing without the 20-30% markups charged by big corporate OTAs.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Native Expertise & Custom Care:</strong> Work directly with local guides who craft authentic itineraries tailored to you.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Safe On-Arrival Balance:</strong> Rest easy by paying the major portion of your trip directly when you meet your guide.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-700/60 relative z-10">
              <button
                onClick={onExploreTours}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Explore Curated All-India Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Narrative & Origin Box */}
        <div className="rounded-2xl bg-stone-800/60 border border-stone-700/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#0b4619] border border-emerald-500/40 shrink-0 flex items-center justify-center p-2 shadow-inner">
              <img src={jatingaaLogo} alt="Jatingaa" className="h-full w-full object-contain" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>Inspired by the Mist-Shrouded Ridges of Assam</span>
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                The Heritage of Jatingaa Tours
              </h4>
              <p className="text-xs text-stone-400 max-w-2xl">
                Jatinga, Assam is world-renowned for its mysterious cloud formations and pristine mountain corridors.
                We bring that spirit of authentic navigation, community stewardship, and deep nature respect to
                travelers everywhere.
              </p>
            </div>
          </div>

          {onOpenFullAboutModal && (
            <button
              onClick={onOpenFullAboutModal}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Read Full Story</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
