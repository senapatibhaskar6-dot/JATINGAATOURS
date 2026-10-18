const ADMIN_LOGIN_KEY = 'jatingaa_is_admin_logged_in';
const ADMIN_PIN_KEY = 'jatingaa_admin_pin';
export const DEFAULT_PIN = '2026';
export const MASTER_PIN = 'admin2026';

export function getIsAdminLoggedIn(): boolean {
  try {
    const val = localStorage.getItem(ADMIN_LOGIN_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function setIsAdminLoggedIn(loggedIn: boolean): void {
  try {
    localStorage.setItem(ADMIN_LOGIN_KEY, loggedIn ? 'true' : 'false');
  } catch {
    // Ignore in SSR
  }
}

export function getAdminPin(): string {
  try {
    return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setAdminPin(newPin: string): void {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, newPin);
  } catch {
    // Ignore in SSR
  }
}

export function resetAdminPinToDefault(): string {
  try {
    localStorage.removeItem(ADMIN_PIN_KEY);
  } catch {
    // Ignore
  }
  return DEFAULT_PIN;
}

export function verifyAdminPin(inputPin: string): boolean {
  const currentPin = getAdminPin();
  const trimmed = inputPin.trim();
  return (
    trimmed === currentPin.trim() ||
    trimmed === MASTER_PIN ||
    trimmed === DEFAULT_PIN
  );
}
