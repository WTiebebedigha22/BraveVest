import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';

// ────────────────────────────────────────────────────────────
// DEV AUTH BYPASS
// Set EXPO_PUBLIC_DEV_AUTH_BYPASS=0 (or remove) before shipping.
// When on: skip login redirect — jump straight to (app).
// When off: normal behavior — redirect based on session.
// ────────────────────────────────────────────────────────────
const DEV_BYPASS = process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS !== '0';

export default function Index() {
  const { user, loading } = useAuth();

  if (DEV_BYPASS) {
    return <Redirect href="/(app)" />;
  }

  if (loading) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={colors.lime} />
      </View>
    );
  }

  return <Redirect href={user ? '/(app)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});
