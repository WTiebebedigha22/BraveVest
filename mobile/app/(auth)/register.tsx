import { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthInput } from '@/components/ui/AuthInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';

const COUNTRIES = [
  { iso: 'NG', name: 'Nigeria', dial: '234' },
  { iso: 'KE', name: 'Kenya', dial: '254' },
  { iso: 'GH', name: 'Ghana', dial: '233' },
  { iso: 'ZA', name: 'South Africa', dial: '27' },
  { iso: 'GB', name: 'United Kingdom', dial: '44' },
  { iso: 'US', name: 'United States', dial: '1' },
];

function toE164(digits: string, dial: string) {
  const clean = digits.replace(/^0+/, '').replace(/\D/g, '');
  return `+${dial}${clean}`;
}

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'INVESTOR' | 'BORROWER'>('INVESTOR');
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (firstName.trim().length < 2) return 'Enter your first name';
    if (lastName.trim().length < 2) return 'Enter your last name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password needs an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password needs a lowercase letter';
    if (!/\d/.test(password)) return 'Password needs a number';
    if (!accepted) return 'Accept the terms to continue';
    return null;
  }

  async function onSubmit() {
    const v = validate();
    if (v) { setError(v); return; }
    setError(''); setBusy(true);
    try {
      const { api, endpoints } = await import('@/api/client');
      await api.post(endpoints.auth.register, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? toE164(phone, country.dial) : undefined,
        countryIso: country.iso,
        password,
        role,
      });
      await login(email.trim().toLowerCase(), password);
      router.replace('/(kyc)');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Could not create account');
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={12} style={{ marginBottom: spacing.lg }}>
              <Feather name="arrow-left" size={22} color={colors.textPrimary} />
            </Pressable>
          </Link>

          <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 32 }}>Create account</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: 4, marginBottom: spacing.xl }}>
            Start in under 5 minutes.
          </Text>

          {/* Role */}
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>I want to</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
            {[
              { v: 'INVESTOR' as const, label: 'Invest', sub: 'Fund opportunities' },
              { v: 'BORROWER' as const, label: 'Request funding', sub: 'Raise capital' },
            ].map((r) => {
              const active = role === r.v;
              return (
                <Pressable
                  key={r.v}
                  onPress={() => setRole(r.v)}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    borderRadius: radii.card,
                    borderWidth: 1,
                    borderColor: active ? colors.lime : colors.border,
                    backgroundColor: active ? colors.lime + '15' : colors.surfaceMuted,
                  }}
                >
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{r.label}</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 3 }}>{r.sub}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <AuthInput label="First name" value={firstName} onChange={setFirstName} placeholder="Ada" autoComplete="given-name" />
            </View>
            <View style={{ flex: 1 }}>
              <AuthInput label="Last name" value={lastName} onChange={setLastName} placeholder="Obi" autoComplete="family-name" />
            </View>
          </View>

          <AuthInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" keyboard="email-address" autoComplete="email" />

          {/* Country + phone */}
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Phone (optional)</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxWidth: 150 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {COUNTRIES.map((c) => {
                  const active = country.iso === c.iso;
                  return (
                    <Pressable
                      key={c.iso}
                      onPress={() => setCountry(c)}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 14, borderRadius: radii.input,
                        borderWidth: 1, borderColor: active ? colors.lime : colors.border,
                        backgroundColor: active ? colors.lime + '15' : colors.surfaceMuted,
                      }}
                    >
                      <Text style={{ color: active ? colors.lime : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>
                        +{c.dial}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="801 234 5678"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
              style={{
                flex: 1,
                backgroundColor: colors.surfaceMuted,
                color: colors.textPrimary,
                fontFamily: fonts.sans,
                paddingHorizontal: spacing.md,
                borderRadius: radii.input,
                fontSize: 15,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <AuthInput
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            secure
            autoComplete="new-password"
            hint="Min 8 chars, with uppercase, lowercase, and a number"
          />

          <Pressable
            onPress={() => setAccepted((a) => !a)}
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: spacing.sm, marginBottom: spacing.md }}
          >
            <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: accepted ? colors.lime : colors.border, backgroundColor: accepted ? colors.lime : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
              {accepted ? <Feather name="check" size={12} color={colors.onAccent} /> : null}
            </View>
            <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
              I agree to the <Text style={{ color: colors.lime, fontWeight: '700' }}>Terms of Service</Text> and <Text style={{ color: colors.lime, fontWeight: '700' }}>Privacy Policy</Text>.
            </Text>
          </Pressable>

          {error ? <Text style={{ color: '#C0363A', fontFamily: fonts.sans, fontSize: 12, marginBottom: spacing.md }}>{error}</Text> : null}

          <PrimaryButton label={busy ? 'Creating account…' : 'Create account'} onPress={onSubmit} loading={busy} />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={8}>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
