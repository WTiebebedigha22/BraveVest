import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMe, usePortfolio, usePortfolioSeries, useFundingList } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Sparkline } from '@/components/ui/Sparkline';
import { FundingCard } from '@/components/ui/FundingCard';
import { fonts, radii, spacing } from '@/theme/tokens';

const CATEGORIES = ['All', 'Solar', 'Real Estate', 'Agri', 'SME'];

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format, currency } = useCurrency();

  const { data: me } = useMe();
  const { data: portfolio } = usePortfolio();
  const { data: series } = usePortfolioSeries();
  const { data: funding, loading } = useFundingList();

  const firstName = me?.firstName || 'Investor';
  const total = Number(portfolio?.currentValue ?? 0);
  const change = Number(portfolio?.totalReturns ?? 0);
  const changePct = total > 0 ? (change / total) * 100 : 0;
  const sparkPoints = (series ?? []).map((p) => p.value);
  const featured = (funding ?? []).slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* ── Header: avatar · search · utilities ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable
            onPress={() => router.push('/(app)/profile')}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
              {firstName[0]?.toUpperCase() ?? '·'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(app)/marketplace')}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: 20 }}
          >
            <Text style={{ fontSize: 15 }}>🔍</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>Search</Text>
          </Pressable>

          <Pressable style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: colors.textPrimary }}>◫</Text>
          </Pressable>
        </View>

        {/* ── Category chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
          {CATEGORIES.map((c, i) => {
            const active = i === 0;
            return (
              <View
                key={c}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
                  backgroundColor: active ? colors.textPrimary : colors.surfaceMuted,
                }}
              >
                <Text style={{ color: active ? colors.background : colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>
                  {c}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* ── Portfolio value + Deposit CTA ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Portfolio value</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 36, fontWeight: '700', letterSpacing: -0.5 }} numberOfLines={1}>
                  {format(total, { decimals: 2 })}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Today's P&L</Text>
                <Text style={{ color: changePct >= 0 ? colors.lime : colors.lavender, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
                  {changePct >= 0 ? '+' : ''}{format(change, { decimals: 2 })} ({changePct.toFixed(2)}%)
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/(app)/funding')}
              style={{ backgroundColor: colors.lime, paddingHorizontal: spacing.lg, paddingVertical: 12, borderRadius: 999, marginLeft: spacing.md }}
            >
              <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>Invest</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Chart ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          {sparkPoints.length > 1 ? (
            <Sparkline points={sparkPoints} height={120} color={colors.lime} />
          ) : (
            <View style={{ height: 120, borderRadius: radii.card, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>No chart data yet</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
            {['7D', '30D', '90D', '180D'].map((t, i) => (
              <View key={t} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: i === 0 ? colors.surfaceMuted : 'transparent' }}>
                <Text style={{ color: i === 0 ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick actions ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <QuickAction icon="◈" label="Discover" onPress={() => router.push('/(app)/marketplace')} />
          <QuickAction icon="＋" label="Funding" onPress={() => router.push('/(app)/funding')} />
          <QuickAction icon="◉" label="Portfolio" onPress={() => router.push('/(app)/portfolio')} />
          <QuickAction icon="⋯" label="More" onPress={() => router.push('/(app)/profile')} />
        </View>

        {/* ── Promo banner ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
            <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: colors.lime + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>◈</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Featured
              </Text>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600', marginTop: 4, lineHeight: 19 }}>
                New to investing? Start with {format(5000)} in the Starter Pool.
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 20 }}>›</Text>
          </View>
        </View>

        {/* ── Sector tiles ── */}
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <SectorTile title="Solar" tag="Lagos" change="+14.5%" onPress={() => router.push('/(app)/funding')} />
          <SectorTile title="Real Estate" tag="Abuja" change="+12.0%" onPress={() => router.push('/(app)/funding')} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <SectorTile title="Agriculture" tag="Ogun" change="+14.0%" onPress={() => router.push('/(app)/funding')} />
          <SectorTile title="SME" tag="Lagos" change="+16.5%" onPress={() => router.push('/(app)/funding')} />
        </View>

        {/* ── Featured funding ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700' }}>Open opportunities</Text>
          <Pressable onPress={() => router.push('/(app)/funding')}>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>See all</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          {loading ? (
            <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
          ) : featured.length === 0 ? (
            <View style={{ padding: spacing.lg, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>No published opportunities yet.</Text>
            </View>
          ) : (
            featured.map((r) => (
              <FundingCard key={r.id} request={r} onPress={() => router.push(`/(app)/funding/${r.id}`)} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', flex: 1 }}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, color: colors.textPrimary }}>{icon}</Text>
      </View>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' }} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectorTile({ title, tag, change, onPress }: { title: string; tag: string; change: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted, gap: 10 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 15 }}>›</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.lime }} />
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{tag}</Text>
        </View>
        <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>{change}</Text>
      </View>
    </Pressable>
  );
}