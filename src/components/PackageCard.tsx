import React from 'react';
import { TourPackage, B2BAgency } from '../types';
import { calculateBookingFees, calculateB2BWholesale, formatINR } from '../utils/pricing';
import { ShieldCheck, MapPin, Calendar, Users, ArrowRight, Clock, FileText } from 'lucide-react';

interface PackageCardProps {
  tour: TourPackage;
  onSelect: (tour: TourPackage) => void;
  onBook: (tour: TourPackage) => void;
  isB2BMode?: boolean;
  b2bAgency?: B2BAgency;
  onHoldSlot?: (tour: TourPackage) => void;
  onGenerateQuote?: (tour: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  tour,
  onSelect,
  onBook,
  isB2BMode = false,
  b2bAgency,
  onHoldSlot,
  onGenerateQuote,
}) => {
  const calc = calculateBookingFees(tour.pricePerPerson, 1);
  const wholesale = calculateB2BWholesale(tour.pricePerPerson, 1, b2bAgency?.tier || 'Gold');

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between hover:border-[#0b4619]/30">
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelect(tour)}>
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Measured Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30 pointer-events-none" />

        {/* Region & Starting Point (Unboxed clean text) */}
        <div className="absolute top-3.5 left-3.5 text-white text-xs font-semibold drop-shadow flex items-center gap-1.5 bg-stone-950/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-[#f39c12]" />
          <span>{tour.regionLabel}</span>
        </div>

        {isB2BMode && (
          <div className="absolute top-3.5 right-3.5 text-[10px] font-bold text-white bg-emerald-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/40 shadow-xs uppercase tracking-wider">
            {b2bAgency?.tier || 'Gold'} Tier • {b2bAgency?.wholesaleMarginPercent || 18}% Margin
          </div>
        )}

        {!isB2BMode && tour.isUserGenerated && (
          <div className="absolute top-3.5 right-3.5 text-[10px] font-bold text-white bg-[#0b4619]/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/30 shadow-xs uppercase tracking-wider">
            Verified Guide UGC
          </div>
        )}

        {/* Duration & Group (Unboxed clean text) */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 drop-shadow font-medium">
            <span className="font-semibold text-amber-300">{tour.duration}</span>
            <span aria-hidden="true" className="text-white/60">·</span>
            <span>{tour.groupType}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata row */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span>{tour.location}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Starts: {tour.startingPoint}</span>
          </div>

          <h3
            onClick={() => onSelect(tour)}
            className="text-lg font-bold text-stone-900 font-display hover:text-[#0b4619] transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {tour.title}
          </h3>

          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {tour.tagline}
          </p>

          {/* Verified Local Agency Attribution */}
          <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-stone-900">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0b4619]" />
                <span className="truncate max-w-[170px]">{tour.agency.name}</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {tour.agency.baseCity}, {tour.agency.state} · Lic: {tour.agency.licenseNumber}
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-[#0b4619] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">{tour.agency.rating} ★</span>
              <div className="text-[10px] text-stone-400 mt-0.5">{tour.agency.totalToursCompleted} tours</div>
            </div>
          </div>
        </div>

        {/* Pricing & Actions Section */}
        <div className="mt-5 pt-3.5 border-t border-stone-100">
          {/* B2B Mode Pricing Display */}
          {isB2BMode ? (
            <div className="space-y-2 mb-3">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-stone-600">B2B Wholesale Net Cost:</span>
                  <span className="text-base font-extrabold text-[#0b4619] font-mono tabular-nums">
                    {formatINR(wholesale.wholesaleNetRatePerPerson)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-emerald-200/60">
                  <span>Retail Price (RSP): <strong className="text-stone-700">{formatINR(wholesale.retailPricePerPerson)}</strong></span>
                  <span className="font-bold text-emerald-800">Your Margin: +{formatINR(wholesale.agentTotalProfit)}</span>
                </div>
              </div>

              {/* B2B Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onHoldSlot?.(tour)}
                  className="px-2 py-2 text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  title="Hold slots for client (24h/48h)"
                >
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>Hold Slot</span>
                </button>

                <button
                  type="button"
                  onClick={() => onGenerateQuote?.(tour)}
                  className="px-2 py-2 text-[11px] font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  title="Generate branded quotation for client"
                >
                  <FileText className="w-3 h-3 text-stone-600" />
                  <span>Quote</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBook(tour)}
                  className="px-2 py-2 text-[11px] font-semibold text-white bg-[#0b4619] hover:bg-[#073011] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  title="Book at wholesale net rate with Razorpay Live"
                >
                  <span>Book Net</span>
                  <ArrowRight className="w-3 h-3 text-amber-300" />
                </button>
              </div>
            </div>
          ) : (
            /* Retail (B2C) Mode Display */
            <>
              <div className="flex items-baseline justify-between mb-2.5">
                <div>
                  <span className="text-xs text-stone-500">Package Total: </span>
                  <span className="text-lg font-extrabold text-stone-900 font-display tabular-nums">
                    {formatINR(tour.pricePerPerson)}
                  </span>
                  <span className="text-[11px] text-stone-400"> / person</span>
                </div>
              </div>

              {/* Core Formula Advance Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between mb-3 text-xs shadow-xs">
                <span className="text-stone-700 font-medium">
                  Initial Advance to Lock:
                </span>
                <span className="font-bold text-[#0b4619] tabular-nums">
                  {formatINR(calc.totalAdvancePayable)}
                  <span className="text-[10px] font-normal text-stone-500 ml-1">(5% fee on top + ₹1k)</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelect(tour)}
                  className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer text-center active:scale-[0.98]"
                >
                  View Itinerary
                </button>
                <button
                  onClick={() => onBook(tour)}
                  className="px-3 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] active:bg-[#041c09] rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#f39c12]" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

