import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, MapPin, CheckCircle2, UserCheck, Heart } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  avatar: string;
  tourTitle: string;
  tourLocation: string;
  operatorName: string;
  rating: number;
  reviewDate: string;
  travelerType: 'Solo Traveler' | 'Couple' | 'Family with Kids' | 'Friends Group';
  highlight: string;
  reviewText: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Ananya & Rohit Sharma',
    location: 'Bangalore, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    tourTitle: 'Living Root Bridges & Cherrapunji Cloud Valleys',
    tourLocation: 'Meghalaya',
    operatorName: 'Khasi Hills Eco-Tourism Cooperative Society',
    rating: 5,
    reviewDate: 'February 2026',
    travelerType: 'Couple',
    highlight: 'No hidden commission cuts — our money directly empowered the native Khasi guides',
    reviewText: 'Booking through Jatingaa was refreshing. Unlike standard travel agents who mark up prices by 30-40%, we paid the transparent 5% platform fee + ₹1,000, and immediately received our guide Wanphrang’s direct WhatsApp. He picked us up from Guwahati, introduced us to his family in Nongriat, and led us through ancient sacred groves. Pure authenticity.',
  },
  {
    id: 't-2',
    name: 'Dr. Debabrata Sen & Family',
    location: 'Kolkata, West Bengal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    tourTitle: 'Kaziranga Wildlife Safari & Brahmaputra Sunset Cruise',
    tourLocation: 'Assam',
    operatorName: 'Brahmaputra Inbound DMC & Expeditions',
    rating: 5,
    reviewDate: 'January 2026',
    travelerType: 'Family with Kids',
    highlight: 'Flawless jeep safari permits & direct contact with local naturalists',
    reviewText: 'Taking elderly parents and children on a wildlife trip is often stressful, but having direct coordination with Assam River Travels made all the difference. Our open gypsy driver, Dipen, was an Assam Forest certified elder who spotted one-horned rhinos and elusive birds within minutes. The instant voucher confirmed our dates without delay.',
  },
  {
    id: 't-3',
    name: 'Siddharth Iyer',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    tourTitle: 'High Altitude Ladakh Passes & Pangong Homestay Trail',
    tourLocation: 'Ladakh & Zanskar',
    operatorName: 'Ladakh Native Nomadic Journeys',
    rating: 5,
    reviewDate: 'December 2025',
    travelerType: 'Solo Traveler',
    highlight: 'Staying in warm nomadic Ladakhi homestays with direct host unlock',
    reviewText: 'As a solo photographer, I wanted real connections rather than sterile resorts. The Jatingaa platform fee was only ₹1,000 upfront, allowing me to pay the balance directly to the hosts on arrival in Leh. Tundup and his family provided oxygen canisters, yak butter tea, and ancient Buddhist folklore. 10/10 recommendation.',
  },
  {
    id: 't-4',
    name: 'Pooja Verma & Friends',
    location: 'New Delhi, Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    tourTitle: 'Majuli Island Pottery, Mask Making & Sacred Satras',
    tourLocation: 'Assam',
    operatorName: 'Majuli Indigenous Tourism Collective',
    rating: 5,
    reviewDate: 'January 2026',
    travelerType: 'Friends Group',
    highlight: 'Real cultural immersion, bamboo cottage stays and traditional Mishing feast',
    reviewText: 'We spent 4 days cycling across Majuli river island and learning century-old terracotta mask artistry from monks at Samaguri Satra. The booking receipt broken down every single rupee with zero hidden fees. Jatingaa is transforming how we travel sustainably in Northeast India.',
  },
  {
    id: 't-5',
    name: 'Vikram & Sneha Kulkarni',
    location: 'Pune, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    tourTitle: 'Traditional Kerala Backwaters & Spice Plantation Trail',
    tourLocation: 'Alleppey & Munnar, Kerala',
    operatorName: 'Kerala Heritage Waterways Cooperative',
    rating: 5,
    reviewDate: 'November 2025',
    travelerType: 'Couple',
    highlight: 'Eco-friendly wooden houseboat with solar power & freshly prepared Karimeen',
    reviewText: 'We avoided the crowded commercial tourist boats thanks to the verified cooperative network. We had our captain’s direct mobile number immediately upon booking. The food cooked on board was fresh from village backwater farms. Exceptional hospitality and pricing honesty.',
  }
];

