import { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProjects } from '@/api/hooks';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

const CATEGORIES = ['All', 'Solar', 'Real Estate', 'Agri', 'SME'];

export default function Marketplace() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data, loading, error, refetch } = useProjects();
  const [cat, setCat] = useState('All');
  const projects = (data ?? []).filter((p) => cat === 'All' || p.category === cat);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && projects.length > 0} onRefresh={refetch} tintColor={colors.lime} />}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Discover</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4, marginBottom: spacing.lg }}>Curated opportunities, vetted by BraveVest.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }} contentContainerStyle={{ gap: spacing.sm }}>
          {CATEGORIES.map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
        </ScrollView>

        {loading && projects.length === 0 ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
            <EmptyState title="Couldn't load projects" body={error.message} />
            <Button label="Retry" variant="ghost" onPress={refetch} style={{ marginTop: spacing.md }} />
          </View>
        : projects.length === 0 ? <EmptyState title="No projects yet" body="Check back soon." />
        : projects.map((p) => <ProjectCard key={p.id} project={p} onPress={() => router.push(`/(app)/project/${p.slug}`)} />)}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
