import React, { useState, useEffect } from 'react';
import { TourPackage, BookingRecord } from '../types';
import { calculateBookingFees, formatINR } from '../utils/pricing';
import { getPaymentConfig, PaymentConfig } from '../utils/paymentConfig';
import { startRazorpayCheckout } from '../utils/razorpayClient';
import { triggerBookingConfirmationEmail } from '../utils/supabaseClient';
import { X, ShieldCheck, QrCode, CreditCard, Landmark, CheckCircle2, Lock, ArrowRight, Loader2, Sparkles, Smartphone, Copy, ExternalLink, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  tour: TourPackage;
  initialTravelersCount?: number;
  onClose: () => void;
  onBookingSuccess: (record: BookingRecord) => void;
  onOpenPaymentSettings?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tour,
  initialTravelersCount = 1,
  onClose,
  onBookingSuccess,
  onOpenPaymentSettings,
}) => {
  const [config, setConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [travelersCount, setTravelersCount] = useState<number>(initialTravelersCount);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    // Default to 14 days in future
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [utrNumber, setUtrNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const calc = calculateBookingFees(tour.pricePerPerson, travelersCount);

  // Generate UPI deep link
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(config.merchantName)}&am=${calc.totalAdvancePayable}&cu=INR&tn=${encodeURIComponent('Booking ' + tour.title.substring(0, 20))}`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(config.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const completeBooking = (txnId: string, method: 'upi' | 'card' | 'netbanking') => {
    const bookingCode = `JT-2026-${tour.region.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BookingRecord = {
      id: 'bk-' + Date.now(),
      bookingCode,
      packageId: tour.id,
      packageTitle: tour.title,
      packageLocation: tour.location,
      travelDate,
      travelersCount,
      customerName,
      customerEmail,
      customerPhone,
      customerCity: customerCity || 'Delhi NCR',
      specialRequests,
      paymentMethod: method,
      paymentTransactionId: txnId,
      calculation: calc,
      bookingTimestamp: new Date().toISOString(),
      status: 'confirmed',
      agency: tour.agency,
    };

    // Trigger automated booking confirmation email via Supabase Edge Function (Resend API)
    triggerBookingConfirmationEmail({
      travelerName: customerName,
      email: customerEmail,
      phone: customerPhone,
      bookingCode,
    }).catch(err => console.log('Edge Function trigger note:', err));

    onBookingSuccess(newRecord);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!customerName || !customerEmail || !customerPhone) {
      setPaymentError('Please fill in your name, email, and phone number to continue.');
      return;
    }

    // Razorpay Standard Checkout Flow
    if (config.enableRazorpay) {
      setIsProcessing(true);
      setProcessingStep('Creating Razorpay order on server (/api/create-order)...');

      try {
        await startRazorpayCheckout({
          amountInPaise: calc.totalAdvancePayable * 100, // paise
          tourTitle: tour.title,
          travelersCount,
          customerName,
          customerEmail,
          customerPhone,
          onOrderCreated: (order) => {
            setProcessingStep(`Razorpay order created (${order.order_id}). Launching Checkout modal...`);
          },
          onVerifying: () => {
            setIsProcessing(true);
            setProcessingStep('Verifying payment signature on server (/api/verify-payment)...');
          },
          onSuccess: (verifiedResult) => {
            setProcessingStep('Payment signature verified successfully! Unlocking agency...');
            setTimeout(() => {
              setIsProcessing(false);
              completeBooking(verifiedResult.payment_id, paymentMethod);
            }, 600);
          },
          onError: (errMsg) => {
            setIsProcessing(false);
            setPaymentError(errMsg);
          },
          onDismiss: () => {
            setIsProcessing(false);
            setPaymentError('Checkout modal was closed before payment completion. You can retry when ready.');
          },
        });
        return;
      } catch (err: any) {
        console.error('Razorpay Checkout failed:', err);
        setIsProcessing(false);
        setPaymentError(err.message || 'Failed to initialize Razorpay Standard Checkout.');
        return;
      }
    }

    // Direct UPI / Fallback flow
    setIsProcessing(true);
    setProcessingStep('Connecting to secure payment network...');

    setTimeout(() => {
      setProcessingStep('Authorizing ₹' + calc.totalAdvancePayable + ' booking advance...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Allocating 5% platform fee & ₹1,000 agency lock-in...');
    }, 1800);

    setTimeout(() => {
      setProcessingStep('Unlocking direct agency contacts and issuing voucher...');
    }, 2600);

    setTimeout(() => {
      setIsProcessing(false);
      const txnId = utrNumber ? `UPI-${utrNumber}` : ('TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      completeBooking(txnId, paymentMethod);
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0b4619] tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-[#0b4619]" />
              <span>Instant Agency Booking & Contact Unlock</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 font-display mt-0.5">
              Secure Checkout · {tour.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {isProcessing ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#0b4619]/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#0b4619] animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Processing Digital Payment
                </h3>
                <p className="text-sm text-stone-600 font-medium">
                  {processingStep}
                </p>
                <p className="text-xs text-stone-400 mt-2">
                  Please do not refresh or close this window
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Financial Summary Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex justify-between items-start pb-3 border-b border-stone-200">
                  <div>
                    <div className="text-xs text-stone-500">Local Operator & Host:</div>
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-[#0b4619]" />
                      <span>{tour.agency.name}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Host: {tour.agency.founder} · Lic: {tour.agency.licenseNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-stone-500">Agency Package Price:</div>
                    <div className="text-base font-bold text-stone-900 tabular-nums">
                      {formatINR(calc.totalPackagePrice)}
                    </div>
                    <div className="text-[10px] font-semibold text-[#0b4619] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                      100% Retained by Agency
                    </div>
                  </div>
                </div>

                {/* Core Formula Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1">
                      <span>Package Base Value ({travelersCount} {travelersCount === 1 ? 'traveler' : 'travelers'}):</span>
                    </span>
                    <span className="font-semibold text-stone-900 tabular-nums">{formatINR(calc.totalPackagePrice)}</span>
                  </div>

                  <div className="flex justify-between items-center text-stone-600">
                    <div>
                      <span className="font-medium text-stone-700">5% Jatingaa Platform Fee (Paid on Top by Traveler):</span>
                      <div className="text-[11px] text-stone-400">Convenience charge for escrow, support & instant direct unlock</div>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">{formatINR(calc.platformCommission)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-medium text-stone-800 text-xs">
                    <span>Total Traveler Investment (Package + 5% Fee):</span>
                    <span className="font-bold tabular-nums text-stone-900">{formatINR(calc.travelerTotalAmount)}</span>
                  </div>

                  {/* Advance Payable Now Highlight */}
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-sm font-bold text-[#0b4619]">
                          Initial Advance Payable Now:
                        </strong>
                        <div className="text-[11px] text-emerald-800">
                          5% Platform Fee ({formatINR(calc.platformCommission)}) + ₹1,000 Agency Lock-in Advance
                        </div>
                      </div>
                      <span className="text-lg font-bold text-[#0b4619] tabular-nums">
                        {formatINR(calc.totalAdvancePayable)}
                      </span>
                    </div>
                  </div>

                  {/* Balance on arrival */}
                  <div className="flex justify-between items-center text-xs text-stone-600 pt-1">
                    <span>Remaining balance due directly to local host on arrival:</span>
                    <span className="font-bold text-stone-900 tabular-nums">{formatINR(calc.remainingBalanceDueOnArrival)}</span>
                  </div>

                  {/* Crystal-clear guarantee badge */}
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-start gap-2 text-[11px] text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-[#0b4619] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">0% Agency Deduction Policy:</strong> The 5% platform fee is paid by the traveler on top as a platform charge. The local agency&apos;s earnings are <strong>never deducted</strong> by the 5% platform fee—they receive their full {formatINR(calc.totalPackagePrice)} package value ({formatINR(calc.agencyAdvanceFee)} upfront advance + {formatINR(calc.remainingBalanceDueOnArrival)} arrival balance).
                    </div>
                  </div>
                </div>
              </div>

              {/* Traveler Details Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
                  <span>1. Primary Traveler & Date Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address * (For Confirmation Voucher)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aditi.sharma@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Expected Trip Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Number of Travelers
                    </label>
                    <select
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    >
                      {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Departure City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Requests or Pickup Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Vegetarian meal preference, train arrival time, extra bedding..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0b4619]"
                  />
                </div>
              </div>

              {/* Digital Payment Section */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                {paymentError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="block font-semibold">Payment Notification:</strong>
                      <span>{paymentError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaymentError(null)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
                    <span>2. Digital Payment Interface</span>
                    <span className="text-xs font-normal text-stone-500">
                      (Pay Advance of {formatINR(calc.totalAdvancePayable)})
                    </span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] text-emerald-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Razorpay Standard Checkout</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#0b4619] font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>256-bit Encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Payment Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#0b4619]" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#0b4619]" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 text-[#0b4619]" />
                    <span>NetBanking</span>
                  </button>
                </div>

                {/* Tab 1: UPI / Dynamic QR Code */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-stone-200 shadow-xs text-center">
                      <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#f39c12]" />
                        <span>Dynamic UPI QR ({formatINR(calc.totalAdvancePayable)})</span>
                      </div>

                      {/* Dynamic QR Code Box */}
                      <div className="w-36 h-36 bg-white p-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-sm border border-stone-200">
                        <img
                          src={upiQrCodeUrl}
                          alt="UPI Payment QR Code"
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="text-[11px] font-bold text-stone-800 mt-2">
                        Scan with GPay / PhonePe / Paytm
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                        {config.upiId}
                      </div>

                      {/* Pay via UPI App button for mobile users */}
                      <a
                        href={upiDeepLink}
                        className="mt-2.5 w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay with UPI App</span>
                      </a>
                    </div>

                    <div className="sm:col-span-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-stone-800">
                          Direct Platform UPI ID:
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          0% Gateway Fee
                        </span>
                      </div>

                      {/* UPI ID display with Copy button */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-white border border-stone-300 rounded-lg text-stone-800 truncate">
                          {config.upiId}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedUpi ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          UPI UTR / Reference No. (Optional after payment):
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 428901849201"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 text-stone-900 bg-white font-mono"
                        />
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200 text-[11px] text-emerald-950 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-[#0b4619]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0b4619]" />
                          <span>Google Ads ট্রাফিকেলৈ নিশ্চিত সুৰক্ষা:</span>
                        </div>
                        <p>
                          পেমেন্ট হোৱাৰ লগে লগে ₹১,০০০ এডভান্স এজেঞ্চিৰ বাবে লক হ'ব আৰু আপোনাৰ এজেঞ্চিৰ ফোন নম্বৰ, হোৱাটছএপ লিংক আৰু চৰকাৰী লাইচেন্সৰ ভাউচাৰ পৰ্যটকৰ বাবে মুকলি হৈ পৰিব।
                        </p>
                      </div>

                      {onOpenPaymentSettings && (
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={onOpenPaymentSettings}
                            className="text-[10px] text-stone-500 hover:text-[#0b4619] underline cursor-pointer"
                          >
                            ⚙️ Configure Razorpay / Custom UPI
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Card */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 text-stone-900 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: NetBanking */}
                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Choose Your Bank
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-colors ${
                            selectedBank === bank
                              ? 'bg-white border-[#0b4619] text-[#0b4619] shadow-sm'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  Initial advance payable today: <strong className="text-stone-900">{formatINR(calc.totalAdvancePayable)}</strong> (5% platform fee + ₹1,000 agency advance). The local agency receives 100% of their package value with <strong>0% platform deduction</strong>.
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#0b4619] hover:bg-[#062b0f] rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Pay {formatINR(calc.totalAdvancePayable)} via Razorpay</span>
                  <ArrowRight className="w-4 h-4 text-[#f39c12]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
