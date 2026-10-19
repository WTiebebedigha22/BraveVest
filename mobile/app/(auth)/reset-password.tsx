import { useState } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthInput } from '@/components/ui/AuthInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { api } from '@/api/client';
import { fonts, spacing } from '@/theme/tokens';

export default function ResetPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (password.length < 8) { Alert.alert('Weak password', 'At least 8 characters.'); return; }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      Alert.alert('Weak password', 'Include uppercase, lowercase, and a number.');
      return;
    }
    if (password !== confirm) { Alert.alert('Passwords do not match'); return; }
    setBusy(true);
    try {
      await api.post('/api/auth/reset-password', { token, password });
      Alert.alert('Password updated', 'Sign in with your new password.');
      router.replace('/(auth)/login');
    } catch (e: any) {
      Alert.alert('Could not reset', e?.response?.data?.message ?? e?.message);
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 32 }}>New password</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: 6, marginBottom: spacing.xl, lineHeight: 20 }}>
            Choose a strong password you haven't used before.
          </Text>

          <AuthInput label="Password" value={password} onChange={setPassword} placeholder="At least 8 characters" secure autoComplete="new-password" hint="Min 8 chars, with uppercase, lowercase, and a number" />
          <AuthInput label="Confirm password" value={confirm} onChange={setConfirm} placeholder="Repeat password" secure autoComplete="new-password" />

          <PrimaryButton label={busy ? 'Updating…' : 'Update password'} onPress={onSubmit} loading={busy} style={{ marginTop: spacing.lg }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
