import Razorpay from 'razorpay';
import crypto from 'crypto';

export interface CreateOrderParams {
  amount: number; // in paise (e.g. 100 paise = ₹1.00)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface VerifyPaymentParams {
  order_id: string;
  payment_id: string;
  signature: string;
}

export function getRazorpayCredentials() {
  const rawKeyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.VITE_RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    '';
  const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

  // Sanitize: trim whitespace, strip surrounding single or double quotes
  const key_id = rawKeyId.trim().replace(/^["']|["']$/g, '');
  const key_secret = rawKeySecret.trim().replace(/^["']|["']$/g, '');

  return { key_id, key_secret };
}

export function getRazorpayClient(): Razorpay {
  const { key_id, key_secret } = getRazorpayCredentials();

  if (!key_id) {
    const error: any = new Error(
      'Razorpay configuration error: RAZORPAY_KEY_ID is missing in environment variables. ' +
      'On Vercel, add RAZORPAY_KEY_ID in Project Settings -> Environment Variables.'
    );
    error.statusCode = 401;
    throw error;
  }

  if (!key_secret) {
    const error: any = new Error(
      'Razorpay configuration error: RAZORPAY_KEY_SECRET is missing in environment variables. ' +
      'On Vercel, add RAZORPAY_KEY_SECRET in Project Settings -> Environment Variables.'
    );
    error.statusCode = 401;
    throw error;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Creates a Razorpay order
 * Amount must be in paise (>= 100 paise)
 */
export async function createOrder({
  amount,
  currency = 'INR',
  receipt,
  notes,
}: CreateOrderParams) {
  const numericAmount = Math.round(Number(amount));

  // Minimum amount: 100 paise
  if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
    const error: any = new Error('Amount must be at least 100 paise (₹1.00)');
    error.statusCode = 400;
    throw error;
  }

  const client = getRazorpayClient();

  try {
    const order = await client.orders.create({
      amount: numericAmount,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    const { key_id } = getRazorpayCredentials();

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id,
    };
  } catch (err: any) {
    console.error('Razorpay API error in createOrder:', err);
    const { key_id } = getRazorpayCredentials();
    const maskedKey = key_id ? `${key_id.substring(0, 8)}...` : 'not configured';
    const isAuthError =
      err.statusCode === 401 ||
      err.error?.code === 'BAD_REQUEST_ERROR' &&
        (err.error?.description?.toLowerCase().includes('auth') || err.message?.toLowerCase().includes('auth'));

    let message = err.error?.description || err.message || 'Razorpay order creation failed';
    if (isAuthError || err.statusCode === 401) {
      message =
        `Razorpay Authentication Failed (401 Unauthorized). The Key ID (${maskedKey}) or Key Secret was rejected by Razorpay. ` +
        `Please verify: 1) Both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET match in Razorpay Dashboard (Settings -> API Keys), ` +
        `2) You are not mixing Live keys with Test keys, 3) There are no extra quotation marks or spaces in Vercel Environment Variables.`;
    }

    const error: any = new Error(message);
    error.statusCode = err.statusCode === 401 ? 401 : (err.statusCode || 500);
    error.details = err.error || err;
    throw error;
  }
}

/**
 * Verifies Razorpay HMAC SHA256 signature
 */
export function verifySignature({
  order_id,
  payment_id,
  signature,
}: VerifyPaymentParams) {
  const { key_secret } = getRazorpayCredentials();

  if (!key_secret) {
    const error: any = new Error(
      'RAZORPAY_KEY_SECRET is not configured on the server. Please add it to your Environment Variables.'
    );
    error.statusCode = 500;
    throw error;
  }

  if (!order_id || !payment_id || !signature) {
    const error: any = new Error('Missing required verification fields: order_id, payment_id, and signature are required');
    error.statusCode = 400;
    throw error;
  }

  const payload = `${order_id}|${payment_id}`;
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(payload)
    .digest('hex');

  // Compare generated signature with razorpay_signature
  const genBuf = Buffer.from(generatedSignature, 'utf-8');
  const sigBuf = Buffer.from(signature, 'utf-8');

  const isMatch = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

  if (!isMatch) {
    const error: any = new Error('Invalid payment signature. Verification failed.');
    error.statusCode = 400;
    throw error;
  }

  return {
    success: true,
    message: 'Payment signature verified successfully',
    order_id,
    payment_id,
  };
}
