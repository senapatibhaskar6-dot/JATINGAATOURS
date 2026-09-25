import React from 'react';
import { TourPackage } from '../types';
import { REGIONS_FILTER } from '../data/packages';
import { PackageCard } from './PackageCard';
import { Compass, Filter, RefreshCw } from 'lucide-react';

interface PackageGridProps {
  packages: TourPackage[];
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onBookPackage: (pkg: TourPackage) => void;
  onResetFilters: () => void;
}

export const PackageGrid: React.FC<PackageGridProps> = ({
  packages,
  selectedRegion,
  onSelectRegion,
  searchQuery,
  onSearchChange,
  onSelectPackage,
  onBookPackage,
  onResetFilters,
}) => {
  return (
    <section id="packages-section" className="w-full py-20 bg-[#fafaf8] border-b border-stone-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b4619]/10 border border-[#0b4619]/20 text-xs font-bold text-[#0b4619] tracking-wider uppercase mb-3 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Verified Local Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-display">
              Curated All-India Expedition Packages
            </h2>
            <p className="mt-3.5 text-base text-stone-600 max-w-2xl leading-relaxed">
              Every package is hosted directly by state-licensed local collectives. Lock in your dates with
              our standard 5% platform fee + ₹1,000 agency fee, then receive the host’s direct contact immediately.
            </p>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-1.5 shrink-0 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-xs">
            <span>Showing</span>
            <strong className="text-stone-900 font-bold">{packages.length}</strong>
            <span>verified tours</span>
          </div>
        </div>

        {/* Filter Controls (Segmented clean control) */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl shadow-inner border border-stone-200/80">
            {REGIONS_FILTER.map((rf) => (
              <button
                key={rf.id}
                onClick={() => onSelectRegion(rf.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === rf.id
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span>Filtered by: &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => onSearchChange('')}
                className="text-[#0b4619] font-medium hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packages.map((tour) => (
              <PackageCard
                key={tour.id}
                tour={tour}
                onSelect={onSelectPackage}
                onBook={onBookPackage}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 py-16 px-4 text-center rounded-2xl bg-stone-50 border border-stone-200">
            <Filter className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900 font-display">
              No matching tours found
            </h3>
            <p className="mt-1 text-sm text-stone-500 max-w-sm mx-auto">
              We couldn't find any packages matching your filter criteria. Try searching a different region or term.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
