import { ScrollView, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { IconPill } from '@/components/ui/IconPill';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

const SAMPLE_TOTAL_NGN = 8_786_550;
const SAMPLE_CHANGE_PCT = 2.35;

const CATEGORIES = [
  { label: 'Solar', icon: '☀', color: 'lime' as const },
  { label: 'Real Estate', icon: '⌂', color: 'teal' as const },
  { label: 'Agri', icon: '❦', color: 'lavender' as const },
  { label: 'SME', icon: '◈', color: 'lime' as const },
];

const WATCHLIST_FILTERS = ['All', 'Solar', 'Real Estate', 'Agri'];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const firstName = user?.email?.split('@')[0]?.split('.')[0] ?? 'Investor';
  const total = convert(SAMPLE_TOTAL_NGN);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>

        {/* Greeting row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <View>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Good morning,</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 2 }}>{firstName}</Text>
          </View>
          <Pressable
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
            onPress={() => router.push('/(app)/profile')}
          >
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>{firstName[0]?.toUpperCase()}</Text>
          </Pressable>
        </View>

        {/* Total asset value — kit's headline section */}
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Total asset value</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 38, lineHeight: 44 }} numberOfLines={1}>
              {currency} {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm }}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>↑ {SAMPLE_CHANGE_PCT}%</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>(+1.50%) from last week</Text>
            </View>
          </View>
          <Pressable
            style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => router.push('/(app)/portfolio')}
          >
            <Text style={{ color: colors.lime, fontSize: 22 }}>▤</Text>
          </Pressable>
        </View>

        {/* My Portfolio — kit's stacked cards */}
        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="My Portfolio" action="See all" onAction={() => router.push('/(app)/portfolio')} />
          <View style={{ borderRadius: radii.card, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ backgroundColor: colors.surface, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.tealSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.teal, fontSize: 20 }}>◎</Text>
                </View>
                <View>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Solar</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>3 holdings</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
                  {currency} {convert(4_500_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginTop: 2 }}>▲ 0.24%</Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.lime, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.onAccent + '1F', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.onAccent, fontSize: 20 }}>⌂</Text>
                </View>
                <View>
                  <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Real Estate</Text>
                  <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 12, marginTop: 2, opacity: 0.8 }}>2 holdings</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
                  {currency} {convert(2_800_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
                <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginTop: 2, opacity: 0.85 }}>▼ 1.35%</Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.surface, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Profits</Text>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
                  {currency} {convert(1_486_550).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <Pressable
                style={{ backgroundColor: colors.lime, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.button }}
                onPress={() => router.push('/(app)/marketplace')}
              >
                <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Invest</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Category pills */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl }}>
          {CATEGORIES.map((c) => {
            const col = c.color === 'lime' ? colors.lime : c.color === 'teal' ? colors.teal : colors.lavender;
            return <IconPill key={c.label} icon={c.icon} label={c.label} color={col} onPress={() => router.push('/(app)/marketplace')} />;
          })}
        </View>

        {/* Watchlist */}
        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="Watchlist" action="Edit watchlist" onAction={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, marginBottom: spacing.md }}>
            {WATCHLIST_FILTERS.map((f, i) => <Chip key={f} label={f} active={i === 0} />)}
          </ScrollView>

          <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>₦</Text>
              </View>
              <View>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Lagos Solar Fund II</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>14.5% target · 18mo</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
                {currency} {convert(500_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>▲ 0.35%</Text>
            </View>
          </Card>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
