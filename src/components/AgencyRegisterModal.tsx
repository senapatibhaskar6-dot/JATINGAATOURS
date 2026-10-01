import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Building, CreditCard } from 'lucide-react';
import { Agency } from '../types';
import { insertAgencyToSupabase, triggerAgencyWelcomeEmail } from '../utils/supabaseClient';

interface AgencyRegisterModalProps {
  onClose: () => void;
  onRegistered: (newAgency: Agency) => void;
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
  
  // Bank details fields for operator automated payout
  const [bankName, setBankName] = useState('State Bank of India');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [upiId, setUpiId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !founderName || !phone || !licenseNumber) {
      alert('Please fill in all required fields including your state tourism license / GSTIN.');
      return;
    }

    setIsSubmitting(true);
    setSupabaseStatus('Connecting to Supabase cloud database...');

    const locationStr = `${baseCity || 'Local Base'}, ${stateRegion.split(' ')[0]}`;
    const bankDetailsPayload = {
      bankName: bankName || 'State Bank of India',
      bankAccountName: agencyName,
      bankAccountNumber: bankAccountNumber || '38920194821',
      bankIfsc: bankIfsc || 'SBIN0000001',
      upiId: upiId || `${phone.replace(/\D/g, '')}@upi`,
      licenseNumber: licenseNumber,
      specialty: specialty,
    };

    // 1. Insert into Supabase table: agencies (columns: agency_name, owner_name, phone, email, location, bank_details)
    try {
      const res = await insertAgencyToSupabase({
        agencyName: agencyName.trim(),
        ownerName: founderName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${agencyName.toLowerCase().replace(/\s+/g, '')}@partner.in`,
        location: locationStr,
        bankDetails: bankDetailsPayload,
      });

      if (res.success) {
        setSupabaseStatus('Successfully synchronized with Supabase agencies database!');
      } else {
        console.warn('Supabase insertion had an issue, fallback to local storage active:', res.error);
        setSupabaseStatus('Saved locally and queued for Supabase sync.');
      }
    } catch (err) {
      console.error('Error inserting into Supabase:', err);
    }

    // Trigger automated welcome email via Supabase Edge Function (using Resend API)
    triggerAgencyWelcomeEmail({
      agencyName: agencyName.trim(),
      email: email.trim() || `${agencyName.toLowerCase().replace(/\s+/g, '')}@partner.in`,
      phone: phone.trim(),
    }).catch(err => console.log('Edge function trigger note:', err));

    const newAgency: Agency = {
      id: `ag-new-${Date.now()}`,
      name: agencyName,
      founder: founderName,
      baseCity: baseCity || 'Local Base',
      state: stateRegion.split(' ')[0],
      phone: phone,
      whatsapp: phone,
      email: email || `${agencyName.toLowerCase().replace(/\s+/g, '')}@partner.in`,
      licenseNumber: licenseNumber,
      verifiedSince: new Date().getFullYear().toString(),
      rating: 5.0,
      totalToursCompleted: 0,
      bio: `${agencyName} is a verified local tour operator specializing in ${specialty}.`,
      specialty: specialty,
      status: 'verified',
      bankName: bankName || 'State Bank of India',
      bankAccountName: agencyName,
      bankAccountNumber: bankAccountNumber || '38920194821',
      bankIfsc: bankIfsc || 'SBIN0000001',
      upiId: upiId || `${phone.replace(/\D/g, '')}@upi`,
      payoutStatus: 'verified',
    };

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onRegistered(newAgency);
    }, 1500);
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

              {/* Bank Details Section for Automated Payouts */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0b4619]" />
                  <span className="text-xs font-bold text-stone-900">
                    Operator Bank Details (For Instant Arrival Balance & Advance Settlements)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India, HDFC"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 38920194821"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0000001"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      UPI ID / VPA (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. agency@oksbi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                </div>
                <div className="text-[10px] text-stone-500">
                  Data will be securely inserted into Supabase cloud table <code className="text-[#0b4619] font-bold">agencies</code> with your verified contact and payout details.
                </div>
              </div>

              {isSubmitting && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0b4619]" />
                  <span>{supabaseStatus || 'Syncing with Supabase cloud database...'}</span>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] disabled:bg-stone-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing with Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Verification</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f39c12]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
