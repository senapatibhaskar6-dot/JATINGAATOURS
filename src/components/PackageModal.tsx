import React, { useState } from 'react';
import { TourPackage } from '../types';
import { calculateBookingFees, formatINR } from '../utils/pricing';
import { X, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2, XCircle, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface PackageModalProps {
  tour: TourPackage | null;
  onClose: () => void;
  onBook: (tour: TourPackage, travelersCount: number) => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({ tour, onClose, onBook }) => {
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'destination' | 'inclusions' | 'agency'>('itinerary');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  if (!tour) return null;

  const calc = calculateBookingFees(tour.pricePerPerson, travelersCount);
  const photos = tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.image];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-[#0b4619]">{tour.regionLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{tour.duration}</span>
            <span aria-hidden="true">·</span>
            <span>{tour.fitnessLevel} Fitness</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Media Banner */}
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-stone-100">
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#f39c12]" />
                <span>{tour.location}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {tour.title}
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-stone-200 flex overflow-x-auto gap-4 pt-3 text-sm font-medium text-stone-600 bg-stone-50/50">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'itinerary'
                  ? 'border-[#0b4619] text-[#0b4619] font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Day-by-Day Itinerary ({tour.itinerary.length} Days)
            </button>
            <button
              onClick={() => setActiveTab('destination')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'destination'
                  ? 'border-[#0b4619] text-[#0b4619] font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Destination & Photos ({photos.length})
            </button>
            <button
              onClick={() => setActiveTab('inclusions')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'inclusions'
                  ? 'border-[#0b4619] text-[#0b4619] font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Inclusions & Logistics
            </button>
            <button
              onClick={() => setActiveTab('agency')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'agency'
                  ? 'border-[#0b4619] text-[#0b4619] font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Verified Agency Profile
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 space-y-6">
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 flex items-center gap-3">
                  <span><strong>Starting Point:</strong> {tour.startingPoint}</span>
                  <span aria-hidden="true">·</span>
                  <span><strong>Best Travel Season:</strong> {tour.bestSeason}</span>
                </div>

                <div className="space-y-4 mt-4">
                  {tour.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0b4619] text-white">
                          Day {day.day}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-stone-900 font-display">
                          {day.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {day.description}
                      </p>
                      {day.highlights.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5 text-xs text-stone-500">
                          <span className="font-semibold text-stone-700">Highlights:</span>
                          {day.highlights.map((hl, i) => (
                            <span key={i}>
                              {hl}
                              {i < day.highlights.length - 1 ? ' ·' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'destination' && (
              <div className="space-y-6">
                {/* Photo Gallery Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Verified Media Gallery ({photos.length} High-Resolution Photos)
                    </h4>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Captured by {tour.agency.name}
                    </span>
                  </div>

                  {/* Active Selected Photo Preview */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-sm">
                    <img
                      src={photos[activeGalleryIndex] || photos[0]}
                      alt={`${tour.title} photo preview`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-stone-950/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/20">
                      Photo {activeGalleryIndex + 1} of {photos.length}
                    </div>
                  </div>

                  {/* Thumbnails row */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {photos.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveGalleryIndex(i)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          activeGalleryIndex === i
                            ? 'border-[#0b4619] shadow-md scale-102'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operator Destination Description (within 1,000 words limit) */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-2 text-stone-900 font-bold text-sm font-display">
                      <Sparkles className="w-4 h-4 text-[#f39c12]" />
                      <span>Local Operator Destination Narrative & Ecological Context</span>
                    </div>
                    {tour.destinationWordCount && (
                      <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        {tour.destinationWordCount} words
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                    {tour.destinationDescription ||
                      `Located in ${tour.location}, this curated expedition is guided directly by native hosts and cultural elders. Travelers traverse pristine ecological biomes, learn ancient oral folklore, and directly uplift indigenous family homestays with radical pricing transparency.`}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                  <h4 className="text-sm font-bold text-emerald-950 font-display flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0b4619]" />
                    <span>Included in This Package</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
                    {tour.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#0b4619] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-stone-400" />
                    <span>Excluded / Not Covered</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                    {tour.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'agency' && (
              <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                      <ShieldCheck className="w-5 h-5 text-[#0b4619]" />
                      <span>{tour.agency.name}</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Operated by {tour.agency.founder} · Based in {tour.agency.baseCity}, {tour.agency.state}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <div className="text-stone-400 text-[11px]">Rating</div>
                      <div className="font-bold text-[#0b4619]">{tour.agency.rating} / 5.0</div>
                    </div>
                    <div>
                      <div className="text-stone-400 text-[11px]">Completed</div>
                      <div className="font-bold text-stone-900">{tour.agency.totalToursCompleted}+ Tours</div>
                    </div>
                    <div>
                      <div className="text-stone-400 text-[11px]">Verified Since</div>
                      <div className="font-bold text-stone-900">{tour.agency.verifiedSince}</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {tour.agency.bio}
                </p>

                <div className="p-4 rounded-lg bg-white border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Govt Tourism License / GSTIN:</span>
                    <span className="font-mono font-semibold text-stone-900">{tour.agency.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500 pt-2 border-t border-stone-100">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <Lock className="w-3.5 h-3.5 text-[#f39c12]" />
                      <span>Direct Phone & WhatsApp Number</span>
                    </span>
                    <span className="italic text-stone-400">
                      Automatically unlocked immediately upon booking advance payment
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer: Live Fee Calculator & Checkout Trigger */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-stone-700 whitespace-nowrap">
              Travelers:
            </label>
            <select
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-stone-300 text-stone-900 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>

            <div className="text-xs text-stone-600 pl-2 border-l border-stone-200">
              <span>Total Tour: </span>
              <strong className="text-stone-900 tabular-nums font-bold">
                {formatINR(calc.totalPackagePrice)}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right">
              <div className="text-[11px] text-stone-500">Advance to Lock:</div>
              <div className="text-base font-bold text-[#0b4619] tabular-nums">
                {formatINR(calc.totalAdvancePayable)}
                <span className="text-[10px] text-stone-500 font-normal ml-1">
                  (5% fee on top + ₹1k advance)
                </span>
              </div>
            </div>

            <button
              onClick={() => onBook(tour, travelersCount)}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>Confirm & Pay Advance</span>
              <ArrowRight className="w-4 h-4 text-[#f39c12]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
