import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

export function IconPill({ icon, label, color, onPress }: { icon: string; label: string; color?: string; onPress?: () => void }) {
  const { colors } = useTheme();
  const c = color ?? colors.lime;
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', flex: 1 }} android_ripple={{ color: c + '22' }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c + '1F', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, color: c, fontFamily: fonts.sans, fontWeight: '700' }}>{icon}</Text>
      </View>
      <Text style={{ marginTop: spacing.sm, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 12, textAlign: 'center' }} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}
