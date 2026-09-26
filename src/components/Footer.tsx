import React from 'react';
import { ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';
import jatingaaLogo from '../assets/images/jatingaa_tours_logo.jpg';

interface FooterProps {
  onOpenAgencyPortal: () => void;
  onOpenRegisterAgency: () => void;
  onOpenCodeGuidance?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAgencyPortal,
  onOpenRegisterAgency,
  onOpenCodeGuidance,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-stone-200 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#0b4619] shadow-xs border border-stone-200/80 shrink-0 flex items-center justify-center">
                <img
                  src={jatingaaLogo}
                  alt="Jatingaa Tours Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-[#0b4619] font-display">
                Jatingaa Tours
              </span>
            </div>

            <p className="text-stone-500 leading-relaxed max-w-sm">
              An all-India direct local tourism aggregator connecting conscious travelers with
              certified indigenous guides, cooperatives, and homestays. Named in honor of the mystical
              cloud valleys of Jatinga, Assam.
            </p>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="font-semibold text-stone-900">Radical Pricing Integrity:</div>
              <div>• 5% Platform Fee Paid on Top by Traveler</div>
              <div>• 0% Deducted from Agency (100% Package Payout)</div>
              <div>• Fixed ₹1,000 Local Agency Upfront Advance</div>
              <div>• Instant Direct Phone & WhatsApp Unlocked</div>
            </div>
          </div>

          {/* Nav Col 1: Expeditions & UGC Stories */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Expeditions & Stories
            </div>
            <ul className="space-y-2 text-stone-600">
              <li>
                <button onClick={() => scrollTo('packages-section')} className="hover:text-[#0b4619] cursor-pointer">
                  All-India Tour Packages
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('travel-stories-section')} className="hover:text-[#0b4619] cursor-pointer font-medium text-[#0b4619]">
                  Native Field Guides & Stories (UGC)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('packages-section')} className="hover:text-[#0b4619] cursor-pointer">
                  Northeast (Meghalaya, Assam)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('packages-section')} className="hover:text-[#0b4619] cursor-pointer">
                  Himalayas (Ladakh & Spiti)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('packages-section')} className="hover:text-[#0b4619] cursor-pointer">
                  South (Kerala Backwaters)
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: For Local Agencies */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Local Agencies & Guides
            </div>
            <ul className="space-y-2 text-stone-600">
              <li>
                <button onClick={onOpenAgencyPortal} className="hover:text-[#0b4619] cursor-pointer">
                  Agency Operations Portal
                </button>
              </li>
              <li>
                <button onClick={onOpenRegisterAgency} className="hover:text-[#0b4619] cursor-pointer">
                  List Your Agency (Zero Upfront Fee)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('financial-model')} className="hover:text-[#0b4619] cursor-pointer">
                  5% Commission Calculator
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('agency-section')} className="hover:text-[#0b4619] cursor-pointer">
                  Compare vs 25% OTAs
                </button>
              </li>
              {onOpenCodeGuidance && (
                <li>
                  <button onClick={onOpenCodeGuidance} className="hover:text-[#0b4619] cursor-pointer font-mono text-[11px] text-emerald-800">
                    Dev Blueprint (Supabase / RLS)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Direct Contact
            </div>
            <div className="space-y-2 text-stone-500 text-[11px]">
              <div>Email: partners@jatingaatours.in</div>
              <div>Direct: +91 94361 88204</div>
              <div>Guwahati & Shillong, India</div>
              <div className="pt-2 text-[10px] text-stone-400">
                All listed tour agencies are verified under State Tourism Department Acts.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Jatingaa Tours Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>5% Fair Platform Model</span>
            <span aria-hidden="true">·</span>
            <span>Direct WhatsApp Unlock</span>
            <span aria-hidden="true">·</span>
            <span>Made for India&apos;s Local Guides</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
