import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AgencyRegisterModalProps {
  onClose: () => void;
  onRegistered: (agencyName: string) => void;
}

export const AgencyRegisterModal: React.FC<AgencyRegisterModalProps> = ({
  onClose,
  onRegistered,
}) => {
  const [agencyName, setAgencyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [stateRegion, setStateRegion] = useState('Northeast (Meghalaya / Assam / Arunachal)');
  const [baseCity, setBaseCity] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('Trekking & Cultural Homestays');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !founderName || !phone || !licenseNumber) {
      alert('Please fill in all required fields including your state tourism license / GSTIN.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      onRegistered(agencyName);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0b4619] flex items-center justify-center text-[#f39c12]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                Partner Agency Onboarding
              </h2>
              <div className="text-[11px] text-stone-500">
                0% agency deduction policy with guaranteed ₹1,000 upfront advances and 100% payout.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0b4619] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Agency Application Approved!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Welcome, <strong>{agencyName}</strong>! Your state tourism credentials have been verified.
                You retain 100% of your listed prices with zero commission deducted from your earnings.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0b4619] shrink-0 mt-0.5" />
                <div>
                  <strong>0% Commission Deducted from Agency:</strong> You receive 100% of your package value.
                  The 5% platform fee is paid by the traveler on top, and you receive an instant ₹1,000 booking advance for every confirmed booking.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Agency / Collective Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spiti Mountain Trails"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Founder / Lead Guide Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tenzin Norbu"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Operating State / Region *
                  </label>
                  <select
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  >
                    <option>Northeast (Meghalaya / Assam / Arunachal)</option>
                    <option>Ladakh & Jammu & Kashmir</option>
                    <option>Himachal Pradesh & Uttarakhand</option>
                    <option>Kerala & Western Ghats</option>
                    <option>Rajasthan & Western Deserts</option>
                    <option>Goa, Konkan & Coastal Islands</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Headquarters / Base City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shillong, Leh, Kochi, Jaisalmer"
                    value={baseCity}
                    onChange={(e) => setBaseCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tourism License # / GSTIN / Reg ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MEG/TOUR/2022/491 or GSTIN"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Direct WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@agency.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="High altitude trekking, wildlife, homestays"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Submit Verification</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#f39c12]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
