import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';

export default function Placeholder() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ padding: 24 }}>
        <Text style={{ color: colors.lime, fontSize: 16 }} onPress={() => router.back()}>← Back</Text>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 24, marginTop: 20 }}>
          Page Ready
        </Text>
      </View>
    </SafeAreaView>
  );
}
