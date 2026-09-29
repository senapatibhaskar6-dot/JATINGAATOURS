import React, { useState, useEffect } from 'react';
import {
  TourPackage, B2BAgency, B2BHoldSlot, B2BQuotation, B2BLedgerEntry, B2BPartnerTier
} from '../types';
import { formatINR, calculateB2BWholesale, TIER_MARGIN_RATES } from '../utils/pricing';
import {
  X, Building2, ShieldCheck, Clock, FileText, Banknote,
  Users, CheckCircle2, AlertCircle, Share2, Printer, Plus,
  ArrowRight, ExternalLink, Calendar, MapPin, ChevronRight,
  TrendingUp, Award, RefreshCw, Smartphone, Key
} from 'lucide-react';
import jatingaaLogo from '../assets/images/jatingaa_tours_logo.png';

interface B2BOperatorHubModalProps {
  packages: TourPackage[];
  activeAgency: B2BAgency;
  allAgencies: B2BAgency[];
  holds: B2BHoldSlot[];
  quotations: B2BQuotation[];
  ledger: B2BLedgerEntry[];
  onClose: () => void;
  onSwitchAgency: (agency: B2BAgency) => void;
  onUpdateAgencyStatus: (agencyId: string, status: 'verified' | 'pending' | 'suspended', tier?: B2BPartnerTier) => void;
  onAddNewAgency: (agency: B2BAgency) => void;
  onOpenHoldModalForPackage: (pkg: TourPackage) => void;
  onOpenQuotationModalForPackage: (pkg: TourPackage) => void;
  onOpenBookingModalForPackage: (pkg: TourPackage, isB2B: boolean) => void;
  onReleaseHold: (holdId: string) => void;
  onConvertHoldToBooking: (hold: B2BHoldSlot) => void;
}

