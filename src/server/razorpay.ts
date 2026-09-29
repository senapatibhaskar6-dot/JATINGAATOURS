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

export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    const error: any = new Error('Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
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

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (err: any) {
    console.error('Razorpay API error in createOrder:', err);
    const error: any = new Error(err.error?.description || err.message || 'Razorpay order creation failed');
    error.statusCode = err.statusCode === 401 ? 401 : 500;
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
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_secret) {
    const error: any = new Error('RAZORPAY_KEY_SECRET is not configured on the server');
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
