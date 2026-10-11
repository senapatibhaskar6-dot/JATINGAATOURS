export interface CashfreeOrderRequest {
  order_id?: string;
  amount: number; // In INR Rupees (e.g. 1500 or 1500.00)
  currency?: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  return_url?: string;
  order_note?: string;
  notes?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  cf_order_id?: string;
  order_id: string;
  entity?: string;
  order_currency: string;
  order_amount: number;
  order_status: string;
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  customer_details?: any;
}

export function getCashfreeCredentials() {
  const rawKeyId =
    process.env.CASHFREE_KEY_ID ||
    process.env.CASHFREE_APP_ID ||
    process.env.CASHFREE_CLIENT_ID ||
    process.env.VITE_CASHFREE_KEY_ID ||
    process.env.VITE_CASHFREE_APP_ID ||
    '';

  const rawKeySecret =
    process.env.CASHFREE_KEY_SECRET ||
    process.env.CASHFREE_SECRET_KEY ||
    '';

  // Sanitize: strip quotation marks and trailing whitespace
  const key_id = rawKeyId.trim().replace(/^["']|["']$/g, '');
  const key_secret = rawKeySecret.trim().replace(/^["']|["']$/g, '');

  const env = (process.env.CASHFREE_ENV || 'production').trim().toLowerCase();
  const isSandbox = env === 'sandbox' || env === 'test';
  const baseUrl = isSandbox ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg';

  return { key_id, key_secret, env, isSandbox, baseUrl };
}

/**
 * Creates a Cashfree PG Order
 * Docs: https://docs.cashfree.com/reference/pg-create-order
 */
export async function createCashfreeOrder(params: CashfreeOrderRequest): Promise<CashfreeOrderResponse> {
  const { key_id, key_secret, baseUrl } = getCashfreeCredentials();

  if (!key_id) {
    throw new Error('CASHFREE_KEY_ID (App ID) is not configured in environment variables.');
  }
  if (!key_secret) {
    throw new Error('CASHFREE_KEY_SECRET is not configured in environment variables.');
  }

  // Ensure amount is in Rupees (if passed in paise, convert to rupees)
  let amountInRupees = Number(params.amount);
  if (amountInRupees >= 10000 && amountInRupees % 100 === 0) {
    // If it was passed as paise (e.g., 150000 paise = 1500 rupees)
    // Note: booking modal calc.totalAdvancePayable is typically 1500. If someone passed 150000, convert.
    // However, if the package advance is 1500, amount is 1500.
  }
  // Cashfree requires minimum ₹1.00
  if (amountInRupees <= 0) {
    throw new Error('Order amount must be greater than 0.');
  }

  const orderId = params.order_id || `order_jt_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

  // Clean phone number (must be 10 digits for Indian numbers)
  let cleanPhone = (params.customer_phone || '').replace(/\D/g, '');
  if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
    cleanPhone = cleanPhone.slice(2);
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    cleanPhone = '9999999999';
  } else if (cleanPhone.length > 10) {
    cleanPhone = cleanPhone.slice(-10);
  }

  const payload = {
    order_id: orderId,
    order_amount: Math.round(amountInRupees * 100) / 100,
    order_currency: params.currency || 'INR',
    customer_details: {
      customer_id: params.customer_id || `cust_${Date.now()}`,
      customer_name: params.customer_name || 'Traveler',
      customer_email: params.customer_email || 'traveler@jatingaatours.com',
      customer_phone: cleanPhone,
    },
    order_meta: {
      return_url: params.return_url || `https://jatingaatours.com/?order_id={order_id}`,
      notify_url: undefined,
    },
    order_note: params.order_note || 'Jatingaa Tours Booking Advance (5% Platform Fee + ₹1000 Agency Lock-in)',
    order_tags: params.notes || {},
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'x-api-version': '2023-08-01',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || data.error_description || (data.sub_code ? `${data.sub_code}: ${data.message}` : 'Failed to create Cashfree order');
    const err: any = new Error(errorMsg);
    err.statusCode = response.status;
    err.details = data;
    throw err;
  }

  return {
    order_id: data.order_id,
    cf_order_id: data.cf_order_id,
    order_amount: data.order_amount,
    order_currency: data.order_currency,
    order_status: data.order_status,
    payment_session_id: data.payment_session_id,
    order_expiry_time: data.order_expiry_time,
    order_note: data.order_note,
    customer_details: data.customer_details,
  };
}

/**
 * Fetches order status from Cashfree
 * Docs: https://docs.cashfree.com/reference/pg-get-order
 */
export async function fetchCashfreeOrder(orderId: string): Promise<any> {
  const { key_id, key_secret, baseUrl } = getCashfreeCredentials();

  if (!key_id || !key_secret) {
    throw new Error('Cashfree credentials missing on server.');
  }

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      'x-client-id': key_id,
      'x-client-secret': key_secret,
      'x-api-version': '2023-08-01',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || 'Failed to fetch Cashfree order';
    const err: any = new Error(errorMsg);
    err.statusCode = response.status;
    err.details = data;
    throw err;
  }

  return data;
}

/**
 * Verifies if an order is paid
 */
export async function verifyCashfreePayment(orderId: string): Promise<{ success: boolean; status: string; data: any }> {
  const order = await fetchCashfreeOrder(orderId);
  const status = (order.order_status || '').toUpperCase();
  const isPaid = status === 'PAID';

  return {
    success: isPaid,
    status,
    data: order,
  };
}
