import { ScrollView, Text, View, StyleSheet, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProjects } from '@/api/hooks';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, fonts, radii, spacing } from '@/theme/tokens';

const CATEGORIES = ['All', 'Solar', 'Real Estate', 'Agri', 'SME'] as const;

export default function Marketplace() {
  const router = useRouter();
  const { data, loading, error, refetch } = useProjects();

  const projects = data ?? [];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && projects.length > 0}
            onRefresh={refetch}
            tintColor={colors.lime}
          />
        }
      >
        <Text style={styles.heading}>Discover</Text>
        <Text style={styles.sub}>Curated opportunities, vetted by BraveVest.</Text>

        <View style={styles.chipsRow}>
          {CATEGORIES.map((c, i) => (
            <View key={c} style={[styles.chip, i === 0 && styles.chipActive]}>
              <Text style={[styles.chipText, i === 0 && styles.chipTextActive]}>{c}</Text>
            </View>
          ))}
        </View>

        {loading && projects.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.lime} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <EmptyState title="Couldn't load projects" body={error.message} />
            <Pressable style={styles.retry} onPress={refetch}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : projects.length === 0 ? (
          <EmptyState title="No projects yet" body="Check back soon." />
        ) : (
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onPress={() => router.push(`/(app)/project/${p.slug}`)}
            />
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { padding: spacing.lg, paddingTop: spacing.md },
  heading: { color: colors.white, fontFamily: fonts.serif, fontSize: 30 },
  sub: { color: colors.muted, fontFamily: fonts.sans, fontSize: 13, marginTop: spacing.xs, marginBottom: spacing.lg },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line + '22',
  },
  chipActive: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipText: { color: colors.muted, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.ink },
  center: { paddingVertical: spacing.xxl, alignItems: 'center' },
  retry: {
    marginTop: spacing.md, borderWidth: 1, borderColor: colors.lime,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill,
  },
  retryText: { color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' },
});
