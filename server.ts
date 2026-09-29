import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOrder, verifySignature } from './src/server/razorpay.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    keyId: process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 8)}...` : null,
  });
});

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt }
 * Return: { order_id, amount, currency }
 * Minimum amount: 100 paise
 */
app.post('/api/create-order', async (req: Request, res: Response) => {
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
    console.error('Error in /api/create-order:', err);
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || 'Failed to create order',
      details: err.details,
    });
  }
});

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
app.post('/api/verify-payment', (req: Request, res: Response) => {
  try {
    const {
      order_id,
      payment_id,
      signature,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    // Support both standard and prefixed field names
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
    console.error('Error in /api/verify-payment:', err);
    const status = err.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: err.message || 'Payment signature verification failed',
    });
  }
});

// Vite middleware or Static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Jatingaa Tours server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
