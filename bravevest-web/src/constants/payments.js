export const MIN_DEPOSIT_USD = 10;

export const USD_RATES = {
  NGN: 1 / 1550,
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  ZAR: 1 / 18,
  KES: 1 / 129,
  GHS: 1 / 15,
};

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Card', sub: 'Visa, Mastercard, Verve', icon: 'credit-card', enabled: true },
  { id: 'bank_transfer', label: 'Bank transfer', sub: 'Instant transfer via Paystack', icon: 'repeat', enabled: true },
  { id: 'apple_pay', label: 'Apple Pay', sub: 'Face ID or Touch ID', icon: 'smartphone', enabled: false, note: 'Coming soon' },
  { id: 'google_pay', label: 'Google Pay', sub: 'Pay with saved cards', icon: 'smartphone', enabled: false, note: 'Coming soon' },
];
