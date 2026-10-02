import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Menu, X, ReceiptText, CreditCard, Building2, Users, Lock, MessageCircle } from 'lucide-react';
import jatingaaLogo from '../assets/images/jatingaa_tours_logo.png';

interface HeaderProps {
  onOpenAgencyPortal: () => void;
  onOpenBookings: () => void;
  onOpenRegisterAgency: () => void;
  onOpenCodeGuidance?: () => void;
  onOpenPaymentSettings?: () => void;
  onOpenB2BHub?: () => void;
  isB2BMode?: boolean;
  onToggleB2BMode?: () => void;
  bookingsCount: number;
  agenciesCount?: number;
  onOpenAgenciesDirectory?: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onOpenAboutUs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAgencyPortal,
  onOpenBookings,
  onOpenRegisterAgency,
  onOpenCodeGuidance,
  onOpenPaymentSettings,
  onOpenB2BHub,
  isB2BMode = false,
  onToggleB2BMode,
  bookingsCount,
  agenciesCount = 0,
  onOpenAgenciesDirectory,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onOpenAboutUs,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Official Logo & Brand Name on the left */}
        <a
          href="#"
          className="flex items-center gap-3 text-stone-900 group shrink-0"
          aria-label="Jatingaa Tours Home"
        >
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl overflow-hidden bg-[#0b4619] shadow-sm border border-stone-200/80 transition-transform group-hover:scale-105 shrink-0 flex items-center justify-center">
            <img
              src={jatingaaLogo}
              alt="Jatingaa Tours Official Logo"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b4619] font-display leading-none">
              Jatingaa Tours
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-wider text-stone-500 uppercase font-semibold mt-1">
              Direct Local Tourism
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => scrollToSection('packages-section')}
            className="hover:text-[#0b4619] transition-colors cursor-pointer py-1"
          >
            Tour Packages
          </button>
          <button
            onClick={() => scrollToSection('travel-stories-section')}
            className="hover:text-[#0b4619] transition-colors cursor-pointer py-1 flex items-center gap-1"
          >
            <span>Stories & Guides</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
              UGC
            </span>
          </button>
          <button
            onClick={() => scrollToSection('financial-model')}
            className="hover:text-[#0b4619] transition-colors cursor-pointer py-1"
          >
            5% Pricing Model
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#0b4619] transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('agency-section')}
            className="hover:text-[#0b4619] transition-colors cursor-pointer py-1"
          >
            For Local Agencies
          </button>
          <button
            onClick={() => onOpenAboutUs ? onOpenAboutUs() : scrollToSection('about-us')}
            className="hover:text-[#0b4619] transition-colors cursor-pointer py-1 font-semibold text-[#0b4619]"
          >
            About Us
          </button>
          {isAdminLoggedIn && onOpenAgenciesDirectory && (
            <button
              onClick={onOpenAgenciesDirectory}
              className="hover:text-[#0b4619] transition-colors cursor-pointer flex items-center gap-1.5 py-1 text-emerald-800 font-semibold"
              title="Admin: View all registered agencies directory and verification status"
            >
              <span>Agencies</span>
              {agenciesCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold text-white bg-emerald-800 rounded-full">
                  {agenciesCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={onOpenBookings}
            className="hover:text-[#0b4619] transition-colors cursor-pointer flex items-center gap-1.5 py-1"
          >
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold text-white bg-[#0b4619] rounded-full">
                {bookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="hidden sm:flex items-center gap-2">
          {isAdminLoggedIn && onOpenAgenciesDirectory && (
            <button
              onClick={onOpenAgenciesDirectory}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Admin: View all registered tourism operators, licenses, and status"
            >
              <Users className="w-3.5 h-3.5 text-[#0b4619]" />
              <span>Agencies</span>
              {agenciesCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-[#0b4619] rounded-full">
                  {agenciesCount}
                </span>
              )}
            </button>
          )}

          {isAdminLoggedIn && onOpenPaymentSettings && (
            <button
              onClick={onOpenPaymentSettings}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/90 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Admin: Configure Razorpay Keys, UPI ID & Payment Gateway"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-700" />
              <span>Payment Gateway</span>
            </button>
          )}

          {isAdminLoggedIn && onOpenCodeGuidance && (
            <button
              onClick={onOpenCodeGuidance}
              className="px-2.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Admin: View System Architecture & Blueprint"
            >
              Dev Blueprint
            </button>
          )}

          {isAdminLoggedIn && onOpenB2BHub && (
            <button
              onClick={onOpenB2BHub}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs ${
                isB2BMode
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 border border-amber-500'
                  : 'bg-emerald-900 text-emerald-100 hover:bg-emerald-800 border border-emerald-700'
              }`}
              title="B2B Wholesale Operator Network, Slot Holds & Branded Quotes"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isB2BMode ? 'B2B Console' : 'B2B Partner Network'}</span>
            </button>
          )}

          <a
            href="https://wa.me/916913514367?text=Hello%20Jatingaa%20Tours%2C%20I%20would%20like%20to%20inquire%20about%20tours%20and%20partnerships."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            title="Chat with Official Jatingaa Tours WhatsApp (+91 6913514367)"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={onOpenAgencyPortal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-[#0b4619]" />
            <span>Agency Portal</span>
          </button>

          <button
            onClick={onOpenRegisterAgency}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-all hover:shadow cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-4 h-4 text-[#f39c12]" />
            <span>Register Agency</span>
          </button>

          {/* Admin Mode Badge & Login Trigger */}
          {isAdminLoggedIn ? (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold text-amber-300 bg-stone-900 hover:bg-stone-800 border border-amber-400/40 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Admin Security & Settings (Click to Manage/Lock)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Admin</span>
            </button>
          ) : (
            onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Admin Login (Site Owner Only)"
                aria-label="Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {bookingsCount > 0 && (
            <button
              onClick={onOpenBookings}
              className="p-2 text-[#0b4619] bg-[#0b4619]/10 rounded-lg flex items-center gap-1 text-xs font-semibold"
              title="My Bookings"
            >
              <ReceiptText className="w-4 h-4" />
              <span>{bookingsCount}</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-900 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium text-stone-700">
            <button
              onClick={() => scrollToSection('packages-section')}
              className="text-left py-2 px-2 hover:bg-stone-50 rounded"
            >
              Tour Packages
            </button>
            <button
              onClick={() => scrollToSection('financial-model')}
              className="text-left py-2 px-2 hover:bg-stone-50 rounded"
            >
              5% Commission & Fee Model
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 px-2 hover:bg-stone-50 rounded"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('agency-section')}
              className="text-left py-2 px-2 hover:bg-stone-50 rounded"
            >
              For Local Travel Agencies
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAboutUs) onOpenAboutUs();
                else scrollToSection('about-us');
              }}
              className="text-left py-2 px-2 hover:bg-stone-50 rounded font-semibold text-[#0b4619]"
            >
              About Us (Global & Local Mission)
            </button>
            {isAdminLoggedIn && onOpenAgenciesDirectory && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAgenciesDirectory();
                }}
                className="text-left py-2 px-2 hover:bg-stone-50 rounded flex items-center justify-between text-emerald-900 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0b4619]" />
                  <span>Agencies Directory (Admin)</span>
                </span>
                {agenciesCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-emerald-800 rounded-full">
                    {agenciesCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookings();
              }}
              className="text-left py-2 px-2 hover:bg-stone-50 rounded flex items-center justify-between"
            >
              <span>My Bookings</span>
              {bookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-[#0b4619] rounded-full">
                  {bookingsCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <a
              href="https://wa.me/916913514367?text=Hello%20Jatingaa%20Tours%2C%20I%20would%20like%20to%20inquire%20about%20tours%20and%20partnerships."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp (+91 6913514367)</span>
            </a>

            {isAdminLoggedIn && onOpenB2BHub && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenB2BHub();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg ${
                  isB2BMode
                    ? 'bg-amber-400 text-stone-950 border border-amber-500'
                    : 'bg-emerald-900 text-emerald-100 border border-emerald-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {isB2BMode ? 'Open B2B Operator Console' : 'Switch to B2B Partner Network'}
              </button>
            )}
            {isAdminLoggedIn && onOpenPaymentSettings && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPaymentSettings();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <CreditCard className="w-4 h-4 text-amber-700" />
                Payment Gateway & UPI Setup (Admin)
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAgencyPortal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4 text-[#0b4619]" />
              Agency Portal & Verified Dashboard
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegisterAgency();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-[#0b4619] rounded-lg"
            >
              <UserCheck className="w-4 h-4 text-[#f39c12]" />
              List Your Agency (Zero Listing Fee)
            </button>

            {onOpenAdminLogin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full mt-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-stone-500 hover:text-stone-900 border border-dashed border-stone-300 rounded-lg"
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span>{isAdminLoggedIn ? '👑 Admin Mode Active (Manage / Lock)' : 'Owner / Admin Login 🔒'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
