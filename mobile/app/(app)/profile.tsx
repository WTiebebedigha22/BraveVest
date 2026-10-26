import { ScrollView, Text, View, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMe, getRoles } from '@/api/hooks';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/context/OnboardingContext';
import { api, endpoints } from '@/api/client';
import { EmptyState } from '@/components/ui/EmptyState';
import { currencies, Currency, ThemeMode, fonts, radii, spacing } from '@/theme/tokens';

function maskEmail(email: string) {
  if (!email || !email.includes('@')) return email || '—';
  const [user, domain] = email.split('@');
  const maskedUser = user.length <= 3 ? user[0] + '**' : user.slice(0, 3) + '***';
  return `${maskedUser}@${'*'.repeat(Math.min(domain.length, 5))}`;
}

function shortId(id?: string) {
  if (!id) return '—';
  return id.slice(0, 8).toUpperCase();
}

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { colors, mode, setMode } = useTheme();
  const { reset: resetOnboarding } = useOnboarding();
  const { data: me, loading, error, refetch } = useMe();

  const email = me?.email ?? user?.email ?? '';
  const name = [me?.firstName, me?.lastName].filter(Boolean).join(' ') || email.split('@')[0] || 'Investor';
  const kyc = me?.kycStatus ?? (user as any)?.kycStatus ?? 'unknown';
  const roles = getRoles(me ?? (user as any));
  const verified = kyc === 'approved';

  async function onLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  async function pickTheme(next: ThemeMode) {
    setMode(next);
    try { await api.patch(endpoints.users.me, { theme: next }); } catch {}
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Top bar ─── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            <Pressable hitSlop={8} onPress={() => Alert.alert('Support', 'Chat coming soon.')}>
              <Feather name="headphones" size={20} color={colors.textPrimary} />
            </Pressable>
            <Pressable hitSlop={8} onPress={() => Alert.alert('Settings', 'More settings coming soon.')}>
              <Feather name="settings" size={20} color={colors.textPrimary} />
            </Pressable>
            <Pressable hitSlop={8} onPress={onLogout}>
              <Feather name="log-out" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {loading && !me ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
            <ActivityIndicator color={colors.lime} />
          </View>
        ) : error ? (
          <>
            <EmptyState title="Couldn't load profile" body={error.message} />
            <Pressable onPress={refetch} style={{ alignSelf: 'center', marginTop: spacing.md, borderWidth: 1, borderColor: colors.lime, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill }}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>Retry</Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* ─── Identity card ─── */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.lime + '33' }}>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>
                  {name[0]?.toUpperCase() ?? '·'}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700' }} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 4 }} numberOfLines={1}>
                  {maskEmail(email)} · UID {shortId(me?.id)}
                </Text>

                <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {verified ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.lime + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                      <Feather name="check" size={11} color={colors.lime} />
                      <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>Verified</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5A62322', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                      <Feather name="clock" size={11} color="#B8791A" />
                      <Text style={{ color: '#B8791A', fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>
                        KYC {String(kyc).replace('_', ' ').toLowerCase()}
                      </Text>
                    </View>
                  )}
                  {roles.map((r) => (
                    <View key={r} style={{ backgroundColor: colors.surfaceMuted, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>{r}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* ─── Promo card ─── */}
            <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: spacing.lg, backgroundColor: colors.surfaceMuted, borderRadius: radii.card }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Feather name="zap" size={14} color={colors.lime} />
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  Starter Pool
                </Text>
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700', lineHeight: 22 }}>
                Diversify across multiple projects from as little as ₦5,000.
              </Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 8, lineHeight: 18 }}>
                A curated bundle — real estate, agriculture, and SME lending. Move up to full projects when you're ready.
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg }}>
                <Pressable onPress={() => router.push('/(app)/funding')}>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Learn more →</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(app)/funding')} style={{ backgroundColor: colors.lime, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 }}>
                  <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Browse now</Text>
                </Pressable>
              </View>
            </View>

            {/* ─── Service grid 2×3 ─── */}
            <SectionLabel label="Your account" />
            <View style={{ flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
              <ServiceCard icon="briefcase" title="Wallet" sub="Balance & activity" onPress={() => router.push('/(app)/wallet')} />
              <ServiceCard icon="clock" title="Obligations" sub="Repayments due" onPress={() => router.push('/(app)/obligations')} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.md }}>
              <ServiceCard icon="plus-circle" title="Deposit" sub="Fund wallet" onPress={() => router.push('/(app)/deposit')} />
              <ServiceCard icon="arrow-up-circle" title="Withdraw" sub="To bank" onPress={() => router.push('/(app)/withdraw')} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.md }}>
              <ServiceCard icon="repeat" title="Reinvest" sub="Roll over returns" onPress={() => router.push('/(app)/reinvest')} />
              <ServiceCard icon="file-text" title="Statements" sub="Download records" onPress={() => router.push('/(app)/statements')} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.md }}>
              <ServiceCard icon="award" title="Rewards" sub="Earn as you invest" onPress={() => router.push('/(app)/rewards')} />
              <ServiceCard icon="send" title="Request funding" sub="Raise capital" onPress={() => router.push('/(app)/request-funding')} />
            </View>

            {/* ─── Preferences ─── */}
            <SectionLabel label="Preferences" />

            <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.md }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: 8 }}>Appearance</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => {
                  const active = m === mode;
                  return (
                    <Pressable
                      key={m}
                      onPress={() => pickTheme(m)}
                      style={{
                        flex: 1, paddingVertical: 12, borderRadius: radii.input, alignItems: 'center',
                        backgroundColor: active ? colors.lime : colors.surfaceMuted,
                        borderWidth: 1, borderColor: active ? colors.lime : colors.border,
                      }}
                    >
                      <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700', textTransform: 'capitalize' }}>
                        {m}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: 8 }}>Currency</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {currencies.map((c) => {
                  const active = c === currency;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setCurrency(c as Currency)}
                      style={{
                        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
                        backgroundColor: active ? colors.lime : colors.surfaceMuted,
                      }}
                    >
                      <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* ─── Account actions ─── */}
            <SectionLabel label="Account" />
            <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.md }}>
              <ActionRow
                icon="shield"
                label="Complete KYC"
                trailing={kyc === 'approved' ? 'Verified' : String(kyc).replace('_', ' ').toLowerCase()}
                onPress={() => Alert.alert('KYC', 'Wizard coming soon.')}
              />
              <ActionRow icon="lock" label="Change password" onPress={() => Alert.alert('Password', 'Coming soon.')} />
              <ActionRow icon="refresh-cw" label="Replay onboarding" onPress={() => { resetOnboarding(); router.replace('/onboarding'); }} />
              <ActionRow icon="log-out" label="Sign out" onPress={onLogout} danger last />
            </View>

            {/* ─── Footer ─── */}
            <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
              <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11 }}>
                BraveVest · v0.4.0
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <Text style={{
      color: colors.textSecondary,
      fontFamily: fonts.sans,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: spacing.lg,
      marginTop: spacing.xl,
    }}>
      {label}
    </Text>
  );
}

function ServiceCard({ icon, title, sub, onPress }: { icon: any; title: string; sub: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        padding: spacing.lg,
        backgroundColor: colors.surfaceMuted,
        borderRadius: radii.card,
        gap: 12,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={icon} size={18} color={colors.lime} />
      </View>
      <View>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>{sub}</Text>
      </View>
    </Pressable>
  );
}

function ActionRow({ icon, label, onPress, danger, trailing, last }: { icon: any; label: string; onPress: () => void; danger?: boolean; trailing?: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Feather name={icon} size={18} color={danger ? '#C0363A' : colors.textPrimary} />
      <Text style={{ flex: 1, color: danger ? '#C0363A' : colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>
        {label}
      </Text>
      {trailing ? (
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{trailing}</Text>
      ) : null}
      <Feather name="chevron-right" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}