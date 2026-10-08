import Razorpay from 'razorpay';

export default async function handler(req: any, res: any) {
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
    // পোনপটীয়াকৈ কোডত নতুন লাইভ কী কেইটা বহুৱাই দিয়া হ’ল
    const key_id = 'rzp_live_TkACHzLu5HND2q';
    const key_secret = '***********************'; // ইয়াত আপোনাৰ আচল লাইভ Key Secret টো বহুৱাই দিব

    if (!key_id || !key_secret) {
      return res.status(401).json({
        error: 'Razorpay Key ID or Key Secret is missing in code.',
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
  } catch (err: any) {
    console.error('Error in /api/create-order:', err);
    const isAuthError =
      err.statusCode === 401 ||
      (err.error?.code === 'BAD_REQUEST_ERROR' &&
        (err.error?.description?.toLowerCase().includes('auth') ||
         err.message?.toLowerCase().includes('auth')));

    const status = isAuthError ? 401 : (err.statusCode || 500);
    return res.status(status).json({
      error: isAuthError
        ? 'Razorpay Authentication Failed (401). Please verify your Live Key ID and Key Secret in Razorpay Dashboard.'
        : (err.error?.description || err.message || 'Failed to create order'),
      details: err.error || err,
    });
  }
}
