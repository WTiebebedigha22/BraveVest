export const colors = {
  ink: '#0F0F10',
  inkSoft: '#1A1A1C',
  inkCard: '#202024',
  lime: '#B3D941',
  teal: '#3FB8C4',
  lavender: '#C9A6F2',
  muted: '#6B6B6B',
  line: '#E5E5E5',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const fonts = {
  serif: 'PlayfairDisplay',
  sans: 'Inter',
} as const;

export const radii = {
  card: 28,
  pill: 999,
  icon: 20,
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
} as const;

export const gradients = {
  hero: ['#B3D941', '#3FB8C4'] as const,
  heroSubtle: ['#1A1A1C', '#0F0F10'] as const,
  lavender: ['#C9A6F2', '#3FB8C4'] as const,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const currencies = ["NGN","ZAR","USD","GBP","EUR"] as const;
export type Currency = (typeof currencies)[number];
