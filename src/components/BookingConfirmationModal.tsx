import React from 'react';
import { BookingRecord } from '../types';
import { formatINR } from '../utils/pricing';
import { CheckCircle2, Phone, MessageSquare, ShieldCheck, MapPin, Calendar, Users, Printer, Download, ArrowRight, X, ExternalLink } from 'lucide-react';

interface BookingConfirmationModalProps {
  booking: BookingRecord;
  onClose: () => void;
  onOpenAgencyPortal: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose,
  onOpenAgencyPortal,
}) => {
  const agency = booking.agency;

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = agency.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${agency.founder}! I just booked the "${booking.packageTitle}" tour via Jatingaa Tours (Booking Code: ${booking.bookingCode}) starting on ${booking.travelDate}. Looking forward to connecting!`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[#f39c12]">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-semibold">
                Payment Confirmed & Verified
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Direct Contact & Voucher Unlocked
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

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Booking Code Banner */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-emerald-900 font-medium">Official Jatingaa Booking Reference:</span>
              <div className="text-xl font-mono font-bold text-[#0b4619] tracking-wider">
                {booking.bookingCode}
              </div>
              <div className="text-[11px] text-emerald-800">
                Txn ID: {booking.paymentTransactionId} · Confirmed {new Date(booking.bookingTimestamp).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#0b4619]" />
                <span>Print Voucher</span>
              </button>
            </div>
          </div>

          {/* Unlocked Agency Direct Contact Box (Highlight Box) */}
          <div className="p-5 rounded-xl bg-[#0b4619]/5 border-2 border-[#0b4619] relative">
            <div className="absolute -top-3 left-4 bg-[#0b4619] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded">
              DIRECT AGENCY CONTACT UNLOCKED
            </div>

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-base font-bold text-stone-900 font-display">
                  <ShieldCheck className="w-5 h-5 text-[#0b4619]" />
                  <span>{agency.name}</span>
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  Host / Lead Guide: <strong>{agency.founder}</strong> · {agency.baseCity}, {agency.state}
                </div>
                <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Govt Reg / GSTIN: {agency.licenseNumber}
                </div>
              </div>

              {/* Direct Call & WhatsApp Buttons */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#0b4619]" />
                  <span>Call {agency.phone}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
            </div>

            <p className="mt-3 text-xs text-stone-600 leading-relaxed">
              Your contact details (<strong className="text-stone-900">{booking.customerName}</strong>, {booking.customerPhone}, {booking.customerEmail}) have been dispatched directly to {agency.founder}. You may call or message them directly anytime to coordinate airport pickup or customize your meal preferences.
            </p>
          </div>

          {/* Tour & Reservation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                Traveler & Trip Details
              </div>
              <div>
                <span className="text-stone-500">Package:</span>{' '}
                <strong className="text-stone-900">{booking.packageTitle}</strong>
              </div>
              <div>
                <span className="text-stone-500">Location:</span>{' '}
                <span className="text-stone-800">{booking.packageLocation}</span>
              </div>
              <div>
                <span className="text-stone-500">Scheduled Date:</span>{' '}
                <strong className="text-stone-900">{booking.travelDate}</strong>
              </div>
              <div>
                <span className="text-stone-500">Travelers Count:</span>{' '}
                <span className="text-stone-800 font-semibold">{booking.travelersCount} Guest(s)</span>
              </div>
              <div>
                <span className="text-stone-500">Lead Traveler:</span>{' '}
                <span className="text-stone-800">{booking.customerName} ({booking.customerCity})</span>
              </div>
            </div>

            {/* Financial Reconciliation Receipt */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                Financial Statement & Escrow Receipt
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Agency Package Value:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatINR(booking.calculation.totalPackagePrice)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>5% Platform Fee (Paid on Top by Traveler):</span>
                <span className="tabular-nums font-medium text-stone-700">
                  +{formatINR(booking.calculation.platformCommission)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Local Agency Upfront Lock-in Advance:</span>
                <span className="tabular-nums font-medium text-[#0b4619]">
                  {formatINR(booking.calculation.agencyAdvanceFee)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-bold text-stone-900">
                <span>Total Advance Paid Today:</span>
                <span className="text-sm text-[#0b4619] tabular-nums">
                  {formatINR(booking.calculation.totalAdvancePayable)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                <span>Balance to pay local host on arrival:</span>
                <span className="font-bold tabular-nums">
                  {formatINR(booking.calculation.remainingBalanceDueOnArrival)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-emerald-900 bg-emerald-50/70 p-2 rounded border border-emerald-200">
                <span>Agency Total Earnings (0% Deducted):</span>
                <span className="font-bold text-[#0b4619] tabular-nums">
                  {formatINR(booking.calculation.totalPackagePrice)} (100%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onOpenAgencyPortal}
            className="text-xs font-semibold text-[#0b4619] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View this in Agency Dispatch View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Done & Return to Tours
          </button>
        </div>
      </div>
    </div>
  );
};
