import { ScrollView, Text, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function Rewards() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();

  const perks = [
    { icon: 'gift', title: 'Referral bonus', body: 'Earn when a friend makes their first investment.', value: format(2000) },
    { icon: 'zap', title: 'Streak rewards', body: 'Invest monthly, get rewarded quarterly.', value: format(5000) },
    { icon: 'award', title: 'Loyalty tier', body: 'Reach ₦1M invested for VIP rates.', value: 'VIP 1' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.lg }}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>

        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 26, fontWeight: '700' }}>Rewards</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6 }}>
          Earn as you invest. Rewards land in your wallet.
        </Text>

        <View style={{ marginTop: spacing.xl, padding: spacing.xl, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Rewards earned</Text>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 34, fontWeight: '700', marginTop: 6 }}>{format(0, { decimals: 2 })}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 8 }}>
            Redeemable when you reach {format(5000)}
          </Text>
        </View>

        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          {perks.map((p) => (
            <View key={p.title} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={p.icon as any} size={20} color={colors.lime} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{p.title}</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>{p.body}</Text>
              </View>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>{p.value}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton label="Invite friends" variant="secondary" onPress={() => Alert.alert('Referrals', 'Referral link coming soon.')} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}
