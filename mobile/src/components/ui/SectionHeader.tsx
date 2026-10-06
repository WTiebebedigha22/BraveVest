import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700' }}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>{action}</Text></Pressable> : null}
    </View>
  );
}
