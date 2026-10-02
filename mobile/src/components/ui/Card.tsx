import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing } from '@/theme/tokens';

type Variant = 'default' | 'elevated' | 'outline';

export function Card({ variant = 'default', style, children, ...rest }: ViewProps & { variant?: Variant }) {
  return (
    <View
      style={[
        styles.base,
        variant === 'default' && styles.default,
        variant === 'elevated' && styles.elevated,
        variant === 'outline' && styles.outline,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.card, padding: spacing.lg },
  default: { backgroundColor: colors.inkCard },
  elevated: { backgroundColor: colors.inkCard, ...shadows.card },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line },
});
