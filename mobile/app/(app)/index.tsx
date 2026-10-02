import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Card } from '@/components/ui/Card';
import { QuickAction } from '@/components/ui/QuickAction';
import { colors, fonts, radii, spacing, shadows, gradients } from '@/theme/tokens';

const SAMPLE_PORTFOLIO_NGN = 1_250_000;
const SAMPLE_CHANGE_PCT = 4.2;

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, convert } = useCurrency();

  const firstName = user?.email?.split('@')[0]?.split('.')[0] ?? 'Investor';
  const portfolio = convert(SAMPLE_PORTFOLIO_NGN);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetSub}>Good morning,</Text>
            <Text style={styles.greetName}>{firstName}</Text>
          </View>
          <Pressable style={styles.avatar} onPress={() => router.push('/(app)/profile')}>
            <Text style={styles.avatarText}>{firstName[0]?.toUpperCase()}</Text>
          </Pressable>
        </View>

        <LinearGradient colors={[...gradients.hero]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.heroLabel}>Portfolio value</Text>
          <Text style={styles.heroValue}>
            {currency} {portfolio.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <View style={styles.heroChange}>
            <Text style={styles.heroChangeText}>▲ {SAMPLE_CHANGE_PCT}% this month</Text>
          </View>
          <Pressable style={styles.heroCta} onPress={() => router.push('/(app)/portfolio')}>
            <Text style={styles.heroCtaText}>View portfolio</Text>
          </Pressable>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsRow}>
          <QuickAction icon="◈" label="Discover" color={colors.lime} onPress={() => router.push('/(app)/marketplace')} />
          <QuickAction icon="↗" label="Withdraw" color={colors.teal} onPress={() => {}} />
          <QuickAction icon="＋" label="Top up" color={colors.lavender} onPress={() => {}} />
          <QuickAction icon="◎" label="Profile" color={colors.lime} onPress={() => router.push('/(app)/profile')} />
        </View>

        <Text style={styles.sectionTitle}>Spotlight</Text>
        <Card variant="elevated" style={styles.spotlight}>
          <Text style={styles.spotlightLabel}>Featured opportunity</Text>
          <Text style={styles.spotlightTitle}>Lagos Solar Fund II</Text>
          <Text style={styles.spotlightBody}>14.5% target return · 18-month lock · ₦500k minimum</Text>
          <Pressable style={styles.spotlightCta} onPress={() => router.push('/(app)/marketplace')}>
            <Text style={styles.spotlightCtaText}>Browse all</Text>
          </Pressable>
        </Card>

        <Text style={styles.sectionTitle}>Recent activity</Text>
        <Card style={styles.activity}>
          <ActivityRow label="Investment" detail="Lagos Solar Fund" amount="-₦250,000" />
          <Divider />
          <ActivityRow label="Payout" detail="Real Estate Note" amount="+₦18,400" positive />
          <Divider />
          <ActivityRow label="Top up" detail="Wallet" amount="+₦100,000" positive />
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityRow({ label, detail, amount, positive }: { label: string; detail: string; amount: string; positive?: boolean }) {
  return (
    <View style={styles.activityRow}>
      <View>
        <Text style={styles.activityLabel}>{label}</Text>
        <Text style={styles.activityDetail}>{detail}</Text>
      </View>
      <Text style={[styles.activityAmount, positive && { color: colors.lime }]}>{amount}</Text>
    </View>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { padding: spacing.lg, paddingTop: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greetSub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 14 },
  greetName: { color: colors.white, fontFamily: fonts.serif, fontSize: 26, marginTop: 2 },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.inkCard,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line + '22',
  },
  avatarText: { color: colors.lime, fontFamily: fonts.serif, fontSize: 20 },
  hero: { borderRadius: radii.card, padding: spacing.xl, marginBottom: spacing.xl, ...shadows.card },
  heroLabel: { color: colors.ink, fontFamily: fonts.sans, fontSize: 13, opacity: 0.7 },
  heroValue: { color: colors.ink, fontFamily: fonts.serif, fontSize: 34, marginTop: spacing.sm },
  heroChange: {
    alignSelf: 'flex-start', marginTop: spacing.md,
    backgroundColor: colors.ink + '22', paddingHorizontal: spacing.md,
    paddingVertical: 6, borderRadius: radii.pill,
  },
  heroChangeText: { color: colors.ink, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' },
  heroCta: {
    alignSelf: 'flex-start', marginTop: spacing.lg, backgroundColor: colors.ink,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.pill,
  },
  heroCtaText: { color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: colors.white, fontFamily: fonts.serif, fontSize: 18, marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  spotlight: { marginBottom: spacing.xl },
  spotlightLabel: { color: colors.teal, fontFamily: fonts.sans, fontSize: 12, letterSpacing: 0.5 },
  spotlightTitle: { color: colors.white, fontFamily: fonts.serif, fontSize: 22, marginTop: spacing.sm },
  spotlightBody: { color: colors.muted, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm },
  spotlightCta: {
    alignSelf: 'flex-start', marginTop: spacing.lg, borderWidth: 1, borderColor: colors.lime,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill,
  },
  spotlightCtaText: { color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' },
  activity: { marginBottom: spacing.xl },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityLabel: { color: colors.white, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' },
  activityDetail: { color: colors.muted, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 },
  activityAmount: { color: colors.white, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.line + '15', marginVertical: spacing.md },
});
