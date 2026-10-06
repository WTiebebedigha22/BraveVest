import { Palette, darkColors, lightColors } from './palettes';

export { darkColors, lightColors };
export type { Palette };

export const colors = darkColors;

export const fonts = {
  serif: 'PlayfairDisplay',
  sans: 'Inter',
} as const;

export const radii = {
  card: 24,
  button: 14,
  chip: 999,
  pill: 999,
  icon: 20,
  input: 14,
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 20, xl: 28, xxl: 40,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const currencies = ["NGN","ZAR","USD","GBP","EUR"] as const;
export type Currency = (typeof currencies)[number];

export type ThemeMode = 'system' | 'light' | 'dark';
