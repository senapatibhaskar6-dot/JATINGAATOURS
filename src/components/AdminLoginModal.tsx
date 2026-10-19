import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, X, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { verifyAdminPin, setAdminPin, getAdminPin, resetAdminPinToDefault, DEFAULT_PIN } from '../utils/adminAuth';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginModalProps {
  isAdminLoggedIn: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isAdminLoggedIn,
  onClose,
  onLoginSuccess,
  onLogout,
}) => {
  const { language, t } = useLanguage();
  const isAssamese = language === 'as';

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [showForgotHelp, setShowForgotHelp] = useState(false);
  const [resetNotice, setResetNotice] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin)) {
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('Incorrect Admin PIN. Please enter the correct passcode.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setErrorMsg('New PIN must be at least 4 digits/characters.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg('New PIN and Confirm PIN do not match.');
      return;
    }
    setAdminPin(newPin);
    setPinSuccessMsg('Admin Passcode updated successfully! Remember your new PIN.');
    setIsChangingPin(false);
    setNewPin('');
    setConfirmPin('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Platform Admin Security
              </h2>
              <p className="text-xs text-stone-300">
                Restricted Owner & Administrator Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {isAdminLoggedIn ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0b4619] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <strong className="text-sm font-bold text-[#0b4619] block">
                    Admin Account is Currently Active
                  </strong>
                  <p className="text-emerald-800">
                    You have full access to:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-emerald-900 space-y-0.5 mt-1 font-medium">
                    <li>All Registered Agencies Directory & Verification</li>
                    <li>Payment Gateway & Cashfree Credentials</li>
                    <li>Operations Dashboard, Guides & PDF Audit Reports</li>
                    <li>Agency Bank Payouts & Settlement Accounts</li>
                    <li>Export Full Database to CSV/Excel</li>
                  </ul>
                </div>
              </div>

              {pinSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold">
                  ✓ {pinSuccessMsg}
                </div>
              )}

              {/* Change PIN toggle */}
              {!isChangingPin ? (
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-stone-600" />
                    <span>Change Admin Passcode / PIN</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Admin (Lock All Admin Controls)</span>
                  </button>
                </div>
              ) : (
                /* Change PIN Form */
                <form onSubmit={handleChangePin} className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-stone-800">Set New Admin Passcode</h4>
                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      New Passcode (min 4 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="e.g. 8842"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Confirm New Passcode
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Repeat passcode"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(false)}
                      className="w-1/2 py-2 text-xs font-semibold rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2 text-xs font-semibold rounded-xl bg-[#0b4619] text-white hover:bg-[#062b0f]"
                    >
                      Save Passcode
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-stone-600">
                  Enter your owner passcode to unlock Admin privileges. When locked, other agencies and visitors cannot view confidential details.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Admin Passcode / PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    autoFocus
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter Passcode..."
                    className="w-full pl-3 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0b4619]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0b4619] hover:bg-[#062b0f] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Unlock Admin Portal</span>
              </button>

              {/* Forgot Passcode / Password Recovery Section */}
              <div className="pt-2 border-t border-stone-100">
                {!showForgotHelp ? (
                  <button
                    type="button"
                    onClick={() => setShowForgotHelp(true)}
                    className="w-full text-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline py-1 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Forgot Passcode? (Password Recovery)</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-stone-900 space-y-2.5 text-xs animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <KeyRound className="w-4 h-4 text-[#0b4619]" />
                        <span>Admin Passcode Recovery</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotHelp(false)}
                        className="text-stone-400 hover:text-stone-700 text-[11px] font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      The built-in Master Recovery PIN is: <strong className="font-mono text-emerald-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-xs">2026</strong> (or <strong className="font-mono text-emerald-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-xs">admin2026</strong>). Even if you customized your passcode, this master PIN always works.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPin('2026');
                          setErrorMsg('');
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-800 text-white font-bold text-[11px] hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Fill Master PIN (2026)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          resetAdminPinToDefault();
                          setPin('2026');
                          setErrorMsg('');
                          setResetNotice('Passcode reset to 2026!');
                          setTimeout(() => setResetNotice(''), 3500);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-stone-300 text-stone-800 font-semibold text-[11px] hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        Reset Passcode to 2026
                      </button>
                    </div>

                    {resetNotice && (
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-bold text-center">
                        ✓ {resetNotice}
                      </div>
                    )}

                    <div className="text-[10px] text-stone-500 pt-1 border-t border-amber-200/80">
                      <span>Owner Email: <strong>senapatibhaskar6@gmail.com</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
