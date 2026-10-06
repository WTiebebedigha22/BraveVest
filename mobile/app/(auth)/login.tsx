import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('investor@demo.bravevest.test');
  const [password, setPassword] = useState('DemoPass123!');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (busy) return;
    setBusy(true);
    try { await login(email.trim(), password); router.replace('/(app)'); }
    catch (e: any) { Alert.alert('Login failed', e?.response?.data?.message ?? e?.message ?? 'Unknown error'); }
    finally { setBusy(false); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'center' }}>
      <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 40 }}>BraveVest</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.xxl }}>Invest in what matters.</Text>

      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: spacing.sm }}>Email</Text>
      <TextInput style={{ backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, borderWidth: 1, borderColor: colors.border }} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={colors.textTertiary} />

      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.md, marginBottom: spacing.sm }}>Password</Text>
      <TextInput style={{ backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, borderWidth: 1, borderColor: colors.border }} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.textTertiary} />

      <Button label="Sign in" onPress={onSubmit} loading={busy} full style={{ marginTop: spacing.xl }} />
      <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: spacing.lg, textAlign: 'center' }}>Demo: investor@demo.bravevest.test · DemoPass123!</Text>
    </View>
  );
}
