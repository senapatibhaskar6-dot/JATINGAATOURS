import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, QrCode, Key, CheckCircle2, HelpCircle, ExternalLink, Smartphone } from 'lucide-react';
import { getPaymentConfig, savePaymentConfig, PaymentConfig } from '../utils/paymentConfig';

interface PaymentGatewayModalProps {
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ onClose }) => {
  const [config, setConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b4619] text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <CreditCard className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-semibold">
                Admin & Platform Settings
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Cashfree Payment Gateway & UPI Settings
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

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0b4619] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Cashfree Payments Live Gateway:</span>
              <p>
                When travelers book a tour, they pay the 5% platform fee & ₹1,000 upfront booking advance via <strong>Cashfree (Google Pay, PhonePe, Paytm, BHIM UPI, Cards, NetBanking)</strong> or <strong>Direct UPI QR</strong>. Vercel environment variables <code>CASHFREE_KEY_ID</code> and <code>CASHFREE_KEY_SECRET</code> authenticate orders securely on the server.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Cashfree Section */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0b4619] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    CF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Cashfree Payments Gateway (Recommended)</h3>
                    <p className="text-[11px] text-stone-500">Supports Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, NetBanking</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableCashfree}
                    onChange={(e) => setConfig({ ...config, enableCashfree: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b4619]"></div>
                </label>
              </div>

              {config.enableCashfree && (
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Cashfree App ID / Client ID (CASHFREE_KEY_ID):
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. CF_APP_ID or 239103... from Cashfree Merchant Dashboard"
                        value={config.cashfreeAppId}
                        onChange={(e) => setConfig({ ...config, cashfreeAppId: e.target.value.trim() })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0b4619]/20 focus:border-[#0b4619] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Gateway Environment:
                      </label>
                      <select
                        value={config.cashfreeEnv}
                        onChange={(e) => setConfig({ ...config, cashfreeEnv: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619] bg-white"
                      >
                        <option value="production">Production Live Mode (api.cashfree.com)</option>
                        <option value="sandbox">Sandbox Test Mode (sandbox.cashfree.com)</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end text-[11px] text-stone-500 pb-1">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Vercel Serverless Orders Endpoint Ready
                      </span>
                      <span>Secret key is stored safely on Vercel backend.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span className="text-stone-600">
                      Secret Key: Configured via <code>CASHFREE_KEY_SECRET</code> in Vercel.
                    </span>
                    <a
                      href="https://merchant.cashfree.com/merchants/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0b4619] hover:underline flex items-center gap-1 font-medium"
                    >
                      Cashfree Dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Direct UPI Section */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#0b4619]" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Direct Business UPI ID & QR Code</h3>
                    <p className="text-[11px] text-stone-500">Allows travelers to scan & pay with any UPI app directly to your account (0% fee)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableDirectUpi}
                    onChange={(e) => setConfig({ ...config, enableDirectUpi: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b4619]"></div>
                </label>
              </div>

              {config.enableDirectUpi && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <label className="block text-xs font-semibold text-stone-700">
                    Your Platform UPI ID (e.g. GPay / PhonePe / Paytm / Bank):
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. jatingaatours@okhdfcbank"
                      value={config.upiId}
                      onChange={(e) => setConfig({ ...config, upiId: e.target.value.trim() })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0b4619]/20 focus:border-[#0b4619]"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    When customers choose UPI QR, they can scan and send money directly to this UPI address.
                  </p>
                </div>
              )}
            </div>

            {/* Merchant Identity & Support */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Official Merchant Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">Company / Merchant Name:</label>
                  <input
                    type="text"
                    value={config.merchantName}
                    onChange={(e) => setConfig({ ...config, merchantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Support Official Phone / WhatsApp:</label>
                  <input
                    type="text"
                    value={config.supportPhone}
                    onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <div>
                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Configuration saved successfully!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
