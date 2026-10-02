import { ScrollView, Text, View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProject } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function ProjectDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { currency, convert } = useCurrency();
  const { data: project, loading, error } = useProject(String(slug ?? ''));

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.lime} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !project) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}>
          <EmptyState title="Project not found" body={error?.message} />
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const target = typeof project.targetReturn === 'number'
    ? project.targetReturn
    : parseFloat(String(project.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const min = project.minimumAmount ?? 0;
  const raised = project.raisedAmount ?? 0;
  const targetAmt = project.targetAmount ?? 1;
  const pct = Math.min(100, Math.round((raised / Math.max(1, targetAmt)) * 100));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <LinearGradient
          colors={['#1A1A1C', '#202024']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroGlyph}>{project.category?.[0]?.toUpperCase() ?? '◈'}</Text>
        </LinearGradient>

        {project.category ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{project.category}</Text>
          </View>
        ) : null}

        <Text style={styles.title}>{project.title}</Text>
        {project.summary ? <Text style={styles.summary}>{project.summary}</Text> : null}

        <View style={styles.statsGrid}>
          <Stat label="Target return" value={`${target}%`} />
          <Stat label="Funded" value={`${pct}%`} />
          <Stat
            label="Minimum"
            value={`${currency} ${convert(min).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          />
          <Stat
            label="Raised"
            value={`${currency} ${convert(raised).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          />
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>

        {project.description ? (
          <>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.body}>{project.description}</Text>
          </>
        ) : null}

        <Pressable style={styles.cta} onPress={() => { /* wire investment flow next */ }}>
          <Text style={styles.ctaText}>Invest now</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { padding: spacing.lg, paddingTop: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  backLink: { marginBottom: spacing.md },
  back: {
    marginTop: spacing.md, borderWidth: 1, borderColor: colors.lime,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill,
  },
  backText: { color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' },
  hero: {
    height: 200, borderRadius: radii.card, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg, ...shadows.card,
  },
  heroGlyph: { color: colors.lime, fontFamily: fonts.serif, fontSize: 64 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: colors.lime + '22',
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill,
    marginBottom: spacing.md,
  },
  badgeText: { color: colors.lime, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' },
  title: { color: colors.white, fontFamily: fonts.serif, fontSize: 28 },
  summary: { color: colors.muted, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xl,
    backgroundColor: colors.inkCard, borderRadius: radii.card, padding: spacing.lg,
  },
  stat: { width: '50%', marginBottom: spacing.md },
  statLabel: { color: colors.muted, fontFamily: fonts.sans, fontSize: 11 },
  statValue: { color: colors.white, fontFamily: fonts.sans, fontSize: 18, fontWeight: '600', marginTop: 2 },
  progressTrack: {
    height: 6, backgroundColor: colors.line + '22', borderRadius: 3,
    marginTop: spacing.md, overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: colors.lime, borderRadius: 3 },
  sectionTitle: { color: colors.white, fontFamily: fonts.serif, fontSize: 20, marginTop: spacing.xl, marginBottom: spacing.sm },
  body: { color: colors.line, fontFamily: fonts.sans, fontSize: 14, lineHeight: 22 },
  cta: {
    backgroundColor: colors.lime, paddingVertical: spacing.md,
    borderRadius: radii.pill, alignItems: 'center', marginTop: spacing.xl,
  },
  ctaText: { color: colors.ink, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' },
});
