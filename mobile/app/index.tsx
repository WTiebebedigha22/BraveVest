import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/theme/ThemeProvider';

const DEV_BYPASS = process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS !== '0';

export default function Index() {
  const { seen, ready } = useOnboarding();
  const { colors } = useTheme();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View>;
  }

  if (!seen) return <Redirect href="/onboarding" />;
  return <Redirect href={DEV_BYPASS ? '/(app)' : '/(auth)/login'} />;
}
