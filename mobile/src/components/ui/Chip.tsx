import { Pressable, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.chip,
      borderWidth: 1, borderColor: active ? colors.lime : colors.border,
      backgroundColor: active ? colors.lime : 'transparent',
    }}>
      <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
