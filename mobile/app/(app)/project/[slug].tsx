import { ScrollView, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProject } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function ProjectDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const { data: project, loading, error } = useProject(String(slug ?? ''));

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View></SafeAreaView>;
  if (error || !project) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <EmptyState title="Project not found" body={error?.message} />
        <Button label="Go back" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
      </View>
    </SafeAreaView>
  );

  const target = typeof project.targetReturn === 'number' ? project.targetReturn : parseFloat(String(project.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const min = project.minimumAmount ?? 0;
  const raised = project.raisedAmount ?? 0;
  const targetAmt = project.targetAmount ?? 1;
  const pct = Math.min(100, Math.round((raised / Math.max(1, targetAmt)) * 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <LinearGradient colors={[colors.surfaceMuted, colors.surfaceElevated]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 180, borderRadius: radii.card, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, ...shadows.card }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 60 }}>{project.category?.[0]?.toUpperCase() ?? '◈'}</Text>
        </LinearGradient>

        {project.category ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.lime, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.chip, marginBottom: spacing.md }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>{project.category}</Text>
          </View>
        ) : null}

        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>{project.title}</Text>
        {project.summary ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 }}>{project.summary}</Text> : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
          <Stat label="Target return" value={`${target}%`} accent={colors.lime} />
          <Stat label="Funded" value={`${pct}%`} />
          <Stat label="Minimum" value={`${currency} ${convert(min).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <Stat label="Raised" value={`${currency} ${convert(raised).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        </View>

        <View style={{ height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 6, backgroundColor: colors.lime, borderRadius: 3, width: `${pct}%` }} />
        </View>

        {project.description ? (
          <>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.sm }}>About</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, lineHeight: 22 }}>{project.description}</Text>
          </>
        ) : null}

        <Button label="Invest now" onPress={() => {}} full style={{ marginTop: spacing.xl }} />
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: '50%', marginBottom: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700', marginTop: 2 }}>{value}</Text>
    </View>
  );
}
