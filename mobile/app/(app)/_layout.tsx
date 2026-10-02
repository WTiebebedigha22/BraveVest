import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '@/theme/tokens';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="marketplace" options={{ title: 'Discover' }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: spacing.lg, right: spacing.lg, bottom: spacing.lg,
    height: 68, borderRadius: radii.pill,
    backgroundColor: colors.inkSoft, borderTopWidth: 0, paddingBottom: 0,
    ...shadows.floating,
  },
  tabItem: { paddingVertical: spacing.sm },
  tabLabel: { fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' },
});
