import React, { useState } from 'react';
import { TravelStory, TourPackage } from '../types';
import { REGIONS_FILTER } from '../data/packages';
import { BookOpen, MapPin, Clock, ShieldCheck, ArrowRight, Sparkles, PlusCircle, Heart } from 'lucide-react';

interface TravelStoriesSectionProps {
  stories: TravelStory[];
  packages: TourPackage[];
  onSelectStory: (story: TravelStory) => void;
  onBookPackage: (pkg: TourPackage) => void;
  onOpenAgencyPortal: () => void;
}

export const TravelStoriesSection: React.FC<TravelStoriesSectionProps> = ({
  stories,
  packages,
  onSelectStory,
  onBookPackage,
  onOpenAgencyPortal,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredStories = selectedRegion === 'all'
    ? stories
    : stories.filter((s) => s.region === selectedRegion);

  return (
    <section id="travel-stories-section" className="w-full py-20 bg-[#fbfbfa] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b4619]/10 border border-[#0b4619]/20 text-xs font-bold text-[#0b4619] tracking-wider uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Native Field Journals & Travel Guides (UGC)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-display">
              Stories From Native Guides
            </h2>
            <p className="mt-3 text-base text-stone-600 max-w-2xl leading-relaxed">
              Written directly by verified indigenous guides, mountain climbers, and village homestay hosts.
              Discover authentic secrets, sacred roots, and cultural etiquette before you travel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAgencyPortal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#0b4619]/30 text-xs font-semibold text-[#0b4619] hover:bg-[#0b4619]/5 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#f39c12]" />
              <span>Write a Travel Guide (Guide Portal)</span>
            </button>
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {REGIONS_FILTER.map((rf) => {
            const isSelected = selectedRegion === rf.id;
            return (
              <button
                key={rf.id}
                onClick={() => setSelectedRegion(rf.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0b4619] text-white shadow-sm'
                    : 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                }`}
              >
                {rf.label}
              </button>
            );
          })}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStories.map((story) => {
            const associatedTour = story.associatedPackageId
              ? packages.find((p) => p.id === story.associatedPackageId)
              : null;

            return (
              <article
                key={story.id}
                className="group flex flex-col bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-stone-300 transition-all duration-300 overflow-hidden"
              >
                {/* Image Cover */}
                <div
                  onClick={() => onSelectStory(story)}
                  className="relative h-48 w-full overflow-hidden bg-stone-900 cursor-pointer"
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f39c12] text-stone-950 uppercase tracking-wider shadow-xs">
                      {story.regionLabel}
                    </span>
                    {story.isUserGenerated && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white shadow-xs">
                        New UGC
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 text-[11px] text-stone-200">
                      <MapPin className="w-3 h-3 text-[#f39c12]" />
                      <span className="truncate max-w-[140px]">{story.destination}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-stone-300">
                      <Clock className="w-3 h-3" />
                      <span>{story.readTimeMinutes} min</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      onClick={() => onSelectStory(story)}
                      className="text-base font-bold font-display text-stone-900 group-hover:text-[#0b4619] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {story.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {story.subtitle}
                    </p>
                  </div>

                  {/* Author Agency */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0b4619] text-[#f39c12] text-xs font-bold flex items-center justify-center shrink-0">
                        {story.authorAgency.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-stone-900 truncate max-w-[130px]">
                          {story.authorAgency.founder}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[130px]">
                          {story.authorAgency.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-stone-400 text-xs shrink-0">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>{story.likesCount}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectStory(story)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3 h-3 text-stone-500" />
                    </button>

                    {associatedTour && (
                      <button
                        onClick={() => onBookPackage(associatedTour)}
                        className="py-2 px-3 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title={`Direct Book ${associatedTour.title}`}
                      >
                        <Sparkles className="w-3 h-3 text-[#f39c12]" />
                        <span>Book</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Native Contributor Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#062b0f] to-[#0b4619] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f39c12] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>For Native Guides & Tourism Collectives</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Share Your Local Knowledge & List Your Direct Tours
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Upload real destination photos, insider travel tips, and tour packages. You keep 100% of your listed prices with instant ₹1,000 advances and direct WhatsApp connections to travelers.
            </p>
          </div>

          <button
            onClick={onOpenAgencyPortal}
            className="px-5 py-3 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <span>Open Vendor Portal & UGC Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
