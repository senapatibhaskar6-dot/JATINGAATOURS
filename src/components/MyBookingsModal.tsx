import React from 'react';
import { BookingRecord } from '../types';
import { formatINR } from '../utils/pricing';
import { X, ReceiptText, Phone, MessageSquare, ShieldCheck, MapPin, Calendar, Users, Printer, ExternalLink } from 'lucide-react';

interface MyBookingsModalProps {
  bookings: BookingRecord[];
  onClose: () => void;
  onSelectBooking: (booking: BookingRecord) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onClose,
  onSelectBooking,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0b4619] flex items-center justify-center text-white">
              <ReceiptText className="w-4 h-4 text-[#f39c12]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                My Confirmed Bookings ({bookings.length})
              </h2>
              <div className="text-[11px] text-stone-500">
                Unlocked agency direct contacts & travel vouchers
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

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {bookings.length > 0 ? (
            bookings.map((b) => {
              const cleanPhone = b.agency.phone.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${cleanPhone}`;

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0b4619] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {b.bookingCode}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 font-display mt-1">
                        {b.packageTitle}
                      </h3>
                      <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{b.packageLocation}</span>
                        <span aria-hidden="true">·</span>
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Date: {b.travelDate}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-stone-500">Advance Paid:</div>
                      <div className="text-base font-bold text-[#0b4619] tabular-nums">
                        {formatINR(b.calculation.totalAdvancePayable)}
                      </div>
                      <div className="text-[11px] text-stone-400">5% fee on top + ₹1k advance</div>
                    </div>
                  </div>

                  {/* Unlocked Agency Info */}
                  <div className="p-3.5 rounded-lg bg-[#0b4619]/5 border border-[#0b4619]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <ShieldCheck className="w-4 h-4 text-[#0b4619]" />
                        <span>{b.agency.name} (Host: {b.agency.founder})</span>
                      </div>
                      <div className="text-[11px] text-stone-600 font-mono">
                        Lic: {b.agency.licenseNumber} · {b.agency.baseCity}, {b.agency.state}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded hover:bg-stone-50 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#0b4619]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => onSelectBooking(b)}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50"
                      >
                        Full Voucher
                      </button>
                    </div>
                  </div>

                  {/* Balance Note */}
                  <div className="flex justify-between items-center text-xs text-stone-600 pt-1">
                    <span>Balance payable directly to host on trip commencement:</span>
                    <strong className="text-stone-900 tabular-nums">
                      {formatINR(b.calculation.remainingBalanceDueOnArrival)}
                    </strong>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-stone-500">
              No confirmed bookings found. Browse packages to book your first local tour!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
