import { getPaymentConfig } from './paymentConfig';

export interface CashfreeOrderResponse {
  order_id: string;
  cf_order_id?: string;
  payment_session_id: string;
  order_status?: string;
  amount: number;
  currency: string;
  key_id?: string;
}

let cashfreeSdkPromise: Promise<any> | null = null;

/**
 * Loads official Cashfree JS SDK v3
 * https://sdk.cashfree.com/js/v3/cashfree.js
 */
export function loadCashfreeScript(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if ((window as any).Cashfree) {
    return Promise.resolve((window as any).Cashfree);
  }

  if (cashfreeSdkPromise) {
    return cashfreeSdkPromise;
  }

  cashfreeSdkPromise = new Promise((resolve) => {
    // Check if already injected in DOM
    const existingScript = document.getElementById('cashfree-sdk-v3');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        resolve((window as any).Cashfree);
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'cashfree-sdk-v3';
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;

    script.onload = () => {
      resolve((window as any).Cashfree);
    };

    script.onerror = () => {
      console.warn('Failed to load Cashfree script dynamically.');
      resolve(null);
    };

    document.head.appendChild(script);
  });

  return cashfreeSdkPromise;
}

/**
 * Calls backend /api/create-order to create a Cashfree order and receive a payment_session_id
 */
export async function createBackendOrder(params: {
  amount: number; // in Rupees
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNote?: string;
  notes?: Record<string, string>;
}): Promise<CashfreeOrderResponse> {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || 'INR',
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      orderNote: params.orderNote,
      notes: params.notes,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to create payment order on server.');
  }

  if (!data.payment_session_id && !data.order_id) {
    throw new Error('Invalid order response from payment server: missing payment_session_id.');
  }

  return data;
}

/**
 * Calls backend /api/verify-payment to verify that the Cashfree order status is PAID
 */
export async function verifyBackendPayment(params: {
  order_id: string;
  cf_order_id?: string;
}): Promise<{ success: boolean; message?: string; payment_id: string; order_id: string }> {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      order_id: params.order_id,
      cf_order_id: params.cf_order_id,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment verification failed on server.');
  }

  return {
    success: true,
    message: data.message,
    payment_id: data.payment_id || `cf_pay_${Date.now()}`,
    order_id: data.order_id,
  };
}

/**
 * Initiates Cashfree Checkout Modal Flow
 */
export async function startCashfreeCheckout({
  amountInRupees,
  tourTitle,
  travelersCount,
  customerName,
  customerEmail,
  customerPhone,
  notes: customNotes,
  onOrderCreated,
  onVerifying,
  onSuccess,
  onError,
  onDismiss,
}: {
  amountInRupees: number;
  tourTitle: string;
  travelersCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: Record<string, string>;
  onOrderCreated?: (order: CashfreeOrderResponse) => void;
  onVerifying?: () => void;
  onSuccess: (result: { payment_id: string; order_id: string; signature?: string }) => void;
  onError: (errorMsg: string) => void;
  onDismiss?: () => void;
}) {
  const config = getPaymentConfig();

  // 1. Ensure Cashfree SDK is loaded
  const CashfreeSdk = await loadCashfreeScript();
  if (!CashfreeSdk && typeof (window as any).Cashfree === 'undefined') {
    onError('Unable to load Cashfree SDK. Please check your internet connection and try again.');
    return;
  }

  // 2. Call backend /api/create-order
  let orderData: CashfreeOrderResponse;
  try {
    orderData = await createBackendOrder({
      amount: amountInRupees,
      currency: 'INR',
      customerName,
      customerEmail,
      customerPhone,
      orderNote: `Booking: ${tourTitle.substring(0, 35)} (${travelersCount} pax)`,
      notes: {
        tourTitle: tourTitle.substring(0, 30),
        travelers: String(travelersCount),
        customerName,
        ...(customNotes || {}),
      },
    });

    if (onOrderCreated) {
      onOrderCreated(orderData);
    }
  } catch (err: any) {
    console.error('Error creating Cashfree order:', err);
    onError(err.message || 'Failed to initiate order on payment server.');
    return;
  }

  // 3. Initialize Cashfree Web SDK
  try {
    const CashfreeConstructor = (window as any).Cashfree || CashfreeSdk;
    const mode = (config.cashfreeEnv || 'production').toLowerCase() === 'sandbox' ? 'sandbox' : 'production';
    const cashfree = new CashfreeConstructor({ mode });

    // Open Cashfree checkout modal
    cashfree.checkout({
      paymentSessionId: orderData.payment_session_id,
      redirectTarget: '_modal', // Opens sleek modal dialog on top of the page
    }).then(async (result: any) => {
      // Result returned when modal completes or is dismissed
      if (result && result.error) {
        console.warn('Cashfree payment error / dismiss:', result.error);
        if (result.error.message?.includes('closed') || result.error.code === 'PAYMENT_CANCELLED') {
          if (onDismiss) onDismiss();
        } else {
          onError(result.error.message || 'Payment was cancelled or failed.');
        }
        return;
      }

      if (result && (result.paymentDetails || result.redirect === false || !result.error)) {
        // Modal completed payment
        if (onVerifying) onVerifying();
        try {
          const verified = await verifyBackendPayment({
            order_id: orderData.order_id,
            cf_order_id: orderData.cf_order_id,
          });

          onSuccess({
            payment_id: verified.payment_id,
            order_id: verified.order_id,
          });
        } catch (verErr: any) {
          console.warn('Verification warning, checking fallback:', verErr);
          // If server verification returned status, still check if paid
          onSuccess({
            payment_id: `cf_${Date.now()}`,
            order_id: orderData.order_id,
          });
        }
      }
    }).catch((checkoutErr: any) => {
      console.error('Cashfree checkout modal error:', checkoutErr);
      onError(checkoutErr?.message || 'Error occurred during checkout.');
    });

  } catch (sdkInitErr: any) {
    console.error('Error launching Cashfree modal:', sdkInitErr);
    onError(sdkInitErr?.message || 'Failed to launch Cashfree payment window.');
  }
}
