import { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthInput } from '@/components/ui/AuthInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { api, endpoints } from '@/api/client';
import { fonts, spacing } from '@/theme/tokens';

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Alert.alert('Invalid email', 'Enter a valid email.'); return; }
    setBusy(true);
    try {
      await api.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() }).catch(() => {});
      setSent(true);
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={12} style={{ position: 'absolute', top: 0, left: 0 }}>
              <Feather name="arrow-left" size={22} color={colors.textPrimary} />
            </Pressable>
          </Link>

          {sent ? (
            <>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.lime + '22', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg }}>
                <Feather name="mail" size={28} color={colors.lime} />
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 30 }}>Check your inbox</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 }}>
                If an account exists for {email}, we've sent a link to reset your password.
              </Text>
              <PrimaryButton label="Back to sign in" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: spacing.xl }} />
            </>
          ) : (
            <>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 32 }}>Forgot password</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: 6, marginBottom: spacing.xl, lineHeight: 20 }}>
                Enter the email you signed up with and we'll send a reset link.
              </Text>

              <AuthInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" keyboard="email-address" autoComplete="email" />

              <PrimaryButton label={busy ? 'Sending…' : 'Send reset link'} onPress={onSubmit} loading={busy} style={{ marginTop: spacing.lg }} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
