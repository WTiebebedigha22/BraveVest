import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, spacing, gradients } from '@/theme/tokens';
import { useCurrency } from '@/context/CurrencyContext';
import type { Project } from '@/api/hooks';

export function ProjectCard({ project, onPress }: { project: Project; onPress?: () => void }) {
  const { currency, convert } = useCurrency();
  const target = typeof project.targetReturn === 'number'
    ? project.targetReturn
    : parseFloat(String(project.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const min = project.minimumAmount ?? 0;
  const raised = project.raisedAmount ?? 0;
  const target_amt = project.targetAmount ?? 1;
  const pct = Math.min(100, Math.round((raised / Math.max(1, target_amt)) * 100));

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.imageWrap}>
        <LinearGradient
          colors={[colors.inkSoft, colors.inkCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.imageFallback}
        >
          <Text style={styles.imageGlyph}>{project.category?.[0]?.toUpperCase() ?? '◈'}</Text>
        </LinearGradient>
        {project.category ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{project.category}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{project.title}</Text>
        {project.summary ? (
          <Text style={styles.summary} numberOfLines={2}>{project.summary}</Text>
        ) : null}

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>Target return</Text>
            <Text style={styles.statValue}>{target}%</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>
              {currency} {convert(min).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Funded</Text>
            <Text style={styles.statValue}>{pct}%</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.inkCard,
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imageWrap: { height: 160, position: 'relative' },
  imageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageGlyph: { color: colors.lime, fontFamily: fonts.serif, fontSize: 48 },
  badge: {
    position: 'absolute', top: spacing.md, left: spacing.md,
    backgroundColor: colors.ink + 'cc', paddingHorizontal: spacing.md,
    paddingVertical: 6, borderRadius: radii.pill,
  },
  badgeText: { color: colors.lime, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' },
  body: { padding: spacing.lg },
  title: { color: colors.white, fontFamily: fonts.serif, fontSize: 20 },
  summary: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: spacing.sm, lineHeight: 18 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  statLabel: { color: colors.muted, fontFamily: fonts.sans, fontSize: 11 },
  statValue: { color: colors.white, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600', marginTop: 2 },
  progressTrack: {
    height: 4, backgroundColor: colors.line + '22',
    borderRadius: 2, marginTop: spacing.md, overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: colors.lime, borderRadius: 2 },
});
