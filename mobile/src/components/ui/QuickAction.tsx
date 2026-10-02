import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/theme/tokens';

export function QuickAction({
  icon, label, color = colors.lime, onPress,
}: { icon: string; label: string; color?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.wrap} android_ripple={{ color: color + '33' }}>
      <View style={[styles.ring, { borderColor: color + '44' }]}>
        <View style={[styles.disc, { backgroundColor: color + '22' }]}>
          <Text style={[styles.glyph, { color }]}>{icon}</Text>
        </View>
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 76 },
  ring: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  disc: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontSize: 20, fontFamily: fonts.sans, fontWeight: '600' },
  label: { marginTop: spacing.sm, color: colors.white, fontSize: 12, fontFamily: fonts.sans, textAlign: 'center' },
});
