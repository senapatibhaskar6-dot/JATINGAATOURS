import React, { useState } from 'react';
import { TourPackage, B2BAgency, B2BQuotation } from '../types';
import { formatINR, calculateB2BWholesale } from '../utils/pricing';
import {
  X, FileText, Printer, Share2, CheckCircle2, ShieldCheck,
  Calendar, Users, MapPin, Phone, Mail, Award, Clock, ArrowRight,
  ExternalLink, Sparkles, Building2, Download
} from 'lucide-react';
import jatingaaLogo from '../assets/images/jatingaa_tours_logo.png';

interface B2BQuotationVoucherModalProps {
  packageData: TourPackage;
  activeAgency: B2BAgency;
  initialQuotation?: B2BQuotation | null;
  onClose: () => void;
  onSaveQuotation?: (quote: B2BQuotation) => void;
  onProceedToPayAdvance?: (quote: B2BQuotation) => void;
}

export const B2BQuotationVoucherModal: React.FC<B2BQuotationVoucherModalProps> = ({
  packageData,
  activeAgency,
  initialQuotation,
  onClose,
  onSaveQuotation,
  onProceedToPayAdvance,
}) => {
  const [clientName, setClientName] = useState(initialQuotation?.clientName || '');
  const [clientPhone, setClientPhone] = useState(initialQuotation?.clientPhone || '');
  const [clientEmail, setClientEmail] = useState(initialQuotation?.clientEmail || '');
  const [travelersCount, setTravelersCount] = useState<number>(initialQuotation?.travelersCount || 2);
  const [travelDate, setTravelDate] = useState(
    initialQuotation?.travelDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // Pricing calculations
  const wholesale = calculateB2BWholesale(packageData.pricePerPerson, travelersCount, activeAgency.tier);
  const [quotedRetailPrice, setQuotedRetailPrice] = useState<number>(
    initialQuotation?.retailQuotedPrice || wholesale.totalRetailPrice
  );
  const [customNotes, setCustomNotes] = useState(
    initialQuotation?.customNotes || 'Includes dedicated local airport pickup and certified native Khasi/Assam guide.'
  );

  const agencyProfit = Math.max(0, quotedRetailPrice - wholesale.totalWholesaleNetCost);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('preview');
  const [copiedLink, setCopiedLink] = useState(false);

  const voucherCode = initialQuotation?.quotationCode || `JT-2026-${packageData.region.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const currentQuote: B2BQuotation = {
    id: initialQuotation?.id || `qt-${Date.now()}`,
    quotationCode: voucherCode,
    agencyId: activeAgency.id,
    agencyName: activeAgency.agencyName,
    agencyContact: activeAgency.phone,
    agencyEmail: activeAgency.email,
    agencyLicense: activeAgency.tourismLicenseNo,
    packageId: packageData.id,
    packageTitle: packageData.title,
    packageLocation: packageData.location,
    duration: packageData.duration,
    clientName: clientName || 'Valued Client',
    clientPhone: clientPhone || activeAgency.phone,
    clientEmail: clientEmail || activeAgency.email,
    travelDate,
    travelersCount,
    wholesaleNetPayable: wholesale.totalWholesaleNetCost,
    retailQuotedPrice: quotedRetailPrice,
    agencyMarkupAmount: agencyProfit,
    inclusions: packageData.inclusions,
    exclusions: packageData.exclusions,
    dayPlan: packageData.itinerary,
    createdAt: initialQuotation?.createdAt || new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    customNotes,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*Custom Tour Quotation & Itinerary | ${activeAgency.agencyName}*\n\n` +
      `Dear ${clientName || 'Traveler'},\n` +
      `Thank you for reaching out to ${activeAgency.agencyName}. Here is your tailored itinerary for *${packageData.title}*:\n\n` +
      `📅 *Travel Date:* ${travelDate}\n` +
      `👥 *Travelers:* ${travelersCount} Guests\n` +
      `📍 *Location:* ${packageData.location} (${packageData.duration})\n` +
      `💰 *Total Package Value:* ${formatINR(quotedRetailPrice)}\n` +
      `🔖 *Master Ref:* ${voucherCode}\n` +
      `🌿 *Certified Partner of:* Jatingaa Tours Platform\n\n` +
      `✅ *Key Inclusions:*\n` +
      packageData.inclusions.slice(0, 3).map(inc => `• ${inc}`).join('\n') +
      `\n\nFor questions, call/WhatsApp us directly at: ${activeAgency.phone}\n` +
      `License / GST: ${activeAgency.tourismLicenseNo}`;

    const url = `https://wa.me/${clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyVoucherText = () => {
    const summary = `${activeAgency.agencyName} - Tour Quotation ${voucherCode} for ${clientName || 'Client'}: ${formatINR(quotedRetailPrice)} (${packageData.title})`;
    navigator.clipboard?.writeText(summary);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSave = () => {
    if (onSaveQuotation) {
      onSaveQuotation(currentQuote);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-5 py-3.5 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">
                B2B Custom Quotation & Itinerary Generator
              </div>
              <h2 className="text-sm sm:text-base font-bold font-display">
                {activeAgency.agencyName} (Ref: {voucherCode})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeView === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Voucher Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveView('editor')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeView === 'editor' ? 'bg-white text-stone-900 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                Customize Client & Pricing
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Send to Client WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Editor Form if activeView is editor */}
          {activeView === 'editor' && (
            <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-4 print:hidden animate-in fade-in">
              <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Customize Client Info & Agency Selling Price (RSP)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Client Full Name:
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Roy"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Client Phone / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98300 12345"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Client Email (Optional):
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Travel Date:
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Travelers:
                  </label>
                  <select
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Quoted Selling Price (Total):
                  </label>
                  <input
                    type="number"
                    value={quotedRetailPrice}
                    onChange={(e) => setQuotedRetailPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-semibold text-stone-900"
                  />
                </div>
              </div>

              {/* Live Commercial Profit Breakdown */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-emerald-900">Your B2B Wholesale Net Cost ({activeAgency.tier} Tier):</span>{' '}
                  <strong className="text-stone-900 font-mono">{formatINR(wholesale.totalWholesaleNetCost)}</strong>
                </div>
                <div>
                  <span className="font-semibold text-emerald-900">Your Retained Margin:</span>{' '}
                  <strong className="text-[#0b4619] font-bold font-mono">+{formatINR(agencyProfit)}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSave();
                    setActiveView('preview');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#0b4619] text-white text-xs font-semibold hover:bg-[#073011] transition-colors cursor-pointer"
                >
                  Apply & View Voucher
                </button>
              </div>
            </div>
          )}

          {/* PRINTABLE BRANDED VOUCHER DOCUMENT */}
          <div
            id="printable-b2b-voucher"
            className="p-6 sm:p-8 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-6 text-stone-800 print:border-none print:shadow-none print:p-2"
          >
            {/* Header: Partner Agency Branding + Jatingaa Tours Platform Endorsement */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-stone-800 gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3 text-emerald-700" />
                  <span>Verified B2B Tourism Operator • {activeAgency.tier} Tier</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-950">
                  {activeAgency.agencyName}
                </h1>
                <p className="text-xs text-stone-600 font-medium">
                  {activeAgency.tradeName} • {activeAgency.city}, {activeAgency.state}
                </p>
                <div className="text-[11px] text-stone-500 font-mono flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
                  <span>Lic / GSTIN: <strong className="text-stone-800">{activeAgency.tourismLicenseNo}</strong></span>
                  <span>Contact: <strong className="text-stone-800">{activeAgency.phone}</strong></span>
                  <span>Email: <strong className="text-stone-800">{activeAgency.email}</strong></span>
                </div>
              </div>

              {/* Master Platform Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto p-3 bg-stone-50 rounded-xl border border-stone-200 text-right">
                <div className="flex items-center gap-2">
                  <img
                    src={jatingaaLogo}
                    alt="Jatingaa Tours Logo"
                    className="w-9 h-9 rounded-lg object-cover border border-stone-300"
                  />
                  <div className="text-left">
                    <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Platform Network</div>
                    <div className="text-xs font-bold text-[#0b4619]">Jatingaa Tours Pvt Ltd</div>
                  </div>
                </div>
                <div className="text-[11px] text-stone-600 font-mono pt-1">
                  Master Ref: <strong className="text-emerald-800 font-bold">{voucherCode}</strong>
                </div>
              </div>
            </div>

            {/* Client & Booking Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 font-medium uppercase block">Prepared For Guest</span>
                <strong className="text-stone-900 text-sm">{clientName || 'Valued Traveler'}</strong>
                <div className="text-stone-500 text-[11px]">{clientPhone || 'Direct Inquiry'}</div>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-medium uppercase block">Travel Date</span>
                <strong className="text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  {travelDate}
                </strong>
                <div className="text-stone-500 text-[11px]">Guaranteed Slot</div>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-medium uppercase block">Party Size</span>
                <strong className="text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  {travelersCount} Traveler{travelersCount > 1 ? 's' : ''}
                </strong>
                <div className="text-stone-500 text-[11px]">{packageData.groupType}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-500 font-medium uppercase block">Quoted Package Total</span>
                <strong className="text-base font-bold text-[#0b4619] block font-mono">
                  {formatINR(quotedRetailPrice)}
                </strong>
                <div className="text-[10px] text-emerald-800 font-medium">All Taxes & Permits Included</div>
              </div>
            </div>

            {/* Tour Title & Destination */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>{packageData.location} • {packageData.duration} • Starting from {packageData.startingPoint}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-stone-950">
                {packageData.title}
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                {packageData.tagline}
              </p>
            </div>

            {/* Day by Day Plan */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Field Itinerary & Route Highlights</span>
              </h3>
              <div className="space-y-3">
                {packageData.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-3 text-xs">
                    <div className="w-14 shrink-0 font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-md py-1 text-center h-fit">
                      Day {day.day}
                    </div>
                    <div className="space-y-1 flex-1">
                      <strong className="text-stone-900 block">{day.title}</strong>
                      <p className="text-stone-600 text-[11px]">{day.description}</p>
                      <div className="text-[10px] text-stone-500 flex flex-wrap gap-1">
                        {day.highlights.map((h, i) => (
                          <span key={i} className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                            • {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2 text-xs">
                <strong className="text-emerald-950 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  What is Included in Your Quote:
                </strong>
                <ul className="space-y-1 text-[11px] text-stone-700">
                  {packageData.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-700">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <strong className="text-stone-900 font-bold flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-stone-500" />
                  Important Exclusions & Traveler Notes:
                </strong>
                <ul className="space-y-1 text-[11px] text-stone-600">
                  {packageData.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-stone-400">✗</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                  {customNotes && (
                    <li className="pt-1.5 border-t border-stone-200 text-emerald-900 font-medium">
                      Special Note: {customNotes}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Official Verification Seal & Support Contact */}
            <div className="p-4 rounded-xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authentic Local Operator Guarantee</span>
                </div>
                <p className="text-[11px] text-stone-300 max-w-lg">
                  This quotation is backed by verified ground hosts across Northeast India. Zero hidden markups, 100% direct village community benefit.
                </p>
              </div>
              <div className="text-right shrink-0 font-mono text-[11px]">
                <div className="text-stone-400">Bookings / Emergency Dispatch:</div>
                <div className="text-white font-bold">{activeAgency.phone}</div>
                <div className="text-emerald-400">www.jatingaatours.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden on print) */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVoucherText}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? 'Copied Summary!' : 'Copy Quote Details'}
            </button>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Wholesale Net Cost: <strong className="text-stone-900">{formatINR(wholesale.totalWholesaleNetCost)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onProceedToPayAdvance && (
              <button
                type="button"
                onClick={() => onProceedToPayAdvance(currentQuote)}
                className="px-4 py-2 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Book Slot via Razorpay ({formatINR(wholesale.advanceDepositRequired)})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Itinerary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
