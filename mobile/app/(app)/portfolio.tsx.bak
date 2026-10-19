import { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { usePortfolio, usePortfolioSeries, useMyCommitments } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/components/ui/Card';
import { Sparkline } from '@/components/ui/Sparkline';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function Portfolio() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const [tab, setTab] = useState<'holdings' | 'commitments'>('holdings');

  const { data: s, loading, error, refetch } = usePortfolio();
  const { data: series } = usePortfolioSeries();
  const { data: commitments } = useMyCommitments();

  const changePct = s && s.totalInvested > 0 ? ((s.currentValue - s.totalInvested) / s.totalInvested) * 100 : 0;
  const sparkPoints = (series ?? []).map((p) => p.value);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!s} onRefresh={refetch} tintColor={colors.lime} />}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Portfolio</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4, marginBottom: spacing.lg }}>
          Your holdings and performance.
        </Text>

        {/* Tab pills */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          {(['holdings', 'commitments'] as const).map((t) => {
            const active = tab === t;
            return (
              <View key={t} style={{ flex: 1 }}>
                <View style={{ padding: 3, backgroundColor: colors.surfaceMuted, borderRadius: radii.pill }}>
                  <View style={{ backgroundColor: active ? colors.lime : 'transparent', borderRadius: radii.pill, paddingVertical: spacing.sm }}>
                    <Text
                      onPress={() => setTab(t)}
                      style={{ textAlign: 'center', color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}
                    >
                      {t === 'holdings' ? 'Holdings' : 'Commitments'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {tab === 'holdings' ? (
          <>
            {loading && !s ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
            : error ? <EmptyState title="Couldn't load portfolio" body={error.message} />
            : !s || s.itemCount === 0 ? <EmptyState title="No investments yet" body="Head to Discover to find your first opportunity." />
            : (
              <>
                <LinearGradient colors={[...colors.heroGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radii.card, padding: spacing.xl, marginBottom: spacing.lg, ...shadows.card }}>
                  <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 13, opacity: 0.75 }}>Current value</Text>
                  <Text style={{ color: colors.heroText, fontFamily: fonts.serif, fontSize: 34, marginTop: spacing.sm }}>
                    {format(s.currentValue)}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm }}>
                    <View style={{ backgroundColor: colors.heroText + '22', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radii.chip }}>
                      <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>
                        {changePct >= 0 ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
                      </Text>
                    </View>
                    <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, opacity: 0.75 }}>
                      Invested {format(s.totalInvested)}
                    </Text>
                  </View>
                </LinearGradient>

                {sparkPoints.length > 1 ? (
                  <Card style={{ marginBottom: spacing.lg }}>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginBottom: spacing.md }}>
                      Last {sparkPoints.length} periods
                    </Text>
                    <Sparkline points={sparkPoints} height={72} color={colors.teal} />
                  </Card>
                ) : null}

                <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl }}>
                  <Card style={{ flex: 1 }}>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Returns</Text>
                    <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
                      {format(s.totalReturns)}
                    </Text>
                  </Card>
                  <Card style={{ flex: 1 }}>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Holdings</Text>
                    <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
                      {s.itemCount}
                    </Text>
                  </Card>
                </View>

                {s.items.map((it, i) => {
                  const amount = Number(it.amount ?? 0);
                  const current = Number(it.currentValue ?? amount);
                  const pct = amount > 0 ? ((current - amount) / amount) * 100 : 0;
                  return (
                    <Card key={it.id ?? i} style={{ marginBottom: spacing.md }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600', flex: 1, marginRight: spacing.md }} numberOfLines={1}>
                          {it.projectTitle ?? 'Investment'}
                        </Text>
                        <Text style={{ color: pct >= 0 ? colors.lime : colors.lavender, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
                          {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                        </Text>
                      </View>
                    </Card>
                  );
                })}
              </>
            )}
          </>
        ) : (
          <>
            {!commitments || commitments.length === 0 ? (
              <EmptyState title="No commitments yet" body="Back a funding request to start building your portfolio." />
            ) : (
              commitments.map((c) => (
                <Card key={c.id} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
                    <Text
                      onPress={() => c.request?.id && router.push(`/(app)/funding/${c.request.id}`)}
                      style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}
                      numberOfLines={2}
                    >
                      {c.request?.title ?? 'Commitment'}
                    </Text>
                    <StatusBadge status={c.status} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{format(c.amount)}</Text>
                    {c.request?.proposedReturnPct != null ? (
                      <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>
                        {Number(c.request.proposedReturnPct).toFixed(1)}%
                      </Text>
                    ) : null}
                  </View>
                </Card>
              ))
            )}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
