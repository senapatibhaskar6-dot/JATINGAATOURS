import React from 'react';
import { B2BAgency } from '../types';
import { Building2, Clock, FileText, ArrowRight, ShieldCheck, RefreshCw, Banknote, Users } from 'lucide-react';
import { formatINR } from '../utils/pricing';

interface B2BHeaderBannerProps {
  activeAgency: B2BAgency;
  isB2BMode: boolean;
  activeHoldsCount: number;
  totalAgenciesCount?: number;
  isAdminLoggedIn?: boolean;
  onToggleB2BMode: () => void;
  onOpenB2BHub: () => void;
  onOpenHolds: () => void;
  onOpenBankPayout?: () => void;
  onOpenAgenciesDirectory?: () => void;
}

export const B2BHeaderBanner: React.FC<B2BHeaderBannerProps> = ({
  activeAgency,
  isB2BMode,
  activeHoldsCount,
  totalAgenciesCount,
  isAdminLoggedIn = false,
  onToggleB2BMode,
  onOpenB2BHub,
  onOpenHolds,
  onOpenBankPayout,
  onOpenAgenciesDirectory,
}) => {
  // Hide B2B Operator & Bank Payout bar completely from general travelers/visitors. Only visible to Admin!
  if (!isAdminLoggedIn) {
    return null;
  }

  if (!isB2BMode) {
    return (
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-stone-300">
              Admin / Operator Network Mode
            </span>
          </div>
          <button
            onClick={onToggleB2BMode}
            className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 hover:text-white transition-colors cursor-pointer underline"
          >
            <span>Switch to B2B Tourism Operator Network (Wholesale Rates & Slot Blocking)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b4619] text-white text-xs py-2 px-4 border-b border-emerald-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-700/60 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
            <Building2 className="w-3 h-3" />
            <span>B2B Wholesale Operator Active</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-white font-bold">{activeAgency.agencyName}</span>
            <span className="text-emerald-400 hidden sm:inline">•</span>
            <span className="text-emerald-200 text-[11px] hidden sm:inline font-mono">
              Lic: {activeAgency.tourismLicenseNo}
            </span>
          </div>

          {isAdminLoggedIn && onOpenAgenciesDirectory && totalAgenciesCount !== undefined && (
            <button
              onClick={onOpenAgenciesDirectory}
              className="hidden md:flex items-center gap-1 text-[11px] bg-emerald-950/70 hover:bg-emerald-950 px-2 py-0.5 rounded text-emerald-200 hover:text-white border border-emerald-700/60 cursor-pointer transition-colors"
              title="Admin: Click to view all registered agencies and verification details"
            >
              <Users className="w-3 h-3 text-amber-300" />
              <span>{totalAgenciesCount} Registered Agencies</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeHoldsCount > 0 && (
            <button
              onClick={onOpenHolds}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-stone-950 font-bold rounded text-[11px] hover:bg-amber-300 transition-colors cursor-pointer shadow-xs"
              title="View live slot hold timers"
            >
              <Clock className="w-3 h-3" />
              <span>{activeHoldsCount} Active Hold{activeHoldsCount > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Bank & Payout A/C - Strictly Admin Only */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenBankPayout || onOpenB2BHub}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-amber-300 rounded text-[11px] font-bold transition-colors cursor-pointer border border-emerald-600 shadow-xs"
              title="Admin Only: Configure registered Bank Account, IFSC, & UPI for Instant Razorpay Transfers"
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Bank & Payout A/C</span>
            </button>
          )}

          <button
            onClick={onOpenB2BHub}
            className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer border border-white/20"
          >
            <span>Operator Console</span>
            <ArrowRight className="w-3 h-3 text-amber-300" />
          </button>

          <button
            onClick={onToggleB2BMode}
            className="text-[11px] text-emerald-200 hover:text-white underline cursor-pointer pl-2 border-l border-emerald-700"
          >
            Exit to Retail (B2C)
          </button>
        </div>
      </div>
    </div>
  );
};
