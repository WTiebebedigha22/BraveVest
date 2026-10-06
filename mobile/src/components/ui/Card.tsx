import { View, ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, shadows, spacing } from '@/theme/tokens';

type Variant = 'default' | 'elevated' | 'outline';
export function Card({ variant = 'default', style, children, ...rest }: ViewProps & { variant?: Variant }) {
  const { colors } = useTheme();
  return (
    <View style={[
      { borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
      variant === 'elevated' && shadows.card,
      variant === 'outline' && { backgroundColor: 'transparent' },
      style,
    ]} {...rest}>
      {children}
    </View>
  );
}
