import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS configuration for Vercel deployments
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const key_secret = rawKeySecret.trim().replace(/^["']|["']$/g, '');

    if (!key_secret) {
      return res.status(500).json({
        success: false,
        error: 'RAZORPAY_KEY_SECRET is not configured on the server. Please add it to Vercel Environment Variables.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      order_id,
      payment_id,
      signature,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const resolvedOrderId = order_id || razorpay_order_id;
    const resolvedPaymentId = payment_id || razorpay_payment_id;
    const resolvedSignature = signature || razorpay_signature;

    if (!resolvedOrderId || !resolvedPaymentId || !resolvedSignature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters. Required: order_id, payment_id, signature',
      });
    }

    const payload = `${resolvedOrderId}|${resolvedPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(payload)
      .digest('hex');

    const genBuf = Buffer.from(generatedSignature, 'utf-8');
    const sigBuf = Buffer.from(resolvedSignature, 'utf-8');

    const isMatch = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment signature verified successfully',
      order_id: resolvedOrderId,
      payment_id: resolvedPaymentId,
    });
  } catch (err) {
    console.error('Error in /api/verify-payment handler:', err);
    return res.status(400).json({
      success: false,
      error: err.message || 'Payment signature verification failed',
    });
  }
}
