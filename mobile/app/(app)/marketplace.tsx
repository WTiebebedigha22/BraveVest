import { useState, useMemo } from 'react';
import { ScrollView, Text, View, Pressable, RefreshControl, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProjects } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

const TOP_TABS = ['Overview', 'Watchlist', 'Opportunities', 'Sectors'];
const SUB_CHIPS = ['All', 'Real Estate', 'Agri', 'Energy', 'SME', 'Infrastructure'];
const SORT_OPTIONS = ['Vol', 'Return', 'Recent', 'Min'];

export default function Marketplace() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const { data, loading, error, refetch } = useProjects();

  const [topTab, setTopTab] = useState('Opportunities');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('Vol');

  const projects = useMemo(() => {
    let out = data ?? [];
    if (cat !== 'All') out = out.filter((p) => p.category === cat);
    if (q) out = out.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'Return') out = [...out].sort((a, b) => Number(b.targetReturn ?? 0) - Number(a.targetReturn ?? 0));
    if (sort === 'Min') out = [...out].sort((a, b) => Number(a.minimumAmount ?? 0) - Number(b.minimumAmount ?? 0));
    return out;
  }, [data, cat, q, sort]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Search bar */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 42, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: 21 }}>
          <Feather name="search" size={17} color={colors.textSecondary} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search opportunities"
            placeholderTextColor={colors.textSecondary}
            style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, paddingVertical: 0 }}
          />
          {q ? <Pressable onPress={() => setQ('')}><Feather name="x" size={16} color={colors.textSecondary} /></Pressable> : null}
          <Feather name="sliders" size={16} color={colors.textSecondary} />
        </View>
      </View>

      {/* Top tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
        {TOP_TABS.map((t) => {
          const active = topTab === t;
          return (
            <Pressable key={t} onPress={() => setTopTab(t)}>
              <Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 16, fontWeight: active ? '700' : '500' }}>
                {t}
              </Text>
              {active ? <View style={{ height: 2, backgroundColor: colors.textPrimary, borderRadius: 2, marginTop: 4 }} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Sub-chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg }}>
        {SUB_CHIPS.map((c) => {
          const active = cat === c;
          return (
            <Pressable
              key={c}
              onPress={() => setCat(c)}
              style={{
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
                backgroundColor: active ? colors.textPrimary : colors.surfaceMuted,
              }}
            >
              <Text style={{ color: active ? colors.background : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Sort row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
        {SORT_OPTIONS.map((s) => {
          const active = sort === s;
          return (
            <Pressable key={s} onPress={() => setSort(s)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: active ? '700' : '500' }}>{s}</Text>
              {active ? <Feather name="chevron-down" size={12} color={colors.textPrimary} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Column header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' }}>Opportunity / Sector</Text>
        <Text style={{ width: 80, textAlign: 'right', color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' }}>Min</Text>
        <Text style={{ width: 70, textAlign: 'right', color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' }}>Return</Text>
      </View>

      {/* List */}
      {loading && projects.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.lime} />
        </View>
      ) : error ? (
        <View style={{ padding: spacing.xl, alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600' }}>Couldn't load</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, textAlign: 'center' }}>{error.message}</Text>
        </View>
      ) : projects.length === 0 ? (
        <View style={{ padding: spacing.xl, alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600' }}>No opportunities match</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={loading && projects.length > 0} onRefresh={refetch} tintColor={colors.lime} />}
          renderItem={({ item: p }) => {
            const target = typeof p.targetReturn === 'number' ? p.targetReturn : parseFloat(String(p.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
            const min = Number(p.minimumAmount ?? 0);
            return (
              <Pressable
                onPress={() => router.push(`/(app)/project/${p.slug}`)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>{(p.category?.[0] ?? 'P').toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{p.title}</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 3 }} numberOfLines={1}>
                    {p.category?.replace('_', ' ') ?? '—'}
                  </Text>
                </View>
                <View style={{ width: 80, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }} numberOfLines={1}>
                    {format(min)}
                  </Text>
                </View>
                <View style={{ width: 70, alignItems: 'flex-end' }}>
                  <View style={{ backgroundColor: colors.lime + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                    <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>{target.toFixed(1)}%</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
