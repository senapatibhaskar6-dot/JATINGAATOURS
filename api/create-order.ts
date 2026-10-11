import { createCashfreeOrder } from '../src/server/cashfree.js';

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel Serverless Functions
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
      process.env.CASHFREE_KEY_ID ||
      process.env.CASHFREE_APP_ID ||
      process.env.CASHFREE_CLIENT_ID ||
      process.env.VITE_CASHFREE_KEY_ID ||
      '';

    const rawKeySecret =
      process.env.CASHFREE_KEY_SECRET ||
      process.env.CASHFREE_SECRET_KEY ||
      '';

    const key_id = rawKeyId.trim().replace(/^["']|["']$/g, '');
    const key_secret = rawKeySecret.trim().replace(/^["']|["']$/g, '');

    if (!key_id || !key_secret) {
      return res.status(401).json({
        error: 'Cashfree credentials missing.',
        help: 'Please set CASHFREE_KEY_ID and CASHFREE_KEY_SECRET in your Vercel Project Settings -> Environment Variables.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      amount,
      currency = 'INR',
      customerName,
      customerEmail,
      customerPhone,
      orderNote,
      notes,
      returnUrl,
    } = body;

    // Convert amount: if passed in paise (> 10000 and typically in paise from legacy code), convert to rupees
    let amountInRupees = Number(amount);
    if (!amountInRupees || isNaN(amountInRupees) || amountInRupees < 1) {
      return res.status(400).json({
        error: 'Order amount is required and must be at least ₹1.00',
      });
    }

    // If client passes amount in paise (e.g. 150000 paise for ₹1,500), convert to ₹1,500
    if (amountInRupees > 10000 && amountInRupees % 100 === 0) {
      amountInRupees = amountInRupees / 100;
    }

    const order = await createCashfreeOrder({
      amount: amountInRupees,
      currency: currency || 'INR',
      customer_name: customerName || 'Valued Traveler',
      customer_email: customerEmail || 'traveler@jatingaatours.com',
      customer_phone: customerPhone || '9999999999',
      order_note: orderNote || 'Jatingaa Tours Booking Advance (5% Platform Fee + ₹1,000 Agency Lock-in)',
      notes: notes || {},
      return_url: returnUrl,
    });

    return res.status(200).json({
      order_id: order.order_id,
      cf_order_id: order.cf_order_id,
      payment_session_id: order.payment_session_id,
      order_status: order.order_status,
      amount: order.order_amount,
      currency: order.order_currency,
      key_id: key_id,
    });
  } catch (err: any) {
    console.error('Error in /api/create-order (Cashfree):', err);
    const status = err.statusCode || (err.message?.includes('credentials') ? 401 : 500);

    return res.status(status).json({
      error: err.message || 'Failed to create Cashfree order',
      details: err.details || err,
    });
  }
}