export const B2BOperatorHubModal: React.FC<B2BOperatorHubModalProps> = ({
  packages,
  activeAgency,
  allAgencies,
  holds,
  quotations,
  ledger,
  onClose,
  onSwitchAgency,
  onUpdateAgencyStatus,
  onAddNewAgency,
  onOpenHoldModalForPackage,
  onOpenQuotationModalForPackage,
  onOpenBookingModalForPackage,
  onReleaseHold,
  onConvertHoldToBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'holds' | 'quotes' | 'ledger' | 'admin'>('inventory');

  // New Agency Registration Form State
  const [isRegisteringAgency, setIsRegisteringAgency] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newTradeName, setNewTradeName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newDesignation, setNewDesignation] = useState('Director');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGstin, setNewGstin] = useState('');
  const [newPan, setNewPan] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newState, setNewState] = useState('Meghalaya');
  const [newCity, setNewCity] = useState('');
  const [newOperatorType, setNewOperatorType] = useState<'DMC' | 'Inbound Agency' | 'Travel Agent' | 'Cooperative Society' | 'Homestay Cluster'>('DMC');
  const [newTier, setNewTier] = useState<B2BPartnerTier>('Gold');

  // Live timer tick for active holds
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRemainingTime = (expiresAtIso: string) => {
    const diff = new Date(expiresAtIso).getTime() - now;
    if (diff <= 0) return { text: 'Expired', isExpired: true, hoursLeft: 0 };
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return {
      text: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      isExpired: false,
      hoursLeft: hours,
    };
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName || !newContactPerson || !newPhone || !newLicense) {
      alert('Please fill in required fields: Agency Name, Contact Person, Phone, and Tourism License / GST.');
      return;
    }

    const created: B2BAgency = {
      id: `b2b-ag-${Date.now()}`,
      agencyName: newAgencyName,
      tradeName: newTradeName || newAgencyName,
      contactPerson: newContactPerson,
      designation: newDesignation,
      email: newEmail || `${newAgencyName.toLowerCase().replace(/\s+/g, '')}@partner.in`,
      phone: newPhone,
      whatsapp: newPhone,
      gstin: newGstin || '18AAACK4910N1ZG',
      panNumber: newPan || 'AAACK4910N',
      tourismLicenseNo: newLicense,
      state: newState,
      city: newCity || 'Local Base',
      address: `${newCity || 'Base'}, ${newState}`,
      operatorType: newOperatorType,
      tier: newTier,
      wholesaleMarginPercent: TIER_MARGIN_RATES[newTier] || 18,
      status: 'pending', // Starts in pending for verification
      registeredAt: new Date().toISOString(),
      walletBalance: 0,
      creditLimit: 50000,
      activeHoldsCount: 0,
      totalWholesaleBookings: 0,
    };

    onAddNewAgency(created);
    setIsRegisteringAgency(false);
    alert(`Agency "${created.agencyName}" registered successfully! Admin can now approve it.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#0b4619] text-white flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-200 uppercase tracking-wider font-semibold">
                  B2B Tourism Operator Network
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activeAgency.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                    : activeAgency.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-200 border border-rose-400/30'
                }`}>
                  {activeAgency.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display flex items-center gap-2">
                <span>{activeAgency.agencyName}</span>
                <span className="text-xs font-normal text-amber-300">
                  ({activeAgency.tier} Partner • {activeAgency.wholesaleMarginPercent}% Margin)
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Agency Switcher & Close */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-white/70">Partner:</span>
              <select
                value={activeAgency.id}
                onChange={(e) => {
                  const found = allAgencies.find(a => a.id === e.target.value);
                  if (found) onSwitchAgency(found);
                }}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {allAgencies.map((a) => (
                  <option key={a.id} value={a.id} className="text-stone-900">
                    {a.agencyName} ({a.tier} - {a.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-stone-200 bg-stone-50 flex overflow-x-auto gap-1 text-xs font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-[#0b4619] text-[#0b4619] font-bold bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>Wholesale Inventory & Net Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('holds')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'holds'
                ? 'border-[#0b4619] text-[#0b4619] font-bold bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Inventory Holds & Timers ({holds.filter(h => h.status === 'active').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'border-[#0b4619] text-[#0b4619] font-bold bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Branded Quotations ({quotations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'border-[#0b4619] text-[#0b4619] font-bold bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-700" />
            <span>Financial Ledger & Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'border-[#0b4619] text-[#0b4619] font-bold bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Agency Verification & Network ({allAgencies.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: WHOLESALE INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <strong className="block font-bold text-sm text-[#0b4619]">
                    Active Commercial Agreement: {activeAgency.tier} Partner Tier ({activeAgency.wholesaleMarginPercent}% Net Margin)
                  </strong>
                  <p className="text-emerald-800 text-[11px]">
                    All net rates below are contractually guaranteed with verified local hosts and cooperative societies across Northeast India.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-stone-800">
                    Wallet: {formatINR(activeAgency.walletBalance)}
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-stone-800">
                    Credit Limit: {formatINR(activeAgency.creditLimit)}
                  </div>
                </div>
              </div>

              {/* Package Grid with Wholesale breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const wholesale = calculateB2BWholesale(pkg.pricePerPerson, 1, activeAgency.tier);
                  return (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
                    >
                      <div className="flex gap-3">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-24 h-24 rounded-lg object-cover shrink-0 border border-stone-200"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                            {pkg.region.toUpperCase()} • {pkg.duration}
                          </span>
                          <h4 className="text-sm font-bold text-stone-900 leading-tight">{pkg.title}</h4>
                          <p className="text-[11px] text-stone-500 line-clamp-2">{pkg.tagline}</p>
                          <div className="text-[10px] text-stone-400 font-mono">
                            Host: {pkg.agency.name} ({pkg.agency.baseCity})
                          </div>
                        </div>
                      </div>

                      {/* Pricing Table */}
                      <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 grid grid-cols-3 gap-2 text-xs text-center">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Retail Price (RSP)</span>
                          <strong className="text-stone-900 font-mono">{formatINR(wholesale.retailPricePerPerson)}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-800 font-semibold block">Wholesale Net Cost</span>
                          <strong className="text-[#0b4619] font-bold font-mono">{formatINR(wholesale.wholesaleNetRatePerPerson)}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block">Your Margin</span>
                          <strong className="text-emerald-700 font-bold font-mono">+{formatINR(wholesale.agentTotalProfit)}</strong>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
                        <button
                          onClick={() => onOpenHoldModalForPackage(pkg)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Hold Slots (24h/48h)</span>
                        </button>

                        <button
                          onClick={() => onOpenQuotationModalForPackage(pkg)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-stone-600" />
                          <span>Branded Quote</span>
                        </button>

                        <button
                          onClick={() => onOpenBookingModalForPackage(pkg, true)}
                          className="px-3.5 py-1.5 bg-[#0b4619] hover:bg-[#073011] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Book Net Rate</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY HOLDS & REAL-TIME TIMERS */}
          {activeTab === 'holds' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Active Inventory Holds & Seat Reservations</h3>
                  <p className="text-xs text-stone-500">
                    Held inventory is protected across the entire partner network to prevent double-booking.
                  </p>
                </div>
              </div>

              {holds.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl space-y-2 text-stone-500 text-xs">
                  <Clock className="w-8 h-8 mx-auto text-stone-400" />
                  <p>No active inventory holds currently. You can hold slots directly from the Wholesale Inventory tab.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {holds.map((h) => {
                    const timer = formatRemainingTime(h.expiresAt);
                    return (
                      <div
                        key={h.id}
                        className={`p-4 rounded-xl border transition-all ${
                          timer.isExpired
                            ? 'bg-stone-50 border-stone-200 opacity-60'
                            : timer.hoursLeft < 4
                            ? 'bg-rose-50/60 border-rose-200'
                            : 'bg-white border-stone-200 shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-stone-900">{h.holdCode}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                timer.isExpired
                                  ? 'bg-stone-200 text-stone-700'
                                  : h.status === 'converted'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {timer.isExpired ? 'Hold Expired' : h.status}
                              </span>
                              <span className="text-[11px] text-stone-500 font-medium">
                                Travel: <strong>{h.travelDate}</strong> • {h.slotsHeld} Slots Held
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-stone-900">{h.packageTitle}</h4>
                            <p className="text-xs text-stone-600">
                              Client: <strong className="text-stone-900">{h.clientName}</strong> ({h.clientContact})
                              {h.notes && <span className="text-stone-400"> — {h.notes}</span>}
                            </p>
                          </div>

                          {/* Countdown Timer Display */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Hold Countdown</span>
                              <div className={`font-mono text-sm sm:text-base font-bold flex items-center gap-1 ${
                                timer.isExpired ? 'text-stone-400' : timer.hoursLeft < 4 ? 'text-rose-600 animate-pulse' : 'text-emerald-800'
                              }`}>
                                <Clock className="w-4 h-4" />
                                <span>{timer.text}</span>
                              </div>
                              <span className="text-[10px] text-stone-400">Net: {formatINR(h.totalWholesaleNetCost)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {!timer.isExpired && h.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => onConvertHoldToBooking(h)}
                                    className="px-3 py-2 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                                    title="Pay Advance via Razorpay Live to convert to confirmed voucher"
                                  >
                                    <span>Confirm via Razorpay</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                                  </button>
                                  <button
                                    onClick={() => onReleaseHold(h.id)}
                                    className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                    title="Release held slots back into inventory"
                                  >
                                    Release
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BRANDED QUOTATIONS */}
          {activeTab === 'quotes' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Custom Branded Client Quotations & Itineraries</h3>
                  <p className="text-xs text-stone-500">
                    PDF and printable itineraries featuring your agency&apos;s trade name, logo, contact, and license.
                  </p>
                </div>
              </div>

              {quotations.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl space-y-2 text-stone-500 text-xs">
                  <FileText className="w-8 h-8 mx-auto text-stone-400" />
                  <p>No quotations generated yet. Select any package from the Wholesale Inventory tab to generate a branded quote.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotations.map((q) => {
                    const associatedPkg = packages.find(p => p.id === q.packageId) || packages[0];
                    return (
                      <div key={q.id} className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 shadow-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-emerald-800">{q.quotationCode}</span>
                            <h4 className="text-sm font-bold text-stone-900">{q.packageTitle}</h4>
                            <p className="text-xs text-stone-500">
                              Client: <strong className="text-stone-800">{q.clientName}</strong> ({q.travelersCount} Pax • {q.travelDate})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-stone-500 uppercase block">Quoted Price</span>
                            <span className="text-sm font-bold text-[#0b4619] font-mono">{formatINR(q.retailQuotedPrice)}</span>
                            <span className="text-[10px] text-emerald-800 block">Margin: +{formatINR(q.agencyMarkupAmount)}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-stone-400 text-[11px]">Valid Until: {new Date(q.validUntil).toLocaleDateString()}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenQuotationModalForPackage(associatedPkg)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5 text-stone-600" />
                              <span>View / Print PDF</span>
                            </button>
                            <button
                              onClick={() => {
                                const text = `*Custom Tour Quotation | ${activeAgency.agencyName}*\n\n` +
                                  `Dear ${q.clientName},\n` +
                                  `Your tailored itinerary for *${q.packageTitle}* is ready:\n` +
                                  `📅 Date: ${q.travelDate} (${q.travelersCount} Guests)\n` +
                                  `💰 Quoted Value: ${formatINR(q.retailQuotedPrice)}\n` +
                                  `🔖 Ref: ${q.quotationCode}\n\n` +
                                  `Contact us: ${activeAgency.phone}`;
                                window.open(`https://wa.me/${q.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                              }}
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FINANCIAL LEDGER & WALLET */}
          {activeTab === 'ledger' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Prepaid Balance</span>
                  <div className="text-xl font-bold font-mono text-stone-900 mt-0.5">{formatINR(activeAgency.walletBalance)}</div>
                  <span className="text-[10px] text-stone-500">Auto-deducted for instant slot lock-ins</span>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Credit Facility Limit</span>
                  <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">{formatINR(activeAgency.creditLimit)}</div>
                  <span className="text-[10px] text-emerald-800">48-Hour hold authorization active</span>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Total Wholesale Volume</span>
                  <div className="text-xl font-bold font-mono text-[#0b4619] mt-0.5">{activeAgency.totalWholesaleBookings} Bookings</div>
                  <span className="text-[10px] text-stone-500">Tier: {activeAgency.tier} ({activeAgency.wholesaleMarginPercent}% Margin)</span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 font-bold text-xs text-stone-800">
                  Transaction Audit Trail (Razorpay Live & Ledger Settlements)
                </div>
                <div className="divide-y divide-stone-200 text-xs">
                  {ledger.map((entry) => (
                    <div key={entry.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-500 text-[11px]">{new Date(entry.timestamp).toLocaleDateString()}</span>
                          <span className="font-bold text-stone-900">{entry.description}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          Ref: {entry.referenceId} {entry.razorpayPaymentId && `• Razorpay ID: ${entry.razorpayPaymentId}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm ${entry.direction === 'credit' ? 'text-emerald-700' : 'text-stone-900'}`}>
                          {entry.direction === 'credit' ? '+' : '-'}{formatINR(entry.amount)}
                        </span>
                        <div className="text-[10px] text-stone-400">Bal: {formatINR(entry.balanceAfter)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AGENCY VERIFICATION & NETWORK MANAGEMENT */}
          {activeTab === 'admin' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">B2B Partner Verification & KYC Oversight</h3>
                  <p className="text-xs text-stone-500">
                    Approve, review, or suspend travel operators before granting wholesale net rates and slot-holding privileges.
                  </p>
                </div>
                <button
                  onClick={() => setIsRegisteringAgency(!isRegisteringAgency)}
                  className="px-3.5 py-2 bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Onboard New Partner Agency</span>
                </button>
              </div>

              {/* Onboarding Form if toggled */}
              {isRegisteringAgency && (
                <form onSubmit={handleRegisterSubmit} className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50 space-y-4">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Register Partner Agency</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Legal Agency Name *</label>
                      <input
                        type="text"
                        required
                        value={newAgencyName}
                        onChange={(e) => setNewAgencyName(e.target.value)}
                        placeholder="e.g. Kaziranga Eco Safari Society"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Trade / Brand Name</label>
                      <input
                        type="text"
                        value={newTradeName}
                        onChange={(e) => setNewTradeName(e.target.value)}
                        placeholder="e.g. Wild Kaziranga Trails"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={newContactPerson}
                        onChange={(e) => setNewContactPerson(e.target.value)}
                        placeholder="e.g. Bhaskar Senapati"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">State Tourism License / GSTIN *</label>
                      <input
                        type="text"
                        required
                        value={newLicense}
                        onChange={(e) => setNewLicense(e.target.value)}
                        placeholder="ATDC-REG-2024-912"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+91 94350 12345"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">State / Base City</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Guwahati, Assam"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Partner Commercial Tier</label>
                      <select
                        value={newTier}
                        onChange={(e) => setNewTier(e.target.value as B2BPartnerTier)}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="Silver">Silver (12% Margin)</option>
                        <option value="Gold">Gold (18% Margin)</option>
                        <option value="Platinum">Platinum (22% Margin)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisteringAgency(false)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#0b4619] text-white text-xs font-semibold"
                    >
                      Register Agency
                    </button>
                  </div>
                </form>
              )}

              {/* Agencies List with Admin Verification Controls */}
              <div className="space-y-3">
                {allAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">{agency.agencyName}</h4>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                          agency.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-900'
                            : agency.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {agency.status}
                        </span>
                        <span className="text-[11px] font-bold text-[#0b4619] bg-emerald-50 px-2 py-0.2 rounded">
                          {agency.tier} Tier ({agency.wholesaleMarginPercent}%)
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        {agency.tradeName} • Contact: <strong className="text-stone-800">{agency.contactPerson}</strong> ({agency.designation}) • Phone: {agency.phone}
                      </p>
                      <div className="text-[11px] text-stone-500 font-mono">
                        License / GSTIN: <strong className="text-stone-800">{agency.tourismLicenseNo}</strong> • Base: {agency.city}, {agency.state}
                      </div>
                    </div>

                    {/* Admin Verification & Tier Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={agency.tier}
                        onChange={(e) => onUpdateAgencyStatus(agency.id, agency.status, e.target.value as B2BPartnerTier)}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold bg-white cursor-pointer"
                        title="Change commercial tier"
                      >
                        <option value="Silver">Silver (12%)</option>
                        <option value="Gold">Gold (18%)</option>
                        <option value="Platinum">Platinum (22%)</option>
                      </select>

                      {agency.status !== 'verified' ? (
                        <button
                          onClick={() => onUpdateAgencyStatus(agency.id, 'verified')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateAgencyStatus(agency.id, 'suspended')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Suspend Access
                        </button>
                      )}

                      <button
                        onClick={() => onSwitchAgency(agency)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          activeAgency.id === agency.id
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {activeAgency.id === agency.id ? 'Active Session' : 'Login As'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
