import React, { useState } from 'react';
import {
  X, Users, ShieldCheck, CheckCircle2, Clock, AlertTriangle,
  Search, Download, Phone, MessageSquare, Mail, MapPin,
  ExternalLink, Building2, UserCheck, Plus, Filter, Award, Database, RefreshCw
} from 'lucide-react';
import { B2BAgency, B2BPartnerTier } from '../types';

interface AgenciesDirectoryModalProps {
  agencies: B2BAgency[];
  activeAgencyId: string;
  onClose: () => void;
  onSwitchAgency: (agency: B2BAgency) => void;
  onUpdateAgencyStatus: (agencyId: string, status: 'verified' | 'pending' | 'suspended', tier?: B2BPartnerTier) => void;
  onOpenRegisterAgency: () => void;
  onOpenAgencyPortalFor: (agency: B2BAgency) => void;
  onRefreshFromSupabase?: () => void;
}

export const AgenciesDirectoryModal: React.FC<AgenciesDirectoryModalProps> = ({
  agencies,
  activeAgencyId,
  onClose,
  onSwitchAgency,
  onUpdateAgencyStatus,
  onOpenRegisterAgency,
  onOpenAgencyPortalFor,
  onRefreshFromSupabase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefreshFromSupabase) {
      setIsRefreshing(true);
      await onRefreshFromSupabase();
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Compute metrics
  const totalCount = agencies.length;
  const verifiedCount = agencies.filter(a => a.status === 'verified').length;
  const pendingCount = agencies.filter(a => a.status === 'pending').length;
  const suspendedCount = agencies.filter(a => a.status === 'suspended').length;

  // Extract distinct states
  const states = Array.from(new Set(agencies.map(a => a.state))).filter(Boolean);

  // Filter agencies
  const filteredAgencies = agencies.filter(agency => {
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    const matchesState = selectedState === 'all' || agency.state === selectedState;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      agency.agencyName.toLowerCase().includes(q) ||
      agency.contactPerson.toLowerCase().includes(q) ||
      agency.city.toLowerCase().includes(q) ||
      agency.state.toLowerCase().includes(q) ||
      agency.phone.includes(q) ||
      agency.email.toLowerCase().includes(q) ||
      agency.tourismLicenseNo.toLowerCase().includes(q) ||
      (agency.gstin && agency.gstin.toLowerCase().includes(q));

    return matchesStatus && matchesState && matchesQuery;
  });

  // Export CSV of all registered agencies
  const handleExportCSV = () => {
    const headers = [
      'Agency ID',
      'Agency Name',
      'Trade Name',
      'Contact Person',
      'Designation',
      'Phone',
      'WhatsApp',
      'Email',
      'City',
      'State',
      'Tourism License',
      'GSTIN / PAN',
      'Commission Model',
      'Status',
      'Bank Name',
      'Bank IFSC',
      'Bank A/C',
      'UPI ID',
      'Registered Date'
    ];

    const rows = agencies.map(a => [
      `"${a.id}"`,
      `"${a.agencyName.replace(/"/g, '""')}"`,
      `"${(a.tradeName || a.agencyName).replace(/"/g, '""')}"`,
      `"${a.contactPerson.replace(/"/g, '""')}"`,
      `"${a.designation || 'Director'}"`,
      `"${a.phone}"`,
      `"${a.whatsapp || a.phone}"`,
      `"${a.email}"`,
      `"${a.city}"`,
      `"${a.state}"`,
      `"${a.tourismLicenseNo}"`,
      `"${a.gstin || a.panNumber || 'N/A'}"`,
      `"5% Platform Commission"`,
      `"${a.status}"`,
      `"${(a.bankName || 'Not Set').replace(/"/g, '""')}"`,
      `"${a.bankIfsc || 'N/A'}"`,
      `"${a.bankAccountNumber ? '••••' + a.bankAccountNumber.slice(-4) : 'N/A'}"`,
      `"${a.upiId || 'N/A'}"`,
      `"${new Date(a.registeredAt).toLocaleDateString('en-IN')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jatingaa-registered-agencies-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  Registered Agencies & Operators Directory
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-mono">
                  {totalCount} Registered
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-[10px] font-mono">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Supabase Live</span>
                </span>
              </div>
              <p className="text-xs text-stone-300 hidden sm:block">
                Complete directory of all tourism operators, cooperatives, and DMCs registered on Jatingaa Tours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshFromSupabase && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-500/30 text-emerald-200 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Sync and fetch latest agencies directly from Supabase cloud database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-300' : 'text-emerald-300'}`} />
                <span className="hidden sm:inline">Sync Supabase</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Download Excel / CSV of all registered agencies"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close directory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="p-4 sm:p-6 bg-stone-50 border-b border-stone-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Total Agencies Registered
              </span>
              <div className="text-2xl font-bold text-stone-900 font-mono mt-0.5">
                {totalCount}
              </div>
              <span className="text-[11px] text-stone-400">All registered partners</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Verified & Active
              </span>
              <div className="text-2xl font-bold text-[#0b4619] font-mono mt-0.5">
                {verifiedCount}
              </div>
              <span className="text-[11px] text-emerald-700">Official license verified</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Pending Verification
              </span>
              <div className="text-2xl font-bold text-amber-900 font-mono mt-0.5">
                {pendingCount}
              </div>
              <span className="text-[11px] text-amber-700">Awaiting license check</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Add New Partner
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterAgency();
                }}
                className="mt-1 w-full py-1.5 px-3 bg-[#0b4619] hover:bg-[#062b0f] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>Register Agency</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by agency name, owner, city, phone, GSTIN, or license..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'verified', 'pending', 'suspended'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#0b4619] text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {st === 'all' ? `All (${totalCount})` : st === 'verified' ? `Verified (${verifiedCount})` : st === 'pending' ? `Pending (${pendingCount})` : `Suspended (${suspendedCount})`}
                </button>
              ))}

              {states.length > 0 && (
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 cursor-pointer"
                >
                  <option value="all">All States</option>
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Agencies Directory Cards List */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {filteredAgencies.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
              <Building2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-stone-700">No agencies match your search</h3>
              <p className="text-xs text-stone-500 mt-1">
                Try searching with a different agency name, state, phone, or license number.
              </p>
            </div>
          ) : (
            filteredAgencies.map((agency) => {
              const isCurrentSession = activeAgencyId === agency.id;
              const formattedDate = new Date(agency.registeredAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={agency.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCurrentSession
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-sm ring-1 ring-emerald-400/40'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Agency info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-stone-900 font-display">
                          {agency.agencyName}
                        </h3>
                        {agency.tradeName && agency.tradeName !== agency.agencyName && (
                          <span className="text-xs text-stone-500 font-normal">
                            (Trade: {agency.tradeName})
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          agency.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : agency.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}>
                          {agency.status === 'verified' ? '✓ Verified Partner' : agency.status === 'pending' ? '⏳ Pending Approval' : '✕ Suspended'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          5% Platform Commission
                        </span>
                        {isCurrentSession && (
                          <span className="px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px] font-bold">
                            Active Admin Session
                          </span>
                        )}
                      </div>

                      {/* Contact & Owner */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-semibold">Contact Person / Owner</span>
                          <strong className="text-stone-900">{agency.contactPerson}</strong> ({agency.designation || 'Director'})
                        </div>

                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-semibold">Phone & WhatsApp</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={`tel:${agency.phone}`}
                              className="text-stone-800 hover:text-[#0b4619] font-mono flex items-center gap-1 font-semibold"
                            >
                              <Phone className="w-3 h-3 text-emerald-700" />
                              <span>{agency.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${agency.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 text-[11px] font-semibold"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-semibold">Email & Base</span>
                          <div className="truncate">
                            <span className="text-stone-800 font-mono text-[11px]">{agency.email}</span>
                            <span className="block text-stone-500 text-[11px] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#f39c12]" />
                              <span>{agency.city}, {agency.state}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* License & Bank Account summary */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 font-mono">
                        <div>
                          Tourism License: <strong className="text-stone-800">{agency.tourismLicenseNo}</strong>
                        </div>
                        {agency.gstin && (
                          <div>
                            GSTIN: <strong className="text-stone-800">{agency.gstin}</strong>
                          </div>
                        )}
                        <div>
                          Registered: <strong className="text-stone-800">{formattedDate}</strong>
                        </div>
                        {agency.bankName && (
                          <div className="text-emerald-800">
                            Bank: <strong className="text-emerald-950">{agency.bankName}</strong> ({agency.bankIfsc || 'Verified'})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-200">
                      {/* Status toggle button */}
                      {agency.status !== 'verified' ? (
                        <button
                          onClick={() => onUpdateAgencyStatus(agency.id, 'verified')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Agency</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateAgencyStatus(agency.id, 'suspended')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}

                      {/* Open Agency Portal for this specific agency */}
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAgencyPortalFor(agency);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Open Vendor Portal to view packages & bookings for this agency"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0b4619]" />
                        <span>Agency Portal</span>
                      </button>

                      {/* Login / Active session */}
                      <button
                        onClick={() => onSwitchAgency(agency)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isCurrentSession
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {isCurrentSession ? '✓ Active Session' : 'Login / Switch'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0b4619] shrink-0" />
            <span>
              All agencies registered via the &quot;Register Agency&quot; form are stored here with their tourism department licenses.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="text-[#0b4619] hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Details (CSV)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
