import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { colors, fonts } from '@/theme/tokens';

class Boundary extends React.Component<
  { children: React.ReactNode },
  { err: Error | null }
> {
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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.serif]: PlayfairDisplay_700Bold,
    [fonts.sans]: Inter_400Regular,
    Inter_600SemiBold,
  });

  const [timedOut, setTimedOut] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, []);

  if (error) console.error('Font load error:', error);

  const ready = loaded || !!error || timedOut;

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.lime} />
      </View>
    );
  }

  return (
    <Boundary>
      <SafeAreaProvider>
        <AuthProvider>
          <CurrencyProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </CurrencyProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </Boundary>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  errorWrap: { flex: 1, backgroundColor: colors.ink, padding: 24, justifyContent: 'center' },
  errorTitle: { color: colors.lime, fontFamily: fonts.serif, fontSize: 20 },
  errorBody: { color: colors.white, marginTop: 12, fontFamily: fonts.sans },
});
