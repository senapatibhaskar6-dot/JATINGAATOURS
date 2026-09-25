import React, { useState } from 'react';
import { calculateBookingFees, formatINR } from '../utils/pricing';
import { Calculator, ArrowRight, ShieldCheck, Banknote, UserCheck, HelpCircle } from 'lucide-react';

export const FinancialExplainer: React.FC = () => {
  const [testPrice, setTestPrice] = useState<number>(20000);
  const [testTravelers, setTestTravelers] = useState<number>(1);

  const calc = calculateBookingFees(testPrice, testTravelers);

  return (
    <section id="financial-model" className="w-full py-20 bg-gradient-to-b from-[#fbfbfa] via-white to-[#f8f8f5] border-b border-stone-200/90 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-radial-at-t from-emerald-500/5 via-amber-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b4619]/10 border border-[#0b4619]/20 text-xs font-bold text-[#0b4619] tracking-wider uppercase mb-3 shadow-xs">
            <span>Fair & Transparent Commerce</span>
            <span aria-hidden="true">·</span>
            <span>Zero Hidden Markup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-display">
            The Jatingaa 5% + ₹1,000 Booking Formula
          </h2>
          <p className="mt-3.5 text-base text-stone-600 leading-relaxed">
            Mainstream travel aggregators siphon 20% to 35% commission directly from local operators and withhold payments for weeks.
            Jatingaa Tours protects local hosts with a <strong className="text-stone-900 font-semibold">0% agency deduction policy</strong>:
            the 5% platform fee is paid by the traveler on top as a platform service charge, and the local agency receives <strong className="text-stone-900 font-semibold">100% of their full package price</strong> plus an instant ₹1,000 upfront booking lock-in advance.
          </p>
        </div>

        {/* 3 Step Visual Flow with Subtle Shadows & Clean Card Styling */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-7 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group hover:border-[#0b4619]/30">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0b4619]/10 flex items-center justify-center text-[#0b4619] mb-6 group-hover:scale-110 group-hover:bg-[#0b4619] group-hover:text-white transition-all duration-300 shadow-xs">
                <Banknote className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0b4619] mb-1.5">
                Step 01: Browse & Select
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                100% Operator Asking Price
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Local operators set their genuine prices. We never force price cuts or siphon commissions from their listings.
                You see the full itinerary, inclusions, and operator credentials upfront.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% genuine operator pricing</span>
            </div>
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white border-2 border-[#0b4619] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative group ring-4 ring-[#0b4619]/10">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#0b4619] to-[#156226] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md tracking-wide">
              CORE FORMULA
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f39c12]/20 flex items-center justify-center text-[#d68407] mb-6 group-hover:scale-110 group-hover:bg-[#f39c12] group-hover:text-stone-950 transition-all duration-300 shadow-xs">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#d68407] mb-1.5">
                Step 02: Initial Booking
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                5% Platform + ₹1,000 Advance
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                To lock in your dates, you only pay:
                <br />
                <strong className="text-stone-900 font-semibold">5% Platform Fee</strong> (paid on top by traveler for support & escrow) +{' '}
                <strong className="text-stone-900 font-semibold">₹1,000 agency advance</strong> deposited directly to guarantee vehicles and guides.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-[#0b4619] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f39c12]" />
                <span>0% Taken From Host</span>
              </span>
              <span className="text-[#0b4619] underline underline-offset-2">Instant Contact Unlock</span>
            </div>
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group hover:border-[#0b4619]/30">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0b4619]/10 flex items-center justify-center text-[#0b4619] mb-6 group-hover:scale-110 group-hover:bg-[#0b4619] group-hover:text-white transition-all duration-300 shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0b4619] mb-1.5">
                Step 03: On Arrival
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Full Balance Directly to Host
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                The entire remaining balance (Total Package Price minus the ₹1,000 advance already paid)
                is handed directly to your local guide or homestay host upon trip arrival.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Agency receives 100% of package value</span>
            </div>
          </div>
        </div>

        {/* Interactive Pricing Simulator with Sleek Subtle Shadows */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-xl ring-1 ring-stone-900/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0b4619] tracking-wider uppercase mb-1">
                <Calculator className="w-3.5 h-3.5 text-[#f39c12]" />
                <span>Transparent Estimator</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-display">
                Interactive Booking Amount Calculator
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                Test any package price to see the exact breakdown between the 5% platform commission, ₹1,000 agency advance, and arrival balance.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Presets:</span>
              {[12000, 18500, 24500, 35000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTestPrice(preset)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                    testPrice === preset
                      ? 'bg-[#0b4619] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  ₹{(preset / 1000).toFixed(preset % 1000 === 0 ? 0 : 1)}k
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-semibold text-stone-900 mb-2">
                  <span>Package Price (Per Person)</span>
                  <span className="text-[#0b4619] font-bold text-lg tabular-nums">
                    {formatINR(testPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="500"
                  value={testPrice}
                  onChange={(e) => setTestPrice(Number(e.target.value))}
                  className="w-full accent-[#0b4619] cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1.5 font-mono">
                  <span>₹5,000</span>
                  <span>₹30,000</span>
                  <span>₹60,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-semibold text-stone-900 mb-2">
                  <span>Number of Travelers</span>
                  <span className="text-stone-900 font-bold tabular-nums">
                    {testTravelers} {testTravelers === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setTestTravelers(num)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-xs ${
                        testTravelers === num
                          ? 'bg-[#0b4619] text-white border-[#0b4619] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {num} {num === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0b4619] shrink-0 mt-0.5" />
                <div>
                  <strong>Why ₹1,000 fixed advance?</strong> This guarantees that local drivers,
                  guesthouse hosts, and certified mountain guides have fuel and reservation guarantees without risk of no-shows.
                </div>
              </div>
            </div>

            {/* Visual Breakdown Result Card */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-md ring-1 ring-stone-900/5">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <Calculator className="w-3.5 h-3.5 text-[#f39c12]" />
                  <span>Live Calculation Breakdown</span>
                </span>
                <span className="text-[11px] text-[#0b4619] font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/50">
                  0% Host Deduction
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-stone-700 font-medium">Total Tour Value ({testTravelers} pax)</span>
                  <span className="font-bold text-stone-900 text-base tabular-nums font-display">
                    {formatINR(calc.totalPackagePrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <span>5% Platform Fee (Paid on Top by Traveler)</span>
                    <span className="text-stone-400 text-[11px]">(5% of {formatINR(calc.totalPackagePrice)})</span>
                  </span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    +{formatINR(calc.platformCommission)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <span>Local Agency Upfront Advance</span>
                    <span className="text-stone-400 text-[11px]">(Guaranteed booking lock)</span>
                  </span>
                  <span className="font-semibold text-[#0b4619] tabular-nums">
                    {formatINR(calc.agencyAdvanceFee)}
                  </span>
                </div>

                {/* Total Payable Today Highlight */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0b4619] via-[#0e561f] to-[#156226] text-white flex justify-between items-center shadow-lg shadow-emerald-950/20 border border-emerald-700/40">
                  <div>
                    <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-bold">
                      Total Due Today to Lock
                    </div>
                    <div className="text-xs text-emerald-100 mt-0.5">5% Platform Fee + ₹1,000 Agency Advance</div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#f39c12] tabular-nums drop-shadow-sm font-display">
                    {formatINR(calc.totalAdvancePayable)}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-xs">
                  <span className="text-stone-600 font-medium">
                    Remaining Balance Due to Local Host on Arrival:
                  </span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {formatINR(calc.remainingBalanceDueOnArrival)}
                  </span>
                </div>

                {/* Total Received by Agency */}
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 flex justify-between items-center text-xs shadow-xs">
                  <div>
                    <span className="font-bold text-[#0b4619]">Agency Net Payout (0% Deducted):</span>
                    <div className="text-[10px] text-emerald-800">
                      ₹1,000 advance + {formatINR(calc.remainingBalanceDueOnArrival)} on arrival
                    </div>
                  </div>
                  <span className="text-base font-bold text-[#0b4619] tabular-nums font-mono">
                    {formatINR(calc.agencyTotalEarnings)} (100%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
