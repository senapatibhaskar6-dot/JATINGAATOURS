import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCashfreeOrder, verifyCashfreePayment } from './src/server/cashfree.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const keyId =
    process.env.CASHFREE_KEY_ID ||
    process.env.CASHFREE_APP_ID ||
    process.env.CASHFREE_CLIENT_ID ||
    null;
  const isConfigured = Boolean(
    keyId &&
    (process.env.CASHFREE_KEY_SECRET || process.env.CASHFREE_SECRET_KEY)
  );

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    paymentGateway: 'Cashfree',
    cashfreeConfigured: isConfigured,
    keyId: keyId ? `${keyId.substring(0, 8)}...` : null,
    env: process.env.CASHFREE_ENV || 'production',
  });
});

/**
 * BACKEND - Create Cashfree Order
 * Endpoint: POST /api/create-order
 */
app.post('/api/create-order', async (req: Request, res: Response) => {
  try {
    const {
      amount,
      currency = 'INR',
      customerName,
      customerEmail,
      customerPhone,
      orderNote,
      notes,
      returnUrl,
    } = req.body || {};

    let amountInRupees = Number(amount);
    if (!amountInRupees || isNaN(amountInRupees) || amountInRupees < 1) {
      return res.status(400).json({
        error: 'Order amount is required and must be at least ₹1.00',
      });
    }

    if (amountInRupees > 10000 && amountInRupees % 100 === 0) {
      amountInRupees = amountInRupees / 100;
    }

    const order = await createCashfreeOrder({
      amount: amountInRupees,
      currency,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      order_note: orderNote,
      notes: notes || {},
      return_url: returnUrl,
    });

    return res.status(200).json(order);
  } catch (err: any) {
    console.error('Error in /api/create-order (Cashfree):', err);
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || 'Failed to create Cashfree order',
      details: err.details,
    });
  }
});

/**
 * BACKEND - Verify Cashfree Order
 * Endpoint: POST /api/verify-payment
 */
app.post('/api/verify-payment', async (req: Request, res: Response) => {
  try {
    const { order_id, cf_order_id } = req.body || {};
    const resolvedOrderId = order_id || cf_order_id;

    if (!resolvedOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: order_id',
      });
    }

    const verification = await verifyCashfreePayment(resolvedOrderId);
    return res.status(200).json(verification);
  } catch (err: any) {
    console.error('Error in /api/verify-payment (Cashfree):', err);
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Payment verification failed',
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
