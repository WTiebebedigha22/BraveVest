import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { ThemeProvider, useTheme, _registerExternalSetMode } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';

class Boundary extends React.Component<{ children: React.ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error('ROOT ERROR:', err); }
  render() {
    if (this.state.err) {
      return (
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Something broke.</Text>
          <Text style={styles.errorBody}>{String(this.state.err)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function ThemeBridge() {
  const { setMode } = useTheme();
  React.useEffect(() => { _registerExternalSetMode(setMode); }, [setMode]);
  return null;
}

function ThemedStack() {
  const { colors, resolved } = useTheme();
  return (
    <>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.serif]: PlayfairDisplay_700Bold,
    [fonts.sans]: Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [timedOut, setTimedOut] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setTimedOut(true), 4000); return () => clearTimeout(t); }, []);
  if (error) console.error('Font load error:', error);
  const ready = loaded || !!error || timedOut;
  if (!ready) return <View style={styles.boot}><ActivityIndicator color="#B3D941" /></View>;

  return (
    <Boundary>
      <ThemeProvider>
        <ThemeBridge />
        <SafeAreaProvider>
          <OnboardingProvider>
            <AuthProvider>
              <CurrencyProvider>
                <ThemedStack />
              </CurrencyProvider>
            </AuthProvider>
          </OnboardingProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </Boundary>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: '#0F0F10', alignItems: 'center', justifyContent: 'center' },
  errorWrap: { flex: 1, backgroundColor: '#0F0F10', padding: 24, justifyContent: 'center' },
  errorTitle: { color: '#B3D941', fontFamily: fonts.serif, fontSize: 20 },
  errorBody: { color: '#fff', marginTop: 12, fontFamily: fonts.sans },
});
