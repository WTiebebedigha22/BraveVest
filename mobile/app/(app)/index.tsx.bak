import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMe, usePortfolio, useMyCommitments, useFundingList } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { IconPill } from '@/components/ui/IconPill';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { FundingCard } from '@/components/ui/FundingCard';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();

  const { data: me } = useMe();
  const { data: portfolio } = usePortfolio();
  const { data: commitments } = useMyCommitments();
  const { data: funding, loading: fundingLoading } = useFundingList();

  const firstName = me?.firstName || (me?.email ? me.email.split('@')[0].split('.')[0] : 'Investor');
  const totalValue = Number(portfolio?.currentValue ?? 0);
  const hasPortfolio = (portfolio?.itemCount ?? 0) > 0;

  const featured = (funding ?? []).slice(0, 2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <View>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Good morning,</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 2 }}>
              {firstName}
            </Text>
          </View>
          <Pressable
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
            onPress={() => router.push('/(app)/profile')}
          >
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>
              {firstName[0]?.toUpperCase() ?? '·'}
            </Text>
          </Pressable>
        </View>

        <LinearGradient colors={[...colors.heroGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radii.card, padding: spacing.xl, marginBottom: spacing.xl, ...shadows.card }}>
          <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 13, opacity: 0.75 }}>Portfolio value</Text>
          <Text style={{ color: colors.heroText, fontFamily: fonts.serif, fontSize: 36, marginTop: spacing.sm }}>
            {format(totalValue)}
          </Text>
          {hasPortfolio ? (
            <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.md, opacity: 0.85 }}>
              {portfolio?.itemCount} holding{portfolio?.itemCount === 1 ? '' : 's'}
              {commitments && commitments.length > 0 ? ` · ${commitments.length} commitment${commitments.length === 1 ? '' : 's'}` : ''}
            </Text>
          ) : (
            <Pressable onPress={() => router.push('/(app)/funding')} style={{ alignSelf: 'flex-start', marginTop: spacing.lg, backgroundColor: colors.heroText, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.button }}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>Browse funding</Text>
            </Pressable>
          )}
        </LinearGradient>

        <SectionHeader title="Quick actions" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl }}>
          <IconPill icon="◈" label="Discover" color={colors.lime} onPress={() => router.push('/(app)/marketplace')} />
          <IconPill icon="◎" label="Funding" color={colors.teal} onPress={() => router.push('/(app)/funding')} />
          <IconPill icon="◇" label="Credit" color={colors.lavender} onPress={() => router.push('/(app)/credit')} />
          <IconPill icon="◉" label="Profile" color={colors.lime} onPress={() => router.push('/(app)/profile')} />
        </View>

        <SectionHeader title="Featured funding" action="See all" onAction={() => router.push('/(app)/funding')} />
        {fundingLoading ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        ) : featured.length === 0 ? (
          <Card><Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>No published opportunities yet.</Text></Card>
        ) : (
          featured.map((r) => (
            <FundingCard key={r.id} request={r} onPress={() => router.push(`/(app)/funding/${r.id}`)} />
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
