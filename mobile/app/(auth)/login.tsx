import { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthInput } from '@/components/ui/AuthInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, spacing } from '@/theme/tokens';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('investor@demo.bravevest.test');
  const [password, setPassword] = useState('DemoPass123!');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit() {
    if (!email.includes('@') || password.length < 6) { setError('Enter a valid email and password'); return; }
    setError('');
    setBusy(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(app)');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Could not sign in');
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 44 }}>BraveVest</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: 4, marginBottom: spacing.xxl }}>
            Sign in to your account.
          </Text>

          <AuthInput
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            keyboard="email-address"
            autoComplete="email"
          />
          <AuthInput
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Your password"
            secure
            autoComplete="password"
          />

          {error ? (
            <Text style={{ color: '#C0363A', fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.sm }}>{error}</Text>
          ) : null}

          <View style={{ alignItems: 'flex-end', marginTop: spacing.sm }}>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable hitSlop={8}>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>Forgot password?</Text>
              </Pressable>
            </Link>
          </View>

          <PrimaryButton label={busy ? 'Signing in…' : 'Sign in'} onPress={onSubmit} loading={busy} style={{ marginTop: spacing.xl }} />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>New to BraveVest? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable hitSlop={8}>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Create account</Text>
              </Pressable>
            </Link>
          </View>

          <Pressable
            onPress={() => Alert.alert('Demo', 'Demo credentials are prefilled. Tap Sign in.')}
            style={{ alignItems: 'center', marginTop: spacing.xxl }}
          >
            <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11 }}>
              Demo: investor@demo.bravevest.test · DemoPass123!
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
