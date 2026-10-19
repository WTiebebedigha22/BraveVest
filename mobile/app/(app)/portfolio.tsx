import { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePortfolio, useMyCommitments } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function Portfolio() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const [tab, setTab] = useState<'holdings' | 'commitments'>('holdings');

  const { data: s, loading, error, refetch } = usePortfolio();
  const { data: commitments } = useMyCommitments();

  const total = Number(s?.currentValue ?? 0);
  const invested = Number(s?.totalInvested ?? 0);
  const returns = Number(s?.totalReturns ?? 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!s} onRefresh={refetch} tintColor={colors.lime} />}
      >
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="user" size={16} color={colors.textPrimary} />
            </View>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>Portfolio</Text>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </View>
          <Pressable onPress={() => router.push('/(app)/profile')}>
            <Feather name="menu" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Total */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Total assets</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 34, fontWeight: '700', letterSpacing: -0.5 }} numberOfLines={1}>
              {format(total, { decimals: 2 })}
            </Text>
            <Feather name="chevron-down" size={18} color={colors.textSecondary} />
          </View>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6 }}>
            Today's P&L&nbsp;&nbsp;
            <Text style={{ color: returns >= 0 ? colors.lime : '#C0363A', fontWeight: '700' }}>
              {returns >= 0 ? '+' : ''}{format(returns, { decimals: 2 })}
            </Text>
          </Text>
        </View>

        {/* Two-column available / invested */}
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.xl, gap: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Available</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 4 }} numberOfLines={1}>
              {format(total - invested, { decimals: 2 })}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>In use</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 4 }} numberOfLines={1}>
              {format(invested, { decimals: 2 })}
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          {[
            { icon: 'plus-circle', label: 'Invest', onPress: () => router.push('/(app)/funding') },
            { icon: 'arrow-up-circle', label: 'Withdraw', onPress: () => {} },
            { icon: 'repeat', label: 'Reinvest', onPress: () => {} },
            { icon: 'file-text', label: 'Statement', onPress: () => {} },
            { icon: 'award', label: 'Rewards', onPress: () => {} },
          ].map((a) => (
            <Pressable key={a.label} onPress={a.onPress} style={{ alignItems: 'center', width: 64 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={a.icon as any} size={20} color={colors.textPrimary} />
              </View>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' }}>{a.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: spacing.lg, paddingHorizontal: spacing.lg, marginTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {(['holdings', 'commitments'] as const).map((t) => {
            const active = tab === t;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={{ paddingBottom: spacing.md }}>
                <Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 15, fontWeight: active ? '700' : '500' }}>
                  {t === 'holdings' ? 'Asset' : 'Commitments'}
                </Text>
                {active ? (
                  <View style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: colors.textPrimary, borderRadius: 2 }} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Content */}
        {tab === 'holdings' ? (
          <>
            {loading && !s ? (
              <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
            ) : error ? (
              <EmptyState title="Couldn't load" body={error.message} />
            ) : !s || s.itemCount === 0 ? (
              <EmptyState title="No holdings yet" body="Back a funding request to start building your portfolio." />
            ) : (
              s.items.map((it, i) => {
                const amount = Number(it.amount ?? 0);
                const current = Number(it.currentValue ?? amount);
                const pct = amount > 0 ? ((current - amount) / amount) * 100 : 0;
                return (
                  <View key={it.id ?? i} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
                        {(it.projectTitle?.[0] ?? 'I').toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{it.projectTitle ?? 'Investment'}</Text>
                      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 2 }}>{format(amount)} invested</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>{format(current)}</Text>
                      <Text style={{ color: pct >= 0 ? colors.lime : '#C0363A', fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </>
        ) : (
          <>
            {!commitments || commitments.length === 0 ? (
              <EmptyState title="No commitments yet" body="Back a funding request to start." />
            ) : (
              commitments.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => c.request?.id && router.push(`/(app)/funding/${c.request.id}`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
                      {(c.request?.title?.[0] ?? 'C').toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                      {c.request?.title ?? 'Commitment'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <StatusBadge status={c.status} />
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>{format(c.amount)}</Text>
                    {c.request?.proposedReturnPct != null ? (
                      <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                        {Number(c.request.proposedReturnPct).toFixed(1)}%
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
