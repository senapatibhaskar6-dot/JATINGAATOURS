import type { Request, Response } from 'express';
import { createOrder } from '../src/server/razorpay.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    if (!amount) {
      return res.status(400).json({
        error: 'Amount is required and must be in paise (minimum 100 paise)',
      });
    }

    const order = await createOrder({
      amount: Number(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json(order);
  } catch (err: any) {
    console.error('Error in /api/create-order handler:', err);
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || 'Failed to create order',
      details: err.details,
    });
  }
}
