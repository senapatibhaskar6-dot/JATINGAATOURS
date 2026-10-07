export interface PaymentConfig {
  razorpayKeyId: string;
  upiId: string;
  merchantName: string;
  enableRazorpay: boolean;
  enableDirectUpi: boolean;
  supportPhone: string;
  supportEmail: string;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  razorpayKeyId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) || 'rzp_live_ThljE1Bf73fysn',
  upiId: 'jatingaatours@upi',
  merchantName: 'Jatingaa Tours Pvt Ltd',
  enableRazorpay: true,
  enableDirectUpi: true,
  supportPhone: '+91 69135 14367',
  supportEmail: 'senapatibhaskar6@gmail.com',
};

const STORAGE_KEY = 'jatingaa_payment_config_v1';

export function getPaymentConfig(): PaymentConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PAYMENT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.error('Failed to parse payment config:', err);
  }
  return DEFAULT_PAYMENT_CONFIG;
}

export function savePaymentConfig(config: Partial<PaymentConfig>): PaymentConfig {
  const current = getPaymentConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save payment config:', err);
  }
  return updated;
}
