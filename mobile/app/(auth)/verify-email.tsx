import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { api } from '@/api/client';
import { fonts, spacing } from '@/theme/tokens';

export default function VerifyEmail() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [busy, setBusy] = useState(false);

  async function verify() {
    if (!token) { Alert.alert('Missing token', 'Open the link from your email.'); return; }
    setBusy(true);
    try {
      await api.post('/api/auth/verify-email', { token });
      Alert.alert('Email verified', 'Your account is active.');
      router.replace('/(app)');
    } catch (e: any) {
      Alert.alert('Could not verify', e?.response?.data?.message ?? e?.message);
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, justifyContent: 'center' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.lime + '22', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg }}>
          <Feather name="check-circle" size={28} color={colors.lime} />
        </View>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 30 }}>Verify your email</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 }}>
          {token ? 'Tap below to confirm this email address.' : 'Check your inbox for the verification link.'}
        </Text>

        {token ? (
          <PrimaryButton label={busy ? 'Verifying…' : 'Verify email'} onPress={verify} loading={busy} style={{ marginTop: spacing.xl }} />
        ) : (
          <PrimaryButton label="Back to sign in" onPress={() => router.replace('/(auth)/login')} variant="secondary" style={{ marginTop: spacing.xl }} />
        )}

        <Pressable onPress={() => router.replace('/(auth)/login')} style={{ alignItems: 'center', marginTop: spacing.lg, paddingVertical: spacing.md }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Back to sign in</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
