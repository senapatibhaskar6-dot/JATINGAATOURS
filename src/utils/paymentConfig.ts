export interface PaymentConfig {
  cashfreeAppId: string;
  cashfreeEnv: 'production' | 'sandbox';
  upiId: string;
  merchantName: string;
  enableCashfree: boolean;
  enableDirectUpi: boolean;
  supportPhone: string;
  supportEmail: string;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  cashfreeAppId:
    (typeof import.meta !== 'undefined' &&
      ((import.meta as any).env?.VITE_CASHFREE_KEY_ID ||
        (import.meta as any).env?.VITE_CASHFREE_APP_ID)) ||
    '',
  cashfreeEnv: 'production',
  upiId: 'jatingaatours@upi',
  merchantName: 'Jatingaa Tours Pvt Ltd',
  enableCashfree: true,
  enableDirectUpi: true,
  supportPhone: '+91 94361 00000',
  supportEmail: 'partners@jatingaatours.in',
};

const STORAGE_KEY = 'jatingaa_payment_config_v2_cashfree';

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
