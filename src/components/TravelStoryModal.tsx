import React from 'react';
import { TravelStory, TourPackage } from '../types';
import { X, Calendar, Clock, MapPin, ShieldCheck, Share2, Heart, Compass, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface TravelStoryModalProps {
  story: TravelStory;
  packages: TourPackage[];
  onClose: () => void;
  onBookPackage: (pkg: TourPackage) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onLikeStory?: (storyId: string) => void;
}

export const TravelStoryModal: React.FC<TravelStoryModalProps> = ({
  story,
  packages,
  onClose,
  onBookPackage,
  onSelectPackage,
  onLikeStory,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(story.likesCount);

  const associatedTour = story.associatedPackageId
    ? packages.find((p) => p.id === story.associatedPackageId)
    : packages.find((p) => p.agency.id === story.authorAgency.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (onLikeStory) onLikeStory(story.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sticky top action bar */}
        <div className="px-6 py-3.5 bg-stone-900 text-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#f39c12]" />
            <span className="text-stone-300 font-medium">Native Travel Guide & Destination Field Journal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy Story Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handleLike}
              className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                liked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-950">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f39c12] text-stone-950 uppercase tracking-wider">
                  {story.regionLabel}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3 text-[#f39c12]" />
                  <span>{story.destination}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{story.readTimeMinutes} min read</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-bold font-display leading-tight text-white drop-shadow-sm">
                {story.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-light">
                {story.subtitle}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8 max-w-3xl mx-auto">
            {/* Author Byline & Verification Credential */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0b4619] text-[#f39c12] font-bold text-base flex items-center justify-center shrink-0 border border-emerald-300/30">
                  {story.authorAgency.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900 font-display">
                      {story.authorAgency.founder}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-[#0b4619]" />
                      <span>Govt Verified Guide</span>
                    </span>
                  </div>
                  <div className="text-xs text-stone-600">
                    {story.authorRole} · {story.authorAgency.name} ({story.authorAgency.baseCity}, {story.authorAgency.state})
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                    Reg: {story.authorAgency.licenseNumber}
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-500 sm:text-right shrink-0">
                <div className="flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>Published {story.publishedDate}</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  ★ {story.authorAgency.rating} ({story.authorAgency.totalToursCompleted}+ tours completed)
                </div>
              </div>
            </div>

            {/* Main Article Paragraphs */}
            <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
              {story.contentParagraphs.map((paragraph, index) => (
                <p key={index} className="text-stone-700 leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Photo Gallery if additional images exist */}
            {story.galleryImages && story.galleryImages.length > 1 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#0b4619]" />
                  <span>Real Destination Gallery</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {story.galleryImages.map((img, i) => (
                    <div key={i} className="relative h-48 rounded-xl overflow-hidden shadow-sm group">
                      <img
                        src={img}
                        alt={`${story.destination} scene ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Native Insider Tips Box */}
            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm font-display uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#f39c12]" />
                <span>Native Guide Insider Tips ({story.destination})</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-800">
                {story.insiderTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cultural Etiquette Box */}
            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs sm:text-sm font-display uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-[#0b4619]" />
                <span>Local Cultural Etiquette & Respectful Visiting</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                {story.culturalEtiquette.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0b4619] shrink-0 mt-1.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Season Advisory */}
            <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs sm:text-sm text-stone-700 flex items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-stone-900">Recommended Visiting Season:</span>{' '}
                <span>{story.bestVisitingMonths}</span>
              </div>
            </div>

            {/* Story Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-500">Topics:</span>
              {story.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 text-stone-700 border border-stone-200"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Associated Tour Package Card Callout */}
            {associatedTour && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#062b0f] to-[#0b4619] text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-[#f39c12] font-bold">
                    Experience This Destination With {story.authorAgency.name}
                  </div>
                  <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-stone-200">
                    Direct Booking · 0% Agency Cut
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      {associatedTour.title}
                    </h3>
                    <p className="text-xs text-stone-200 mt-1 max-w-lg line-clamp-2">
                      {associatedTour.tagline}
                    </p>
                    <div className="text-xs text-emerald-200 font-mono mt-2">
                      ₹{associatedTour.pricePerPerson.toLocaleString('en-IN')} / person · {associatedTour.duration}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPackage(associatedTour);
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 rounded-lg transition-colors cursor-pointer"
                    >
                      View Itinerary
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBookPackage(associatedTour);
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-stone-950 bg-[#f39c12] hover:bg-[#e67e22] rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Direct Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Authored by certified local partner collective · Verified by Jatingaa Tours
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
