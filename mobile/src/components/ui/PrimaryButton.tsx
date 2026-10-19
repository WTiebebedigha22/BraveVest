import { Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export function PrimaryButton({
  label, onPress, loading, disabled, variant = 'primary', style,
}: {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.lime : colors.surfaceMuted;
  const fg = variant === 'primary' ? colors.onAccent : colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: spacing.md,
          borderRadius: radii.button,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
        },
        (disabled || loading) && { opacity: 0.55 },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={fg} />
        : <Text style={{ color: fg, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>{label}</Text>}
    </Pressable>
  );
}
