import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '@/theme/tokens';

export default function Profile() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.body}>Coming next — /api/users/me, currency switcher, logout.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { color: colors.lime, fontFamily: fonts.serif, fontSize: 24 },
  body: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: spacing.sm, textAlign: 'center' },
});
