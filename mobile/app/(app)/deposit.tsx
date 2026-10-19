import { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { AmountInput } from '@/components/ui/AmountInput';
import { PaymentPicker } from '@/components/ui/PaymentPicker';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';
import { MIN_DEPOSIT_USD, USD_RATES, PaymentMethodId } from '@/constants/paymentMethods';

export default function Deposit() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format, currency } = useCurrency();
  const params = useLocalSearchParams<{ amount?: string }>();

  const [amount, setAmount] = useState(params.amount ?? '');
  const [method, setMethod] = useState<PaymentMethodId>('card');
  const [busy, setBusy] = useState(false);

  const amountNum = Number(amount) || 0;
  const usdEq = amountNum * (USD_RATES[currency] ?? 1);
  const minLocal = Math.round(MIN_DEPOSIT_USD / (USD_RATES[currency] ?? 1));
  const belowMin = amountNum > 0 && usdEq < MIN_DEPOSIT_USD;

  async function submit() {
    if (!amountNum || belowMin) { Alert.alert('Invalid amount', `Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent (${format(minLocal)}).`); return; }
    setBusy(true);
    try {
      const { api, endpoints } = await import('@/api/client');
      const { data } = await api.post(endpoints.payments.init, {
        amount: amountNum,
        method,
        purpose: 'wallet_deposit',
      });
      if (data?.authorization_url) {
        const WebBrowser = await import('expo-web-browser');
        await WebBrowser.openBrowserAsync(data.authorization_url);
      } else {
        Alert.alert('Deposit initialised', 'A payment link would open here. (Backend pending.)');
      }
    } catch (e: any) {
      Alert.alert('Could not start deposit', e?.response?.data?.message ?? e?.message ?? 'Unknown error');
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Feather name="arrow-left" size={22} color={colors.textPrimary} />
            </Pressable>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Deposit</Text>
          </View>

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, marginBottom: spacing.lg }}>
            Add funds to your BraveVest wallet. Minimum ${MIN_DEPOSIT_USD} equivalent per deposit.
          </Text>

          <AmountInput
            label={`Amount (${currency})`}
            value={amount}
            onChange={setAmount}
            placeholder="0"
            currency={currency}
            hint={`Minimum ${format(minLocal)}`}
            error={belowMin ? `Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent (${format(minLocal)})` : undefined}
          />

          <PaymentPicker value={method} onChange={setMethod} label="Payment method" />

          <View style={{ marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <Feather name="shield" size={16} color={colors.lime} style={{ marginTop: 2 }} />
              <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
                Payments are processed securely by Paystack. Funds land in your wallet within seconds.
              </Text>
            </View>
          </View>

          <PrimaryButton
            label={busy ? 'Starting…' : (amountNum ? `Deposit ${format(amountNum)}` : 'Deposit')}
            onPress={submit}
            loading={busy}
            disabled={!amountNum || belowMin}
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
