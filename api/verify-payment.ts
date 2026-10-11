import { verifyCashfreePayment } from '../src/server/cashfree.js';

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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { order_id, cf_order_id } = body;

    const resolvedOrderId = order_id || cf_order_id;
    if (!resolvedOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: order_id',
      });
    }

    const verification = await verifyCashfreePayment(resolvedOrderId);

    if (verification.success || verification.status === 'PAID') {
      return res.status(200).json({
        success: true,
        message: 'Cashfree order payment verified successfully!',
        order_id: resolvedOrderId,
        payment_id: verification.data?.cf_order_id || `cf_pay_${Date.now()}`,
        status: verification.status,
        order: verification.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: `Order payment status is ${verification.status || 'UNPAID'}`,
        status: verification.status,
        order_id: resolvedOrderId,
      });
    }
  } catch (err: any) {
    console.error('Error in /api/verify-payment handler (Cashfree):', err);
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Failed to verify Cashfree order payment',
    });
  }
}
