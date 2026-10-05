import Razorpay from 'razorpay';

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
    const rawKeyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.VITE_RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      '';
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

    // Sanitize: strip whitespace and accidental surrounding quotes
    const key_id = rawKeyId.trim().replace(/^["']|["']$/g, '');
    const key_secret = rawKeySecret.trim().replace(/^["']|["']$/g, '');

    if (!key_id) {
      return res.status(401).json({
        error: 'Razorpay RAZORPAY_KEY_ID is missing.',
        help: 'Please set RAZORPAY_KEY_ID in your Vercel Project Settings -> Environment Variables.',
      });
    }

    if (!key_secret) {
      return res.status(401).json({
        error: 'Razorpay RAZORPAY_KEY_SECRET is missing.',
        help: 'Please set RAZORPAY_KEY_SECRET in your Vercel Project Settings -> Environment Variables.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { amount, currency = 'INR', receipt, notes } = body;

    const numericAmount = Math.round(Number(amount));
    if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
      return res.status(400).json({
        error: 'Amount is required and must be in paise (minimum 100 paise / ₹1.00)',
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount: numericAmount,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: key_id,
    });
  } catch (err) {
    console.error('Error in /api/create-order:', err);
    const isAuthError =
      err.statusCode === 401 ||
      (err.error?.code === 'BAD_REQUEST_ERROR' &&
        (err.error?.description?.toLowerCase().includes('auth') ||
         err.message?.toLowerCase().includes('auth')));

    const status = isAuthError ? 401 : (err.statusCode || 500);
    return res.status(status).json({
      error: isAuthError
        ? 'Razorpay Authentication Failed (401). The Key ID or Key Secret is invalid or rejected by Razorpay. Please verify that your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET match in your Razorpay Dashboard (Settings -> API Keys), and that you did not mix Live keys with Test keys.'
        : (err.error?.description || err.message || 'Failed to create order'),
      details: err.error || err,
    });
  }
}
