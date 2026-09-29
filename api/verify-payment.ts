import type { Request, Response } from 'express';
import { verifySignature } from '../src/server/razorpay.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      order_id,
      payment_id,
      signature,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    const resolvedOrderId = order_id || razorpay_order_id;
    const resolvedPaymentId = payment_id || razorpay_payment_id;
    const resolvedSignature = signature || razorpay_signature;

    if (!resolvedOrderId || !resolvedPaymentId || !resolvedSignature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters. Required: order_id, payment_id, signature',
      });
    }

    const result = verifySignature({
      order_id: resolvedOrderId,
      payment_id: resolvedPaymentId,
      signature: resolvedSignature,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/verify-payment handler:', err);
    const status = err.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: err.message || 'Payment signature verification failed',
    });
  }
}