interface TestimonialCarouselProps {
  onExploreTours?: () => void;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ onExploreTours }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTag, setSelectedTag] = useState<'All' | 'Couple' | 'Family with Kids' | 'Solo Traveler' | 'Friends Group'>('All');

  const filteredTestimonials = selectedTag === 'All'
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.travelerType === selectedTag);

  const activeTestimonial = filteredTestimonials[currentIndex % filteredTestimonials.length] || TESTIMONIALS[0];

  // Auto rotation every 6 seconds unless paused on hover
  useEffect(() => {
    if (isPaused || filteredTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, filteredTestimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  return (
    <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-[#fafaf8] via-stone-50 to-[#f5f5f0] border-t border-stone-200 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0b4619]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#f39c12]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b4619]/10 border border-[#0b4619]/20 text-xs font-bold text-[#0b4619] tracking-wider uppercase mb-3 shadow-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Verified Traveler Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-display">
            Loved by Travelers, Trusted by Local Hosts
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-stone-600 leading-relaxed">
            Read authentic reviews from guests who booked expeditions across India with our fair 5% fee model, zero middlemen inflation, and instant local host unlock.
          </p>

          {/* Social Proof Metric Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <strong className="text-stone-900 font-bold">4.96 / 5</strong>
              <span className="text-stone-400">·</span>
              <span>2,400+ verified guests</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#0b4619]" />
              <span className="font-semibold text-stone-900">100% Direct Host Connect</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#0b4619]" />
              <span className="font-semibold text-stone-900">Transparent 5% Platform Fee</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {(['All', 'Couple', 'Family with Kids', 'Solo Traveler', 'Friends Group'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSelectedTag(tag);
                  setCurrentIndex(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#0b4619] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Card Container */}
        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden relative transition-all duration-500">
            {/* Top Accent Band */}
            <div className="h-1.5 bg-gradient-to-r from-[#0b4619] via-emerald-600 to-[#f39c12]" />

            <div className="p-6 sm:p-10 lg:p-12 relative">
              {/* Background decorative quote mark */}
              <Quote className="absolute right-6 top-8 w-20 h-20 text-stone-100 -rotate-12 pointer-events-none select-none" />

              {/* Verified Tag & Tour Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0b4619]">
                    <UserCheck className="w-3.5 h-3.5 text-[#0b4619]" />
                    <span>Verified Booking</span>
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {activeTestimonial.travelerType}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-bold font-mono">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-stone-800">5.0</span>
                </div>
              </div>

              {/* Bold Highlight Quote */}
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display leading-snug mb-4">
                &ldquo;{activeTestimonial.highlight}&rdquo;
              </h3>

              {/* Detailed Review Text */}
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans mb-8">
                {activeTestimonial.reviewText}
              </p>

              {/* Tour & Host Attribution Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-8 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#f39c12] shrink-0" />
                  <span className="text-stone-700">
                    Tour: <strong className="text-stone-900">{activeTestimonial.tourTitle}</strong> ({activeTestimonial.tourLocation})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 sm:border-l sm:border-stone-200 sm:pl-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0b4619] shrink-0" />
                  <span>Hosted by: <strong className="text-[#0b4619]">{activeTestimonial.operatorName}</strong></span>
                </div>
              </div>

              {/* Traveler Profile & Navigation Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-stone-100">
                {/* Traveler Info */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-700/20 shadow-sm"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 font-display">
                      {activeTestimonial.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {activeTestimonial.location} · {activeTestimonial.reviewDate}
                    </p>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-xs cursor-pointer"
                    aria-label="Previous testimonial"
                    title="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {filteredTestimonials.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex % filteredTestimonials.length
                            ? 'w-6 bg-[#0b4619]'
                            : 'w-2 bg-stone-300 hover:bg-stone-400'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-xs cursor-pointer"
                    aria-label="Next testimonial"
                    title="Next review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Link below carousel */}
          {onExploreTours && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onExploreTours}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4619] hover:underline cursor-pointer"
              >
                <span>Browse all verified tours and experience the difference</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
