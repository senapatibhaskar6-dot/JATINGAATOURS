import React, { useState } from 'react';
import { BookingRecord, Agency } from '../types';
import { formatINR } from '../utils/pricing';
import { X, ShieldCheck, Phone, MessageSquare, Calendar, Users, ArrowUpRight, Banknote, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface AgencyDashboardModalProps {
  bookings: BookingRecord[];
  onClose: () => void;
  onSimulateNewBooking: () => void;
}

export const AgencyDashboardModal: React.FC<AgencyDashboardModalProps> = ({
  bookings,
  onClose,
  onSimulateNewBooking,
}) => {
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState<string>('all');

  const filteredBookings = selectedAgencyFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.agency.id === selectedAgencyFilter);

  // Compute stats
  const totalAdvancesCollected = filteredBookings.reduce((sum, b) => sum + b.calculation.agencyAdvanceFee, 0);
  const totalGrossValue = filteredBookings.reduce((sum, b) => sum + b.calculation.totalPackagePrice, 0);
  const totalArrivalDue = filteredBookings.reduce((sum, b) => sum + b.calculation.remainingBalanceDueOnArrival, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0b4619] flex items-center justify-center text-[#f39c12]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display">
                  Local Agency Operations & Verified Dispatch Portal
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-medium">
                  LIVE DISPATCH
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Instant ₹1,000 lock-in advance ledger and direct customer contact feed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Instant Lock-in Advances Received
              </div>
              <div className="text-2xl font-bold text-[#0b4619] font-mono tabular-nums mt-1">
                {formatINR(totalAdvancesCollected)}
              </div>
              <div className="text-[11px] text-emerald-800 mt-1">
                ₹1,000 upfront per verified booking (Credited)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Balance Due On Arrival (Direct to You)
              </div>
              <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                {formatINR(totalArrivalDue)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                100% collected directly from travelers upon arrival
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Verified Bookings Dispatched
              </div>
              <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                {filteredBookings.length}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                100% direct traveler phone & WhatsApp unlocked
              </div>
            </div>
          </div>

          {/* Agency Filter Bar & Simulation Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700">Filter by Operator:</span>
              <select
                value={selectedAgencyFilter}
                onChange={(e) => setSelectedAgencyFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-800 text-xs bg-white focus:outline-none"
              >
                <option value="all">All Verified Operators ({bookings.length})</option>
                <option value="ag-khasi-hills">Khasi Hills Eco-Adventures (Meghalaya)</option>
                <option value="ag-zanskar-nomad">Zanskar Nomad Guides (Ladakh)</option>
                <option value="ag-malabar-native">Malabar Native Explorers (Kerala)</option>
                <option value="ag-marwar-nomad">Marwar Desert Nomads (Rajasthan)</option>
              </select>
            </div>

            <button
              onClick={onSimulateNewBooking}
              className="px-3 py-1.5 text-xs font-semibold text-[#0b4619] bg-[#0b4619]/10 hover:bg-[#0b4619]/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Simulate Incoming Booking Demo</span>
            </button>
          </div>

          {/* Bookings Table / Card List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const cleanPhone = b.customerPhone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Namaste ${b.customerName}! This is ${b.agency.founder} from ${b.agency.name}. We have confirmed your booking ${b.bookingCode} for ${b.packageTitle} starting ${b.travelDate}. We're excited to host you!`
                )}`;

                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-stone-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0b4619] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {b.bookingCode}
                          </span>
                          <h4 className="text-sm font-bold text-stone-900 font-display">
                            {b.packageTitle}
                          </h4>
                        </div>
                        <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Trip Date: <strong>{b.travelDate}</strong></span>
                          <span aria-hidden="true">·</span>
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>{b.travelersCount} Traveler(s)</span>
                        </div>
                      </div>

                      {/* Operator Badge */}
                      <div className="text-right text-xs">
                        <span className="font-semibold text-stone-800">{b.agency.name}</span>
                        <div className="text-[11px] text-stone-400">Host: {b.agency.founder}</div>
                      </div>
                    </div>

                    {/* Customer Contact & Financial Ledger */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Left: Unlocked Customer Contacts */}
                      <div className="sm:col-span-7 space-y-1.5 text-xs">
                        <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                          Unlocked Customer Profile (Direct Communication)
                        </div>
                        <div className="text-sm font-semibold text-stone-900">
                          {b.customerName} <span className="text-stone-400 font-normal">from {b.customerCity}</span>
                        </div>
                        <div className="text-stone-600 flex flex-wrap items-center gap-3">
                          <span>{b.customerEmail}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-medium">{b.customerPhone}</span>
                        </div>
                        {b.specialRequests && (
                          <div className="p-2 rounded bg-stone-50 border border-stone-200 text-stone-600 text-[11px] italic">
                            &ldquo;{b.specialRequests}&rdquo;
                          </div>
                        )}

                        {/* Direct WhatsApp / Call buttons for the agency to reach customer */}
                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="px-2.5 py-1 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-[#0b4619]" />
                            <span>Call Traveler</span>
                          </a>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 text-white" />
                            <span>WhatsApp Traveler</span>
                          </a>
                        </div>
                      </div>

                      {/* Right: Payment Ledger */}
                      <div className="sm:col-span-5 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Package Listing Value:</span>
                          <span className="font-semibold text-stone-900 tabular-nums">
                            {formatINR(b.calculation.totalPackagePrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-800">
                          <span>Instant Agency Advance:</span>
                          <span className="font-bold tabular-nums">
                            +{formatINR(b.calculation.agencyAdvanceFee)} (Credited)
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-500 text-[11px]">
                          <span>5% Platform Fee:</span>
                          <span className="tabular-nums text-stone-600">
                            +{formatINR(b.calculation.platformCommission)} (Paid by traveler on top · 0% Agency Cut)
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                          <span>Collect Direct On Arrival:</span>
                          <span className="text-stone-900 tabular-nums font-mono">
                            {formatINR(b.calculation.remainingBalanceDueOnArrival)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-[#0b4619] pt-1 border-t border-dashed border-stone-200 text-[11px]">
                          <span>Your Total Payout (100% Retained):</span>
                          <span className="tabular-nums font-mono">
                            {formatINR(b.calculation.totalPackagePrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500">
              No verified bookings yet for this filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
