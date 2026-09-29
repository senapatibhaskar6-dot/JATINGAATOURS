import React, { useState } from 'react';
import { TourPackage, B2BAgency, B2BHoldSlot } from '../types';
import { formatINR, calculateB2BWholesale } from '../utils/pricing';
import {
  X, Clock, ShieldCheck, AlertCircle, CheckCircle2,
  Calendar, Users, ArrowRight, Lock, Sparkles, Building2
} from 'lucide-react';

interface B2BHoldSlotModalProps {
  packageData: TourPackage;
  activeAgency: B2BAgency;
  onClose: () => void;
  onConfirmHold: (hold: B2BHoldSlot) => void;
  onPayHoldDepositWithRazorpay?: (hold: B2BHoldSlot) => void;
}

export const B2BHoldSlotModal: React.FC<B2BHoldSlotModalProps> = ({
  packageData,
  activeAgency,
  onClose,
  onConfirmHold,
  onPayHoldDepositWithRazorpay,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [slotsCount, setSlotsCount] = useState<number>(2);
  const [holdDurationHours, setHoldDurationHours] = useState<24 | 48>(24);
  const [clientNotes, setClientNotes] = useState('');
  const [payDepositNow, setPayDepositNow] = useState(false);

  // Wholesale calculation
  const wholesale = calculateB2BWholesale(packageData.pricePerPerson, slotsCount, activeAgency.tier);
  const depositAmount = Math.max(1000 * slotsCount, Math.round(wholesale.totalWholesaleNetCost * 0.10));

  // Simulated live batch inventory:
  // e.g. Max 8 pax per departure batch, 2 already booked, 2 currently held across partner network
  const maxBatchSeats = 8;
  const currentlyHeldByPartners = 2;
  const alreadyBooked = 2;
  const availableToHold = maxBatchSeats - currentlyHeldByPartners - alreadyBooked;

  const handleSubmitHold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientContact) {
      alert('Please enter your client name and contact phone number to block inventory slots.');
      return;
    }

    const expiresAt = new Date(Date.now() + holdDurationHours * 3600000).toISOString();
    const newHold: B2BHoldSlot = {
      id: `hold-${Date.now()}`,
      holdCode: `HOLD-2026-${packageData.region.toUpperCase().substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      packageId: packageData.id,
      packageTitle: packageData.title,
      packageLocation: packageData.location,
      packageRegion: packageData.region,
      agencyId: activeAgency.id,
      agencyName: activeAgency.agencyName,
      agentContact: activeAgency.phone,
      clientName,
      clientContact,
      travelDate,
      slotsHeld: slotsCount,
      heldAt: new Date().toISOString(),
      expiresAt,
      status: 'active',
      retailPricePerPerson: packageData.pricePerPerson,
      wholesaleRatePerPerson: wholesale.wholesaleNetRatePerPerson,
      totalWholesaleNetCost: wholesale.totalWholesaleNetCost,
      depositPaid: payDepositNow ? depositAmount : 0,
      notes: clientNotes,
    };

    if (payDepositNow && onPayHoldDepositWithRazorpay) {
      onPayHoldDepositWithRazorpay(newHold);
    } else {
      onConfirmHold(newHold);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">
                Real-Time Inventory Hold Engine
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Block Tour Slots for Client
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitHold} className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Tour & Agency Summary */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Selected Itinerary</span>
              <h3 className="text-sm font-bold text-stone-900">{packageData.title}</h3>
              <p className="text-stone-500">{packageData.location} • {packageData.duration}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold">Your B2B Tier</span>
              <div className="font-bold text-[#0b4619] text-sm">{activeAgency.tier} Partner ({activeAgency.wholesaleMarginPercent}% Margin)</div>
              <div className="text-[11px] text-stone-500">Credit Limit: {formatINR(activeAgency.creditLimit)}</div>
            </div>
          </div>

          {/* Live Batch Availability Indicator */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold">Live Anti-Double-Booking Protection:</strong>
              <p>
                Each local departure batch is strictly limited to <strong>{maxBatchSeats} seats</strong>. There are currently <strong>{availableToHold} seats available</strong> to block on this date ({currentlyHeldByPartners} seats temporarily held by partner agencies).
              </p>
            </div>
          </div>

          {/* Booking Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ananya Roy"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Client Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98300 48192"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Slots to Block (Max {availableToHold})
                </label>
                <select
                  value={slotsCount}
                  onChange={(e) => setSlotsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                >
                  {[1, 2, 3, 4, 5, 6].filter(n => n <= availableToHold).map((n) => (
                    <option key={n} value={n}>
                      {n} Slot{n > 1 ? 's' : ''} ({formatINR(wholesale.wholesaleNetRatePerPerson * n)} Net)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Hold Duration Window
                </label>
                <select
                  value={holdDurationHours}
                  onChange={(e) => setHoldDurationHours(Number(e.target.value) as 24 | 48)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                >
                  <option value={24}>24 Hours (Standard)</option>
                  <option value={48}>48 Hours (High Volume DMC)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Client Notes or Special Vehicle Requirement (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Client arriving on Indigo 6E 412 at 11:30 AM. Need double room at Cherrapunji homestay."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
              />
            </div>
          </div>

          {/* Pricing & Commercial Net Summary */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-stone-700">
              <span>Standard Retail Value (RSP) for {slotsCount} Pax:</span>
              <span className="font-semibold text-stone-900">{formatINR(wholesale.totalRetailPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-stone-700">
              <span>Your B2B Wholesale Net Cost ({activeAgency.wholesaleMarginPercent}% {activeAgency.tier} Margin):</span>
              <strong className="text-emerald-950 font-bold">{formatINR(wholesale.totalWholesaleNetCost)}</strong>
            </div>
            <div className="flex justify-between items-center text-[#0b4619] font-bold pt-1 border-t border-emerald-200">
              <span>Your Operator Retained Profit:</span>
              <span className="text-sm">+{formatINR(wholesale.agentTotalProfit)}</span>
            </div>
          </div>

          {/* Deposit Toggle */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <strong className="text-stone-900 block">Optional Razorpay Live Advance Deposit ({formatINR(depositAmount)})</strong>
              <p className="text-stone-500 text-[11px]">
                Paying a token deposit locks the slots indefinitely until final arrival balance settlement.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={payDepositNow}
                onChange={(e) => setPayDepositNow(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b4619]"></div>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-stone-500">
              Slot hold expires in <strong>{holdDurationHours} hours</strong> from confirmation if not confirmed.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0b4619] hover:bg-[#073011] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{payDepositNow ? `Lock Slots with Razorpay (${formatINR(depositAmount)})` : `Block ${slotsCount} Slots (${holdDurationHours}h Hold)`}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
