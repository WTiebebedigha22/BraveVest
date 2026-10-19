import { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFundingList } from '@/api/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import { FundingCard } from '@/components/ui/FundingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, radii, spacing } from '@/theme/tokens';

const CATEGORIES = ['ALL', 'REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];

export default function FundingList() {
  const router = useRouter();
  const { colors } = useTheme();
  const [cat, setCat] = useState('ALL');
  const { data, loading, error, refetch } = useFundingList({ category: cat === 'ALL' ? undefined : cat });
  const items = data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && items.length > 0} onRefresh={refetch} tintColor={colors.lime} />}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Funding</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4, marginBottom: spacing.lg }}>
          Curated opportunities from verified borrowers.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }} contentContainerStyle={{ gap: spacing.sm }}>
          {CATEGORIES.map((c) => {
            const active = cat === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCat(c)}
                style={{
                  paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
                  borderRadius: radii.pill,
                  borderWidth: 1,
                  borderColor: active ? colors.lime : colors.border,
                  backgroundColor: active ? colors.lime : 'transparent',
                }}
              >
                <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>
                  {c === 'ALL' ? 'All' : c.replace('_', ' ')}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading && items.length === 0 ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        ) : error ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
            <EmptyState title="Couldn't load funding" body={error.message} />
            <Pressable onPress={refetch} style={{ marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.lime }}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>Retry</Text>
            </Pressable>
          </View>
        ) : items.length === 0 ? (
          <EmptyState title="No published requests" body="Check back soon." />
        ) : (
          items.map((r) => (
            <FundingCard key={r.id} request={r} onPress={() => router.push(`/(app)/funding/${r.id}`)} />
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
