export type Palette = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderStrong: string;
  lime: string;
  limeSoft: string;
  teal: string;
  tealSoft: string;
  lavender: string;
  lavenderSoft: string;
  success: string;
  warning: string;
  danger: string;
  onAccent: string;
  heroGradient: readonly [string, string];
  heroText: string;
  scrim: string;
};

export const darkColors: Palette = {
  background: '#0F0F10',
  surface: '#16161A',
  surfaceElevated: '#1C1C22',
  surfaceMuted: '#121215',
  textPrimary: '#FFFFFF',
  textSecondary: '#9A9AA5',
  textTertiary: '#6B6B6B',
  border: '#26262E',
  borderStrong: '#33333D',
  lime: '#B3D941',
  limeSoft: '#B3D94122',
  teal: '#3FB8C4',
  tealSoft: '#3FB8C422',
  lavender: '#C9A6F2',
  lavenderSoft: '#C9A6F222',
  success: '#B3D941',
  warning: '#F5A623',
  danger: '#E5484D',
  onAccent: '#0F0F10',
  heroGradient: ['#B3D941', '#3FB8C4'] as const,
  heroText: '#0F0F10',
  scrim: '#000000cc',
};

export const lightColors: Palette = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F0F2F5',
  textPrimary: '#0F0F10',
  textSecondary: '#6B6B6B',
  textTertiary: '#9A9AA5',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  lime: '#7A9B22',
  limeSoft: '#B3D94133',
  teal: '#2A8C96',
  tealSoft: '#3FB8C433',
  lavender: '#7A5FB0',
  lavenderSoft: '#C9A6F233',
  success: '#5E8F1E',
  warning: '#B8791A',
  danger: '#C0363A',
  onAccent: '#FFFFFF',
  heroGradient: ['#B3D941', '#3FB8C4'] as const,
  heroText: '#0F0F10',
  scrim: '#00000066',
};
