import { ScrollView, Text, View, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMe } from '@/api/hooks';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/context/OnboardingContext';
import { api } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import { currencies, Currency, ThemeMode, fonts, radii, spacing } from '@/theme/tokens';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { colors, mode, setMode } = useTheme();
  const { reset: resetOnboarding } = useOnboarding();
  const { data: me, loading, error, refetch } = useMe();

  const email = me?.email ?? user?.email ?? '—';
  const name = [me?.firstName, me?.lastName].filter(Boolean).join(' ') || email.split('@')[0];
  const kyc = me?.kycStatus ?? user?.kycStatus ?? 'unknown';

  async function onLogout() { await logout(); router.replace('/(auth)/login'); }
  async function pickTheme(next: ThemeMode) { setMode(next); try { await api.patch('/api/users/me', { theme: next }); } catch {} }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700', marginBottom: spacing.lg }}>Profile</Text>

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700' }}>{name[0]?.toUpperCase() ?? '·'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '600' }} numberOfLines={1}>{name}</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 2 }} numberOfLines={1}>{email}</Text>
          </View>
        </Card>

        {loading && !me ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <><EmptyState title="Couldn't load profile" body={error.message} /><Button label="Retry" variant="ghost" onPress={refetch} style={{ alignSelf: 'center', marginTop: spacing.md }} /></>
        : (
          <>
            <SectionHeader title="Account" />
            <Card style={{ marginBottom: spacing.xl }}>
              <Row label="Role" value={me?.role ?? user?.role ?? '—'} />
              <Divider />
              <Row label="KYC status" value={String(kyc)} accent={kyc === 'approved' ? colors.lime : colors.lavender} />
              <Divider />
              <Row label="Phone" value={me?.phone ?? '—'} />
            </Card>

            <SectionHeader title="Appearance" />
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
              {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
                <View key={m} style={{ flex: 1 }}>
                  <Chip label={m[0].toUpperCase() + m.slice(1)} active={m === mode} onPress={() => pickTheme(m)} />
                </View>
              ))}
            </View>

            <SectionHeader title="Currency" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
              {currencies.map((c) => <Chip key={c} label={c} active={c === currency} onPress={() => setCurrency(c as Currency)} />)}
            </View>

            <SectionHeader title="Actions" />
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border }} onPress={() => Alert.alert('KYC', 'Wire to /api/kyc wizard next')}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Complete KYC</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20 }}>›</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border }} onPress={() => Alert.alert('Change password', 'Wire to POST /api/users/change-password')}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Change password</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20 }}>›</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border }} onPress={() => { resetOnboarding(); router.replace('/onboarding'); }}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Replay onboarding</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20 }}>›</Text>
            </Pressable>
            <Button label="Sign out" variant="ghost" onPress={onLogout} full style={{ marginTop: spacing.lg }} />
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />;
}
