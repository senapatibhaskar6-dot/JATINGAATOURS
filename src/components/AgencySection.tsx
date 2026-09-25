import React, { useState } from 'react';
import { formatINR } from '../utils/pricing';
import { ShieldCheck, TrendingUp, Users, Clock, CheckCircle2, ArrowRight, Zap, Banknote } from 'lucide-react';

interface AgencySectionProps {
  onOpenAgencyPortal: () => void;
  onOpenRegisterAgency: () => void;
}

export const AgencySection: React.FC<AgencySectionProps> = ({
  onOpenAgencyPortal,
  onOpenRegisterAgency,
}) => {
  const [monthlyBookings, setMonthlyBookings] = useState<number>(10);
  const [avgPackagePrice, setAvgPackagePrice] = useState<number>(20000);

  // Calculations
  const grossMonthlyVolume = monthlyBookings * avgPackagePrice;
  // Traditional OTA 25% commission deducted from agency
  const traditionalOtaCut = Math.round(grossMonthlyVolume * 0.25);
  const traditionalNetToAgency = grossMonthlyVolume - traditionalOtaCut;

  // Jatingaa Tours: 0% deducted from agency. The 5% fee is paid by the traveler on top!
  const jatingaaAgencyDeduction = 0;
  const jatingaaNetToAgency = grossMonthlyVolume; // 100% of package value!
  const upfrontAdvanceCollected = monthlyBookings * 1000;
  const arrivalBalanceCollected = grossMonthlyVolume - upfrontAdvanceCollected;
  const travelerPlatformFeeOnTop = Math.round(grossMonthlyVolume * 0.05);
  const extraEarningsRetained = grossMonthlyVolume - traditionalNetToAgency;

  return (
    <section id="agency-section" className="w-full py-20 bg-stone-900 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#f39c12] tracking-wider uppercase mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Dedicated For Local Tour Operators & Guides</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
            Stop Losing 25% to 30% to Giant OTAs.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-300 leading-relaxed">
            Local agencies do the heavy lifting—navigating high mountain passes, maintaining safe vehicles,
            and preserving indigenous culture. On Jatingaa, your earnings are <strong className="text-white">never deducted</strong> by the 5% platform fee.
            The 5% fee is paid by the traveler on top, and you receive <strong className="text-emerald-400">100% of your package price</strong> plus guaranteed ₹1,000 upfront advances.
          </p>
        </div>

        {/* 4 Core Agency Benefits Grid with Subtle Shadows & Clean Card Styling */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-stone-850/90 border border-stone-700/80 shadow-lg hover:shadow-2xl hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#f39c12]/20 flex items-center justify-center text-[#f39c12] mb-5 group-hover:scale-110 group-hover:bg-[#f39c12] group-hover:text-stone-950 transition-all duration-300 shadow-sm">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-[#f39c12] mb-1">01. Upfront Lock-in</div>
              <h3 className="text-base font-bold text-white font-display">
                Guaranteed ₹1,000 Advance
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                For every confirmed booking, ₹1,000 is credited instantly to you to lock in drivers,
                permits, or homestay rooms. Zero risk of phantom no-shows.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-700/80 text-xs text-stone-400 font-medium">
              Instant bank settlement
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-stone-850/90 border border-stone-700/80 shadow-lg hover:shadow-2xl hover:border-emerald-400/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-stone-950 transition-all duration-300 shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400 mb-1">02. 0% Agency Deduction</div>
              <h3 className="text-base font-bold text-white font-display">
                100% Package Value to You
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                The 5% platform fee is paid by the traveler on top. We <strong className="text-white font-semibold">never deduct 5% from your payout</strong>.
                You receive 100% of your listed asking price.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-700/80 text-xs text-emerald-400 font-medium">
              Zero commission taken from host
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-stone-850/90 border border-stone-700/80 shadow-lg hover:shadow-2xl hover:border-blue-400/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-stone-950 transition-all duration-300 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-blue-400 mb-1">03. Unmasked Communication</div>
              <h3 className="text-base font-bold text-white font-display">
                Direct Traveler Contacts
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                The moment a booking is made, you receive the traveler’s phone, email, and WhatsApp.
                Speak directly, clarify acclimatization tips, and personalize their experience.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-700/80 text-xs text-stone-400 font-medium">
              Build your own loyal client base
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-stone-850/90 border border-stone-700/80 shadow-lg hover:shadow-2xl hover:border-purple-400/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-purple-400 mb-1">04. Zero Cash Flow Delays</div>
              <h3 className="text-base font-bold text-white font-display">
                Collect Directly On Arrival
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                No waiting 45 to 60 days after the tour ends for corporate finance approvals.
                The traveler hands you the remaining balance directly on day one of the trip.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-700/80 text-xs text-stone-400 font-medium">
              Immediate cash in hand
            </div>
          </div>
        </div>

        {/* Interactive Comparative Earnings Calculator with Crisp Card Styling */}
        <div className="mt-16 p-7 sm:p-10 rounded-3xl bg-stone-800/90 border border-stone-700/90 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-stone-700">
            <div>
              <div className="text-xs font-mono text-[#f39c12] uppercase tracking-wider">
                Financial Impact Modeling
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                Calculate How Much More Your Agency Retains With Jatingaa
              </h3>
            </div>
            <div className="text-xs text-stone-400">
              Based on monthly package volume & average price
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span>Monthly Completed Bookings:</span>
                  <span className="text-[#f39c12] font-bold tabular-nums text-base">
                    {monthlyBookings} Bookings / month
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={monthlyBookings}
                  onChange={(e) => setMonthlyBookings(Number(e.target.value))}
                  className="w-full accent-[#f39c12] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-mono mt-1">
                  <span>2 bookings</span>
                  <span>20 bookings</span>
                  <span>40 bookings</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span>Average Package Value:</span>
                  <span className="text-[#f39c12] font-bold tabular-nums text-base">
                    {formatINR(avgPackagePrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="50000"
                  step="1000"
                  value={avgPackagePrice}
                  onChange={(e) => setAvgPackagePrice(Number(e.target.value))}
                  className="w-full accent-[#f39c12] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-mono mt-1">
                  <span>₹8,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-300 space-y-1">
                <div className="font-semibold text-white">
                  Total Package Earnings to You: <span className="text-emerald-400 tabular-nums font-mono text-sm">{formatINR(grossMonthlyVolume)}</span>
                </div>
                <div className="text-stone-400">
                  Includes <strong className="text-white tabular-nums font-mono">{formatINR(upfrontAdvanceCollected)}</strong> guaranteed upfront advances credited immediately upon booking, plus <strong className="text-white tabular-nums font-mono">{formatINR(arrivalBalanceCollected)}</strong> collected directly on arrival.
                </div>
                <div className="text-[11px] text-amber-300 pt-1">
                  * 5% platform fee ({formatINR(travelerPlatformFeeOnTop)}) is billed to traveler on top, NEVER deducted from agency.
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traditional OTA */}
              <div className="p-5 rounded-xl bg-stone-900/90 border border-red-500/30 space-y-3">
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                  Typical Mega OTA (25% Cut)
                </div>
                <div className="text-sm text-stone-300">
                  Commission Deducted from You:
                  <div className="text-xl font-bold text-red-400 tabular-nums font-mono mt-0.5">
                    - {formatINR(traditionalOtaCut)}
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-800 text-xs text-stone-400 space-y-1">
                  <div>• Agency Net: <strong className="text-stone-200 tabular-nums">{formatINR(traditionalNetToAgency)}</strong> (75%)</div>
                  <div>• Payout lockup: 30 to 45 days</div>
                  <div>• Masked traveler communication</div>
                  <div>• Zero upfront advance guaranteed</div>
                </div>
              </div>

              {/* Jatingaa Tours */}
              <div className="p-5 rounded-xl bg-stone-900 border-2 border-[#0b4619] relative space-y-3 shadow-lg">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Jatingaa Tours</span>
                  <span className="text-[10px] bg-[#0b4619] px-2 py-0.5 rounded text-white font-bold">0% DEDUCTION</span>
                </div>
                <div className="text-sm text-stone-300">
                  Deducted from Agency:
                  <div className="text-xl font-bold text-emerald-400 tabular-nums font-mono mt-0.5">
                    ₹0 (0% Deducted)
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-800 text-xs text-stone-300 space-y-1">
                  <div>• Agency Net: <strong className="text-emerald-400 font-bold tabular-nums">{formatINR(jatingaaNetToAgency)}</strong> (100%)</div>
                  <div>• Upfront advances: <strong className="text-white tabular-nums">{formatINR(upfrontAdvanceCollected)}</strong> (Instant)</div>
                  <div>• Arrival balance: <strong className="text-white tabular-nums">{formatINR(arrivalBalanceCollected)}</strong></div>
                  <div>• 5% fee: Paid on top by traveler</div>
                </div>
              </div>

              {/* Total Retained Extra Highlight */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#0b4619] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <div className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
                    Extra Revenue Kept By Your Agency:
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
                    +{formatINR(extraEarningsRetained)} / month
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={onOpenRegisterAgency}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-stone-900 bg-[#f39c12] hover:bg-[#d68407] rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow"
                  >
                    List Your Agency
                  </button>
                  <button
                    onClick={onOpenAgencyPortal}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View Agency Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
