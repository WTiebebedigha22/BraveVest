import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, shadows, spacing } from '@/theme/tokens';

export default function AppLayout() {
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        left: spacing.lg, right: spacing.lg, bottom: spacing.lg,
        height: 64, borderRadius: radii.pill,
        backgroundColor: colors.surface, borderTopWidth: 0, paddingBottom: 0,
        borderWidth: 1, borderColor: colors.border,
        ...shadows.floating,
      },
      tabBarActiveTintColor: colors.lime,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: { fontFamily: fonts.sans, fontSize: 10, fontWeight: '600' },
      tabBarItemStyle: { paddingVertical: spacing.sm },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="marketplace" options={{ title: 'Discover' }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="goals" options={{ title: 'Goals' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
