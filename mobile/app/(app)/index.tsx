import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMe, usePortfolio, usePortfolioSeries, useFundingList } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Sparkline } from '@/components/ui/Sparkline';
import { fonts, radii, spacing } from '@/theme/tokens';

const CATEGORIES = ['All', 'Solar', 'Real Estate', 'Agri', 'SME', 'Energy'];
const TIMEFRAMES = ['7D', '30D', '90D', '180D'];

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format, currency } = useCurrency();

  const { data: me } = useMe();
  const { data: portfolio } = usePortfolio();
  const { data: series } = usePortfolioSeries();
  const { data: funding, loading: fundingLoading } = useFundingList();

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable
            onPress={() => router.push('/(app)/profile')}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>
              {firstName[0]?.toUpperCase() ?? '·'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(app)/marketplace')}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 38, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: 19 }}
          >
            <Feather name="search" size={16} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Search opportunities</Text>
          </Pressable>

          <Pressable style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="maximize" size={20} color={colors.textPrimary} />
          </Pressable>
          <Pressable onPress={() => router.push('/(app)/profile')} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="bell" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* ── Category chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}>
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

        {/* ── Portfolio value + Invest CTA ── */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Total assets</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 34, fontWeight: '700', letterSpacing: -0.5 }} numberOfLines={1}>
                  {format(total, { decimals: 2 })}
                </Text>
                <Feather name="eye" size={16} color={colors.textSecondary} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Today's P&L</Text>
                <Text style={{ color: changePct >= 0 ? colors.lime : '#C0363A', fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
                  {changePct >= 0 ? '+' : ''}{format(change, { decimals: 2 })} ({changePct.toFixed(2)}%)
                </Text>
                <Feather name={changePct >= 0 ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textSecondary} />
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/(app)/funding')}
              style={{ backgroundColor: colors.lime, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999, marginLeft: spacing.md }}
            >
              <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Invest</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Chart ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          {sparkPoints.length > 1 ? (
            <Sparkline points={sparkPoints} height={130} color={colors.lime} />
          ) : (
            <View style={{ height: 130, borderRadius: radii.card, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>No chart data yet</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.md }}>
            {TIMEFRAMES.map((t, i) => (
              <View key={t} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: i === 0 ? colors.surfaceMuted : 'transparent' }}>
                <Text style={{ color: i === 0 ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick actions ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <QuickAction icon="plus-circle" label="Deposit" onPress={() => router.push('/(app)/deposit')} />
          <QuickAction icon="arrow-up-circle" label="Withdraw" onPress={() => router.push('/(app)/withdraw')} />
          <QuickAction icon="layers" label="Funding" onPress={() => router.push('/(app)/funding')} />
          <QuickAction icon="send" label="Request" onPress={() => router.push('/(app)/request-funding')} />
        </View>

        {/* ── Promo banner ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <Pressable
            onPress={() => router.push('/(app)/funding')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.lime + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="zap" size={22} color={colors.lime} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 10, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                Featured
              </Text>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600', marginTop: 4, lineHeight: 18 }}>
                New to investing? Start with {format(5000)} in the Starter Pool.
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* ── Sector tiles 2×2 ── */}
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <SectorTile title="Solar" tag="Lagos" change="+14.5%" onPress={() => router.push('/(app)/funding')} />
          <SectorTile title="Real Estate" tag="Abuja" change="+12.0%" onPress={() => router.push('/(app)/funding')} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <SectorTile title="Agriculture" tag="Ogun" change="+14.0%" onPress={() => router.push('/(app)/funding')} />
          <SectorTile title="SME" tag="Lagos" change="+16.5%" onPress={() => router.push('/(app)/funding')} />
        </View>

        {/* ── Open opportunities ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700' }}>Open opportunities</Text>
          <Pressable onPress={() => router.push('/(app)/funding')}>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>See all</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          {fundingLoading ? (
            <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
          ) : featured.length === 0 ? (
            <View style={{ padding: spacing.lg, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>No published opportunities yet.</Text>
            </View>
          ) : (
            featured.map((r) => (
              <FundingRow key={r.id} request={r} onPress={() => router.push(`/(app)/funding/${r.id}`)} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', flex: 1 }}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={icon} size={22} color={colors.textPrimary} />
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
    <Pressable onPress={onPress} style={{ flex: 1, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{title}</Text>
        <Feather name="chevron-right" size={16} color={colors.textSecondary} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.lime }} />
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{tag}</Text>
        </View>
        <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>{change}</Text>
      </View>
    </Pressable>
  );
}

function FundingRow({ request, onPress }: { request: any; onPress: () => void }) {
  const { colors } = useTheme();
  const { format } = useCurrency();
  const requested = Number(request.amountRequested ?? 0);
  const funded = Number(request.amountFunded ?? 0);
  const pct = requested > 0 ? Math.round((funded / requested) * 100) : 0;
  const target = request.proposedReturnPct != null ? Number(request.proposedReturnPct) : null;

  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>
          {(request.category?.[0] ?? 'F').toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
          {request.title}
        </Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 3 }}>
          {pct}% funded · {request.durationMonths ?? '—'}mo
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
          {format(requested)}
        </Text>
        {target != null && (
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>
            {target.toFixed(1)}%
          </Text>
        )}
      </View>
    </Pressable>
  );
}
