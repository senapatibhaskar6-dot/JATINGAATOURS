import React from 'react';
import { Search, CreditCard, Unlock, HeartHandshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Discover Native Itineraries',
      desc: 'Browse curated expeditions crafted directly by certified local guides and tribal homestay hosts across Northeast, Ladakh, Western Ghats, and Rajasthan.',
    },
    {
      num: '02',
      icon: CreditCard,
      title: 'Pay Fair 5% + ₹1,000 Advance',
      desc: 'Lock in your expedition dates with our transparent booking advance: 5% platform fee paid on top by the traveler plus a guaranteed ₹1,000 upfront advance directly for the local agency. Zero commission is ever deducted from the agency.',
    },
    {
      num: '03',
      icon: Unlock,
      title: 'Instant Direct Contact Unlock',
      desc: 'The moment payment clears, you unlock the agency founder’s direct phone and WhatsApp number. Connect immediately to coordinate pickup and custom diets.',
    },
    {
      num: '04',
      icon: HeartHandshake,
      title: 'Pay Balance Directly on Arrival',
      desc: 'No middleman holding your money for 45 days. The entire remaining balance is handed directly to your local guide or homestay host upon trip commencement.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 bg-gradient-to-b from-white via-[#fafaf8] to-white border-b border-stone-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b4619]/10 border border-[#0b4619]/20 text-xs font-bold text-[#0b4619] tracking-wider uppercase mb-3 shadow-xs">
            <span>Seamless & Ethical Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-display">
            How Jatingaa Connects You With Local Roots
          </h2>
          <p className="mt-3.5 text-base text-stone-600 leading-relaxed">
            A frictionless, direct booking cycle built on mutual trust, legal license verification, and honest pricing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group hover:border-[#0b4619]/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#0b4619]/10 flex items-center justify-center text-[#0b4619] group-hover:bg-[#0b4619] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#d68407] bg-[#f39c12]/15 px-2.5 py-1 rounded-md border border-[#f39c12]/20">
                      STEP {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 font-display group-hover:text-[#0b4619] transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-stone-100 text-[11px] font-semibold text-[#0b4619] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Direct connection</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
