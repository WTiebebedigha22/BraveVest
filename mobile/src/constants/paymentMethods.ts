import { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

export type PaymentMethodId = 'card' | 'bank_transfer' | 'apple_pay' | 'google_pay';

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  sub: string;
  icon: ComponentProps<typeof Feather>['name'];
  enabled: boolean;
  note?: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    label: 'Card',
    sub: 'Visa, Mastercard, Verve',
    icon: 'credit-card',
    enabled: true,
  },
  {
    id: 'bank_transfer',
    label: 'Bank transfer',
    sub: 'Instant transfer via Paystack',
    icon: 'repeat',
    enabled: true,
  },
  {
    id: 'apple_pay',
    label: 'Apple Pay',
    sub: 'Face ID or Touch ID',
    icon: 'smartphone',
    enabled: false,
    note: 'Setting up',
  },
  {
    id: 'google_pay',
    label: 'Google Pay',
    sub: 'Pay with saved cards',
    icon: 'smartphone',
    enabled: false,
    note: 'Setting up',
  },
];

export const MIN_DEPOSIT_USD = 10;

// Approximate USD conversion for the minimum check.
// Real conversion uses the /api/currency/rates endpoint.
export const USD_RATES: Record<string, number> = {
  NGN: 1 / 1550,
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  ZAR: 1 / 18,
  KES: 1 / 129,
  GHS: 1 / 15,
};
