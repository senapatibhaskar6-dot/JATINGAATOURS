import { getPaymentConfig } from './paymentConfig';

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number; // in paise
  currency: string;
  receipt?: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order_id: string;
  payment_id: string;
}

/**
 * Loads Razorpay script dynamically if not present
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * STEP 1: Calls backend POST /api/create-order
 */
export async function createBackendOrder(params: {
  amountInPaise: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amountInPaise,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create order on server');
  }

  return data;
}

/**
 * STEP 3: Calls backend POST /api/verify-payment to verify HMAC-SHA256 signature
 */
export async function verifyBackendPayment(params: {
  order_id: string;
  payment_id: string;
  signature: string;
}): Promise<VerifyPaymentResponse> {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: params.order_id,
      payment_id: params.payment_id,
      signature: params.signature,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed');
  }

  return data;
}

/**
 * Complete Standard Web Checkout Flow:
 * 1. Ensure SDK loaded
 * 2. Call /api/create-order
 * 3. Open Razorpay modal with order_id
 * 4. On payment success, call /api/verify-payment
 * 5. Handle dismiss and failure events
 */
export async function startRazorpayCheckout({
  amountInPaise,
  tourTitle,
  travelersCount,
  customerName,
  customerEmail,
  customerPhone,
  onOrderCreated,
  onVerifying,
  onSuccess,
  onError,
  onDismiss,
}: {
  amountInPaise: number;
  tourTitle: string;
  travelersCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onOrderCreated?: (order: RazorpayOrderResponse) => void;
  onVerifying?: () => void;
  onSuccess: (result: { payment_id: string; order_id: string; signature: string }) => void;
  onError: (errorMsg: string) => void;
  onDismiss?: () => void;
}) {
  const config = getPaymentConfig();
  const keyId = config.razorpayKeyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_Thh9BABeByVffa';

  // 1. Ensure Razorpay script loaded
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || typeof (window as any).Razorpay === 'undefined') {
    onError('Unable to load Razorpay SDK. Please check your internet connection and try again.');
    return;
  }

  // 2. Call backend /api/create-order
  let orderData: RazorpayOrderResponse;
  try {
    orderData = await createBackendOrder({
      amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        tourTitle: tourTitle.substring(0, 30),
        travelers: String(travelersCount),
        customerName,
      },
    });
    if (onOrderCreated) {
      onOrderCreated(orderData);
    }
  } catch (err: any) {
    console.error('Error creating order:', err);
    onError(err.message || 'Failed to initiate order on payment server.');
    return;
  }

  // 3. Configure Razorpay Standard Checkout options
  const options = {
    key: keyId,
    amount: orderData.amount, // in paise
    currency: orderData.currency || 'INR',
    name: config.merchantName || 'Jatingaa Tours Pvt Ltd',
    description: `Booking Advance for ${tourTitle.substring(0, 35)} (${travelersCount} traveler${travelersCount > 1 ? 's' : ''})`,
    image: '/jatingaa_tours_logo.png',
    order_id: orderData.order_id, // Order ID from backend
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    notes: {
      tour: tourTitle,
      travelers: String(travelersCount),
    },
    theme: {
      color: '#0b4619',
    },
    handler: async function (response: RazorpaySuccessResponse) {
      if (onVerifying) {
        onVerifying();
      }

      // 4. Verify payment signature on backend
      try {
        const verifyResult = await verifyBackendPayment({
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });

        if (verifyResult.success) {
          onSuccess({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        } else {
          onError('Payment received, but signature verification failed. Please contact support.');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        onError(err.message || 'Payment signature verification failed. Please contact support.');
      }
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) {
          onDismiss();
        }
      },
      escape: true,
      backdropclose: false,
    },
  };

  try {
    const rzp = new (window as any).Razorpay(options);

    // Handle payment.failed event
    rzp.on('payment.failed', function (response: any) {
      console.error('Razorpay payment.failed:', response.error);
      const description = response.error?.description || response.error?.reason || 'Payment failed';
      onError(`Payment Failed: ${description}`);
    });

    rzp.open();
  } catch (err: any) {
    console.error('Razorpay open modal error:', err);
    onError(err.message || 'Failed to open Razorpay payment checkout.');
  }
}
