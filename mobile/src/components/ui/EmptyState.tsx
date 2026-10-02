import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/theme/tokens';

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.xl, alignItems: 'center' },
  title: { color: colors.white, fontFamily: fonts.serif, fontSize: 18 },
  body: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: spacing.sm, textAlign: 'center' },
});
