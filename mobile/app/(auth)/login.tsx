import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts, radii, spacing } from '@/theme/tokens';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('investor@demo.bravevest.test');
  const [password, setPassword] = useState('DemoPass123!');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (busy) return;
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace('/(app)');
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message ?? e?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>BraveVest</Text>
      <Text style={styles.tagline}>Invest in what matters.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.muted}
        />

        <Pressable style={styles.cta} onPress={onSubmit} disabled={busy}>
          {busy ? <ActivityIndicator color={colors.ink} /> : <Text style={styles.ctaText}>Sign in</Text>}
        </Pressable>

        <Text style={styles.hint}>Demo: investor@demo.bravevest.test · DemoPass123!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink, padding: spacing.xl, justifyContent: 'center' },
  brand: { color: colors.lime, fontFamily: fonts.serif, fontSize: 40 },
  tagline: { color: colors.muted, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.xxl },
  form: { gap: spacing.sm },
  label: { color: colors.muted, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.md },
  input: {
    backgroundColor: colors.inkCard, color: colors.white, fontFamily: fonts.sans,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: radii.pill, fontSize: 15,
  },
  cta: { backgroundColor: colors.lime, paddingVertical: spacing.md, borderRadius: radii.pill, alignItems: 'center', marginTop: spacing.xl },
  ctaText: { color: colors.ink, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' },
  hint: { color: colors.muted, fontFamily: fonts.sans, fontSize: 11, marginTop: spacing.lg, textAlign: 'center' },
});
