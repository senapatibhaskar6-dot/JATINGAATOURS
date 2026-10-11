import React, { useState, useMemo } from 'react';
import {
  X,
  Compass,
  Building2,
  ReceiptText,
  Download,
  ShieldCheck,
  CreditCard,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  FileText,
  BadgeCheck,
  TrendingUp,
  Landmark,
  Sparkles,
} from 'lucide-react';
import { BookingRecord, B2BAgency, Agency } from '../types';
import { GuideProfile, getPlatformGuides } from '../data/guidesData';
import { formatINR } from '../utils/pricing';
import { generateMonthlyReportPdf } from '../utils/reportPdfGenerator';

interface AdminDashboardModalProps {
  onClose: () => void;
  bookings: BookingRecord[];
  agencies: (B2BAgency | Agency)[];
  onOpenPaymentSettings?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  onClose,
  bookings,
  agencies,
  onOpenPaymentSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guides' | 'agencies' | 'bookings'>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [guideSearch, setGuideSearch] = useState<string>('');
  const [guideRegionFilter, setGuideRegionFilter] = useState<string>('all');
  const [agencySearch, setAgencySearch] = useState<string>('');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const guides = useMemo(() => getPlatformGuides(), []);

  // Filter bookings by selected month
  const filteredBookings = useMemo(() => {
    if (selectedMonth === 'all') return bookings;
    return bookings.filter((b) => {
      const date = new Date(b.bookingTimestamp || b.travelDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthYear === selectedMonth;
    });
  }, [bookings, selectedMonth]);

  // Financial calculations for the selected period
  const periodStats = useMemo(() => {
    let totalPackageGMV = 0;
    let totalPlatformCommission = 0;
    let totalAgencyAdvances = 0;
    let totalTravelerSpend = 0;

    filteredBookings.forEach((b) => {
      const pkgVal = b.calculation?.totalPackagePrice || 10000;
      const comm = b.calculation?.platformCommission || Math.round(pkgVal * 0.05);
      const adv = b.calculation?.agencyAdvanceFee || 1000;

      totalPackageGMV += pkgVal;
      totalPlatformCommission += comm;
      totalAgencyAdvances += adv;
      totalTravelerSpend += b.calculation?.travelerTotalAmount || (pkgVal + comm);
    });

    return {
      totalPackageGMV,
      totalPlatformCommission,
      totalAgencyAdvances,
      totalTravelerSpend,
      bookingsCount: filteredBookings.length,
    };
  }, [filteredBookings]);

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(guideSearch.toLowerCase()) ||
        g.specialty.toLowerCase().includes(guideSearch.toLowerCase()) ||
        g.region.toLowerCase().includes(guideSearch.toLowerCase()) ||
        g.licenseNo.toLowerCase().includes(guideSearch.toLowerCase());

      const matchesRegion =
        guideRegionFilter === 'all' ||
        g.state.toLowerCase() === guideRegionFilter.toLowerCase();

      return matchesSearch && matchesRegion;
    });
  }, [guides, guideSearch, guideRegionFilter]);

  // Filtered Agencies
  const filteredAgencies = useMemo(() => {
    return agencies.filter((a) => {
      const name = (a as any).agencyName || (a as any).name || '';
      const state = a.state || '';
      const founder = (a as any).founder || (a as any).contactPerson || '';
      return (
        name.toLowerCase().includes(agencySearch.toLowerCase()) ||
        state.toLowerCase().includes(agencySearch.toLowerCase()) ||
        founder.toLowerCase().includes(agencySearch.toLowerCase())
      );
    });
  }, [agencies, agencySearch]);

  // Export PDF Handler
  const handleDownloadPdf = () => {
    setIsExportingPdf(true);

    const monthLabel =
      selectedMonth === 'all'
        ? 'All-Time Cumulative'
        : new Date(selectedMonth + '-01').toLocaleString('en-US', { month: 'long', year: 'numeric' });

    setTimeout(() => {
      try {
        generateMonthlyReportPdf({
          monthName: monthLabel,
          year: new Date().getFullYear(),
          totalBookings: periodStats.bookingsCount,
          totalPackageVolume: periodStats.totalPackageGMV,
          totalPlatformCommission: periodStats.totalPlatformCommission,
          totalAgencyAdvances: periodStats.totalAgencyAdvances,
          totalTravelerSpend: periodStats.totalTravelerSpend,
          bookings: filteredBookings,
          totalGuidesCount: guides.length,
          totalAgenciesCount: agencies.length,
          guides,
          agencies,
        });
      } catch (err) {
        console.error('PDF generation error:', err);
      } finally {
        setIsExportingPdf(false);
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display tracking-tight">
                  Jatingaa Tours Admin Operations Panel
                </h2>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold border border-emerald-700">
                  Cashfree Live
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                Direct Local Tourism Oversight: Guides, Agencies, Monthly Revenue & PDF Audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Download Monthly Audit Report in PDF format"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Monthly Overview & Financials</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guides'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Native Guides ({guides.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('agencies')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'agencies'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agencies ({agencies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-[#0b4619] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ReceiptText className="w-3.5 h-3.5 text-sky-600" />
              <span>Bookings ({bookings.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-stone-950 bg-amber-400 rounded-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            {onOpenPaymentSettings && (
              <button
                onClick={onOpenPaymentSettings}
                className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-[#0b4619] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <CreditCard className="w-3 h-3 text-amber-600" />
                <span>Cashfree Gateway Settings</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* KPI 1: Guides Count */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium">Total Native Guides</span>
                <Compass className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-stone-900 font-display">
                {guides.length}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                100% Certified Field Naturalists
              </div>
            </div>

            {/* KPI 2: Agencies Count */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium">Registered Agencies</span>
                <Building2 className="w-4 h-4 text-[#0b4619]" />
              </div>
              <div className="text-2xl font-bold text-stone-900 font-display">
                {agencies.length}
              </div>
              <div className="text-[11px] text-stone-500">
                Local Inbound DMCs & Collectives
              </div>
            </div>

            {/* KPI 3: Period Bookings */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium">Customer Bookings</span>
                <ReceiptText className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-stone-900 font-display">
                {periodStats.bookingsCount}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Cashfree PG Order Settled
              </div>
            </div>

            {/* KPI 4: 5% Platform Revenue */}
            <div className="p-4 rounded-xl bg-emerald-900 text-white shadow-2xs space-y-1 border border-emerald-800">
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span className="font-medium">5% Platform Earnings</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-2xl font-bold text-amber-300 font-display tabular-nums">
                {formatINR(periodStats.totalPlatformCommission)}
              </div>
              <div className="text-[11px] text-emerald-200">
                + ₹{periodStats.totalAgencyAdvances.toLocaleString('en-IN')} upfront agency payouts
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & MONTHLY FINANCIAL AUDIT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Filter & Actions Bar */}
              <div className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <span className="text-xs font-bold text-stone-700">Audit Period:</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white text-stone-900 cursor-pointer"
                  >
                    <option value="all">All-Time Cumulative</option>
                    <option value="2026-10">October 2026 (Current Month)</option>
                    <option value="2026-09">September 2026</option>
                    <option value="2026-08">August 2026</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isExportingPdf}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExportingPdf ? 'Exporting PDF...' : 'Download Executive Report (PDF)'}</span>
                  </button>
                </div>
              </div>

              {/* Financial Split Visual Card */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4">
                <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#0b4619]" />
                      <span>Monthly Revenue & Cashfree Payout Split</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Clear accounting: 5% platform commission kept on top, 100% full package value earned by local hosts.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500">Period GMV:</span>
                    <div className="text-base font-bold text-stone-900 tabular-nums">
                      {formatINR(periodStats.totalPackageGMV)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="text-emerald-800 font-semibold">1. Platform 5% Commission</div>
                    <div className="text-lg font-bold text-[#0b4619] tabular-nums">
                      {formatINR(periodStats.totalPlatformCommission)}
                    </div>
                    <p className="text-[11px] text-emerald-900">
                      Paid on top by travelers for escrow guarantee & support.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                    <div className="text-amber-800 font-semibold">2. Upfront Agency Advances</div>
                    <div className="text-lg font-bold text-amber-900 tabular-nums">
                      {formatINR(periodStats.totalAgencyAdvances)}
                    </div>
                    <p className="text-[11px] text-amber-900">
                      ₹1,000 per booking transferred upfront to local hosts.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 space-y-1">
                    <div className="text-sky-800 font-semibold">3. Cashfree Online Checkout Total</div>
                    <div className="text-lg font-bold text-sky-950 tabular-nums">
                      {formatINR(periodStats.totalPlatformCommission + periodStats.totalAgencyAdvances)}
                    </div>
                    <p className="text-[11px] text-sky-900">
                      Total collected securely via Cashfree Orders API.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings in Period */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-stone-900">
                    Bookings in This Period ({filteredBookings.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-[#0b4619] font-semibold hover:underline cursor-pointer"
                  >
                    View All Details →
                  </button>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-xs">
                    No bookings recorded for this period yet. New customer bookings will appear here instantly.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-3">Booking Code</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Tour Package</th>
                          <th className="py-2.5 px-3">Agency Host</th>
                          <th className="py-2.5 px-3">Advance (Cashfree)</th>
                          <th className="py-2.5 px-3">On-Arrival Due</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredBookings.slice(0, 6).map((b) => (
                          <tr key={b.id} className="hover:bg-stone-50/70">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#0b4619]">
                              {b.bookingCode || b.id}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-stone-900">
                              {b.customerName}
                              <div className="text-[10px] text-stone-500">{b.customerPhone}</div>
                            </td>
                            <td className="py-2.5 px-3 text-stone-700">
                              {b.packageTitle}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600">
                              {b.agency?.name || 'Local Host'}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-800 tabular-nums">
                              {formatINR(b.calculation?.totalAdvancePayable || 1500)}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600 tabular-nums">
                              {formatINR(b.calculation?.remainingBalanceDueOnArrival || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NATIVE GUIDES DIRECTORY */}
          {activeTab === 'guides' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search guides by name, region, license, or specialty..."
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-stone-400" />
                  <select
                    value={guideRegionFilter}
                    onChange={(e) => setGuideRegionFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white cursor-pointer"
                  >
                    <option value="all">All States & Regions</option>
                    <option value="Assam">Assam</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0b4619] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {guide.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-stone-900">{guide.name}</h4>
                            <BadgeCheck className="w-4 h-4 text-amber-500" />
                          </div>
                          <div className="text-[11px] font-mono text-stone-500">
                            Lic: {guide.licenseNo}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {guide.experienceYears} Years Exp
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-stone-500">Region:</span>{' '}
                        <strong className="text-stone-800">{guide.region} ({guide.state})</strong>
                      </div>
                      <div>
                        <span className="text-stone-500">Affiliation:</span>{' '}
                        <span className="text-stone-700">{guide.agencyAffiliation}</span>
                      </div>
                      <div>
                        <span className="text-stone-500">Specialty:</span>{' '}
                        <span className="text-stone-800 font-medium">{guide.specialty}</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Languages: {guide.languages.join(', ')} · Expeditions: {guide.totalExpeditions}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Phone className="w-3.5 h-3.5 text-[#0b4619]" />
                        <span>{guide.phone}</span>
                      </div>
                      <a
                        href={`https://wa.me/${guide.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0b4619] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <MessageCircle className="w-3 h-3 text-[#25D366]" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AGENCIES ROSTER */}
          {activeTab === 'agencies' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search agencies by name, state, or founder..."
                    value={agencySearch}
                    onChange={(e) => setAgencySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAgencies.map((agency: any, idx) => {
                  const name = agency.agencyName || agency.name;
                  const founder = agency.founder || agency.contactPerson;
                  const license = agency.tourismLicenseNo || agency.licenseNumber || agency.gstin;
                  const phone = agency.phone;
                  const email = agency.email;
                  const city = agency.city || agency.baseCity;
                  const state = agency.state;

                  return (
                    <div
                      key={agency.id || idx}
                      className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-[#0b4619]" />
                            <h4 className="text-sm font-bold text-stone-900">{name}</h4>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            Host: {founder} · {city}, {state}
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Verified Operator
                        </span>
                      </div>

                      <div className="text-xs space-y-1 pt-2 border-t border-stone-100 text-stone-600">
                        <div>
                          <span className="text-stone-500">License / Reg:</span>{' '}
                          <span className="font-mono text-stone-800">{license}</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Contact:</span>{' '}
                          <span>{phone} · {email}</span>
                        </div>
                        {agency.bankAccountNumber && (
                          <div className="text-[11px] text-stone-500">
                            Bank Account: {agency.bankAccountNumber.slice(-4).padStart(agency.bankAccountNumber.length, '•')} ({agency.bankName || 'Registered'})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: COMPLETE BOOKINGS LEDGER */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    All Customer Bookings Ledger ({filteredBookings.length} Total)
                  </h3>
                  <p className="text-stone-500 text-[11px]">
                    Detailed itemization of each transaction, Cashfree order ID, advance collected, and host balance.
                  </p>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="px-4 py-2 font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ledger (PDF)</span>
                </button>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
                  No bookings found in this period.
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                        <tr>
                          <th className="py-3 px-3">Date / Code</th>
                          <th className="py-3 px-3">Customer Details</th>
                          <th className="py-3 px-3">Tour Package</th>
                          <th className="py-3 px-3">Travel Date</th>
                          <th className="py-3 px-3">Cashfree Advance</th>
                          <th className="py-3 px-3">Host Arrival Balance</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-stone-50/70">
                            <td className="py-3 px-3">
                              <div className="font-mono font-bold text-[#0b4619]">{b.bookingCode || b.id}</div>
                              <div className="text-[10px] text-stone-400">
                                {new Date(b.bookingTimestamp || Date.now()).toLocaleDateString('en-IN')}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-stone-900">{b.customerName}</div>
                              <div className="text-[10px] text-stone-500">{b.customerPhone}</div>
                              <div className="text-[10px] text-stone-400">{b.customerEmail}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-stone-800">{b.packageTitle}</div>
                              <div className="text-[10px] text-stone-500">Agency: {b.agency?.name || 'Local Host'}</div>
                            </td>
                            <td className="py-3 px-3 text-stone-700">
                              {b.travelDate}
                              <div className="text-[10px] text-stone-500">{b.travelersCount} Travelers</div>
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-800 tabular-nums">
                              {formatINR(b.calculation?.totalAdvancePayable || 1500)}
                              <div className="text-[10px] text-emerald-600">5% Fee + ₹1k Lock-in</div>
                            </td>
                            <td className="py-3 px-3 text-stone-800 font-medium tabular-nums">
                              {formatINR(b.calculation?.remainingBalanceDueOnArrival || 0)}
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Confirmed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
