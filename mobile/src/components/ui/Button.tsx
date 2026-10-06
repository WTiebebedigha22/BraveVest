import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Props = { label: string; onPress?: () => void; variant?: Variant; loading?: boolean; disabled?: boolean; full?: boolean; style?: ViewStyle };

export function Button({ label, onPress, variant = 'primary', loading, disabled, full, style }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.lime : variant === 'secondary' ? colors.surfaceElevated : 'transparent';
  const fg = variant === 'primary' ? colors.onAccent : variant === 'secondary' ? colors.textPrimary : colors.lime;
  const border = variant === 'secondary' ? colors.border : variant === 'ghost' ? colors.lime : 'transparent';
  return (
    <Pressable onPress={onPress} disabled={disabled || loading}
      style={[styles.base, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'primary' ? 0 : 1 }, full && { alignSelf: 'stretch' }, (disabled || loading) && { opacity: 0.6 }, style]}>
      {loading ? <ActivityIndicator color={fg} /> : <Text style={{ color: fg, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600' }}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radii.button, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
});
