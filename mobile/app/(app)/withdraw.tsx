import { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { AmountInput } from '@/components/ui/AmountInput';
import { PaymentPicker } from '@/components/ui/PaymentPicker';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';
import { MIN_DEPOSIT_USD, USD_RATES, PaymentMethodId } from '@/constants/paymentMethods';

export default function Withdraw() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethodId>('bank_transfer');
  const [busy, setBusy] = useState(false);

  const amountNum = Number(amount) || 0;
  const usdEq = amountNum * (USD_RATES[currency] ?? 1);
  const minLocal = Math.round(MIN_DEPOSIT_USD / (USD_RATES[currency] ?? 1));
  const belowMin = amountNum > 0 && usdEq < MIN_DEPOSIT_USD;

  async function submit() {
    if (!amountNum || belowMin) { Alert.alert('Invalid amount', `Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent (${format(minLocal)}).`); return; }
    setBusy(true);
    try {
      const { api } = await import('@/api/client');
      await api.post('/api/payments/withdraw', { amount: amountNum, method });
      Alert.alert('Withdrawal requested', 'Funds will settle in 1–2 business days.');
      router.back();
    } catch (e: any) {
      Alert.alert('Could not withdraw', e?.response?.data?.message ?? e?.message ?? 'Unknown error');
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
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Withdraw</Text>
          </View>

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, marginBottom: spacing.lg }}>
            Move wallet funds to a card, bank account, or digital wallet. Minimum ${MIN_DEPOSIT_USD} equivalent.
          </Text>

          <View style={{ padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted, marginBottom: spacing.lg }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Available</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 26, fontWeight: '700', marginTop: 4 }}>
              {format(0, { decimals: 2 })}
            </Text>
          </View>

          <AmountInput
            label={`Amount (${currency})`}
            value={amount}
            onChange={setAmount}
            placeholder="0"
            currency={currency}
            hint={`Minimum ${format(minLocal)}`}
            error={belowMin ? `Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent (${format(minLocal)})` : undefined}
          />

          <PaymentPicker value={method} onChange={setMethod} label="Withdrawal method" />

          <View style={{ marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <Feather name="clock" size={16} color={colors.textSecondary} style={{ marginTop: 2 }} />
              <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
                Withdrawals settle in 1–2 business days. A small processing fee may apply.
              </Text>
            </View>
          </View>

          <PrimaryButton
            label={busy ? 'Requesting…' : 'Request withdrawal'}
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
