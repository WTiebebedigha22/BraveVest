import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function Reinvest() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();

  const pots = [
    { label: 'Cash returns', amount: 0, ready: true },
    { label: 'Matured principal', amount: 0, ready: false },
    { label: 'Pending payouts', amount: 0, ready: false },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.lg }}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>

        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 26, fontWeight: '700' }}>Reinvest</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6 }}>
          Put maturing returns back to work without withdrawing.
        </Text>

        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          {pots.map((p) => (
            <View key={p.label} style={{ padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{p.label}</Text>
                {p.ready ? (
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.lime + '22' }}>
                    <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>READY</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700', marginTop: 8 }}>{format(p.amount, { decimals: 2 })}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700', marginBottom: 6 }}>Auto-reinvest</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
            When a project matures, automatically roll the principal into new opportunities matching your risk profile. You can turn this off any time.
          </Text>
        </View>

        <PrimaryButton label="Reinvest available" onPress={() => router.push('/(app)/funding')} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}
