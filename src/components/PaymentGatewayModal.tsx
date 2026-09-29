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
                Payment Gateway Configuration
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
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Google Ads Traffic Notice:</span>
              <p>
                When real customers visit your app via Google Ads, they expect to pay the 5% platform fee & ₹1,000 booking advance via <strong>Razorpay (UPI / Google Pay / PhonePe / Cards)</strong> or <strong>Direct UPI QR</strong>. You can configure your keys below.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Razorpay Section */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0b4619] text-white flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Razorpay Gateway (Recommended)</h3>
                    <p className="text-[11px] text-stone-500">Supports Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, NetBanking</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableRazorpay}
                    onChange={(e) => setConfig({ ...config, enableRazorpay: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b4619]"></div>
                </label>
              </div>

              {config.enableRazorpay && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <label className="block text-xs font-semibold text-stone-700">
                    Razorpay Key ID:
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="rzp_live_xxxxxxxxxxxxxxxx বা rzp_test_xxxxxxxxxxxxxxxx"
                      value={config.razorpayKeyId}
                      onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value.trim() })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0b4619]/20 focus:border-[#0b4619] font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {config.razorpayKeyId ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Razorpay Key Configured
                        </span>
                      ) : (
                        <span className="text-stone-500">Leave blank to use demo sandbox mode</span>
                      )}
                    </span>
                    <a
                      href="https://dashboard.razorpay.com/app/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0b4619] hover:underline flex items-center gap-1 font-medium"
                    >
                      Get Razorpay Key <ExternalLink className="w-3 h-3" />
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
                      placeholder="senapatibhaskar@okhdfcbank"
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

            {/* Merchant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Business / Brand Name:
                </label>
                <input
                  type="text"
                  value={config.merchantName}
                  onChange={(e) => setConfig({ ...config, merchantName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0b4619]/20 focus:border-[#0b4619]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Support Phone / WhatsApp:
                </label>
                <input
                  type="text"
                  value={config.supportPhone}
                  onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0b4619]/20 focus:border-[#0b4619]"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <div>
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Payment settings saved successfully!
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0b4619] text-white font-semibold text-xs hover:bg-[#083513] transition-colors shadow-sm cursor-pointer"
              >
                Save Payment Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
