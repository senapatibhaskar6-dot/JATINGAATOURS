import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string; // e.g. "6913514367"
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '6913514367',
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  // International format for wa.me
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const waNumber = cleanDigits.startsWith('91') ? cleanDigits : `91${cleanDigits}`;
  const defaultMessage = encodeURIComponent(
    'Hello Jatingaa Tours, I would like to inquire about tour bookings and agency onboarding.'
  );
  const waUrl = `https://wa.me/${waNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 print:hidden">
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-stone-200 shadow-xl text-xs text-stone-800 animate-bounce duration-1000">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-stone-900">Need Help? Chat on WhatsApp</span>
            <span className="text-[10px] text-stone-500">+91 {phoneNumber} (Official Support)</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ml-1 cursor-pointer"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        title="Chat with Official Jatingaa Tours on WhatsApp (+91 691351436)"
        aria-label="Chat with Official Jatingaa Tours on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white stroke-none group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
};
