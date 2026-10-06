import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

export function EmptyState({ title, body }: { title: string; body?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ padding: spacing.xl, alignItems: 'center' }}>
      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' }}>{title}</Text>
      {body ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: spacing.sm, textAlign: 'center' }}>{body}</Text> : null}
    </View>
  );
}
