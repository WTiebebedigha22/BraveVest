import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrency } from '@/context/CurrencyContext';
import { fonts, radii, spacing } from '@/theme/tokens';
import type { Project } from '@/api/hooks';

export function ProjectCard({ project, onPress }: { project: Project; onPress?: () => void }) {
  const { colors } = useTheme();
  const { currency, convert } = useCurrency();
  const target = typeof project.targetReturn === 'number' ? project.targetReturn : parseFloat(String(project.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const min = project.minimumAmount ?? 0;
  const raised = project.raisedAmount ?? 0;
  const targetAmt = project.targetAmount ?? 1;
  const pct = Math.min(100, Math.round((raised / Math.max(1, targetAmt)) * 100));

  return (
    <Pressable onPress={onPress} style={{ backgroundColor: colors.surface, borderRadius: radii.card, overflow: 'hidden', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border }}>
      <View style={{ height: 140 }}>
        <LinearGradient colors={[colors.surfaceMuted, colors.surfaceElevated]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 44 }}>{project.category?.[0]?.toUpperCase() ?? '◈'}</Text>
        </LinearGradient>
        {project.category ? (
          <View style={{ position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: colors.lime, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.chip }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>{project.category}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' }} numberOfLines={2}>{project.title}</Text>
        {project.summary ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, lineHeight: 18 }} numberOfLines={2}>{project.summary}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg }}>
          <Stat label="Target return" value={`${target}%`} accent={colors.lime} />
          <Stat label="Minimum" value={`${currency} ${convert(min).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <Stat label="Funded" value={`${pct}%`} />
        </View>
        <View style={{ height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 6, backgroundColor: colors.lime, borderRadius: 3, width: `${pct}%` }} />
        </View>
      </View>
    </Pressable>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600', marginTop: 2 }}>{value}</Text>
    </View>
  );
}
