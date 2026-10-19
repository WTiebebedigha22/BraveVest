import { useState } from 'react';
import { ScrollView, Text, View, Pressable, RefreshControl, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFundingList } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, spacing } from '@/theme/tokens';

const SUBCHIPS = ['All', 'Real Estate', 'Agri', 'Energy', 'SME', 'Infrastructure'];

export default function FundingMarketplace() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const { data, loading, error, refetch } = useFundingList({
    category: cat === 'All' ? undefined : cat.toUpperCase().replace(' ', '_'),
    q: q || undefined,
  });
  const items = data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Opportunities</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 42, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: 21 }}>
          <Feather name="search" size={17} color={colors.textSecondary} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search requests"
            placeholderTextColor={colors.textSecondary}
            style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, paddingVertical: 0 }}
          />
          {q ? <Pressable onPress={() => setQ('')}><Feather name="x" size={16} color={colors.textSecondary} /></Pressable> : null}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
        {SUBCHIPS.map((c) => {
          const active = cat === c;
          return (
            <Pressable key={c} onPress={() => setCat(c)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: active ? colors.textPrimary : colors.surfaceMuted }}>
              <Text style={{ color: active ? colors.background : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && items.length > 0} onRefresh={refetch} tintColor={colors.lime} />}
      >
        {loading && items.length === 0 ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        ) : error ? (
          <EmptyState title="Couldn't load" body={error.message} />
        ) : items.length === 0 ? (
          <EmptyState title="No requests match" body="Try a different filter." />
        ) : (
          items.map((r) => {
            const requested = Number(r.amountRequested ?? 0);
            const funded = Number(r.amountFunded ?? 0);
            const pct = requested > 0 ? Math.round((funded / requested) * 100) : 0;
            const target = r.proposedReturnPct != null ? Number(r.proposedReturnPct) : null;
            return (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/(app)/funding/${r.id}`)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{(r.category?.[0] ?? 'F').toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{r.title}</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 3 }}>{pct}% funded · {r.durationMonths ?? '—'}mo</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{format(requested)}</Text>
                  {target != null ? <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>{target.toFixed(1)}%</Text> : null}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
