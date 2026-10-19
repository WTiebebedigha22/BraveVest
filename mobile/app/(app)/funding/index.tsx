import { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { useFundingList } from '@/api/hooks';
import { AmountInput } from '@/components/ui/AmountInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';
import { MIN_DEPOSIT_USD, USD_RATES } from '@/constants/paymentMethods';

const QUICK = [5000, 10000, 25000, 50000, 100000];

export default function FundingHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format, currency, convert } = useCurrency();

  const [mode, setMode] = useState<'deposit' | 'request'>('deposit');
  const [amount, setAmount] = useState('');
  const { data: funding, loading } = useFundingList();
  const featured = (funding ?? []).slice(0, 3);

  const amountNum = Number(amount) || 0;
  const usdEquivalent = amountNum * (USD_RATES[currency] ?? 1);
  const belowMin = amountNum > 0 && usdEquivalent < MIN_DEPOSIT_USD;

  function go() {
    if (mode === 'deposit') {
      if (!amountNum || belowMin) { Alert.alert('Invalid amount', `Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent.`); return; }
      router.push({ pathname: '/(app)/deposit', params: { amount: String(amountNum) } });
    } else {
      router.push('/(app)/request-funding');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Top tabs */}
        <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.xl }}>
          <Pressable onPress={() => setMode('deposit')}>
            <Text style={{ color: mode === 'deposit' ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 20, fontWeight: mode === 'deposit' ? '700' : '500' }}>
              Deposit
            </Text>
            {mode === 'deposit' ? <View style={{ height: 2, backgroundColor: colors.textPrimary, marginTop: 4, borderRadius: 2 }} /> : null}
          </Pressable>
          <Pressable onPress={() => setMode('request')}>
            <Text style={{ color: mode === 'request' ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 20, fontWeight: mode === 'request' ? '700' : '500' }}>
              Request funds
            </Text>
            {mode === 'request' ? <View style={{ height: 2, backgroundColor: colors.textPrimary, marginTop: 4, borderRadius: 2 }} /> : null}
          </Pressable>
        </View>

        {/* Instant / Match row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700' }}>
            {mode === 'deposit' ? 'Instant' : 'Match'}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Pressable onPress={() => router.push('/(app)/statements')}>
              <Feather name="bar-chart-2" size={18} color={colors.textSecondary} />
            </Pressable>
            <Pressable onPress={() => router.push('/(app)/support')}>
              <Feather name="help-circle" size={18} color={colors.textSecondary} />
            </Pressable>
            <Pressable onPress={() => router.push('/(app)/settings')}>
              <Feather name="settings" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* From / To card */}
        <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.card, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>From</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>
              Available: {format(0, { decimals: 2 })}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="briefcase" size={14} color={colors.onAccent} />
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>Wallet</Text>
              <Feather name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700' }}>
              {amountNum ? amountNum.toLocaleString() : '0'}
            </Text>
          </View>
        </View>

        {/* Swap icon row */}
        <View style={{ alignItems: 'center', marginVertical: -14, zIndex: 2 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="arrow-down" size={18} color={colors.textPrimary} />
          </View>
        </View>

        <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.card, padding: spacing.lg, marginTop: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>To</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>
              {mode === 'deposit' ? 'Invested into marketplace' : 'Matched from creditors'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="layers" size={14} color={colors.onAccent} />
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>
                {mode === 'deposit' ? 'Funding' : 'Creditors'}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700' }}>--</Text>
          </View>
        </View>

        {/* Amount input */}
        <View style={{ marginTop: spacing.xl }}>
          <AmountInput
            label={`Amount (${currency})`}
            value={amount}
            onChange={setAmount}
            placeholder="0"
            currency={currency}
            hint={`Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent`}
            error={belowMin ? `Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent (${currency} ${Math.round(MIN_DEPOSIT_USD / (USD_RATES[currency] ?? 1)).toLocaleString()})` : undefined}
          />
        </View>

        {/* Quick chips */}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {QUICK.map((q) => (
            <Pressable key={q} onPress={() => setAmount(String(q))} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surfaceMuted }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{format(q)}</Text>
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <PrimaryButton
          label={
            mode === 'deposit'
              ? (amountNum ? `Deposit ${format(amountNum)}` : 'Deposit')
              : 'Request funding'
          }
          onPress={go}
          disabled={mode === 'deposit' && (!amountNum || belowMin)}
          style={{ marginTop: spacing.xl }}
        />

        <Pressable onPress={() => router.push('/(app)/funding/marketplace')} style={{ alignItems: 'center', paddingVertical: spacing.md }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>
            Browse open opportunities →
          </Text>
        </Pressable>

        {/* Featured requests */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
              {mode === 'deposit' ? 'Open opportunities' : 'Your open requests'}
            </Text>
            <Pressable onPress={() => router.push('/(app)/funding/marketplace')}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>See all</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.lime} />
          ) : featured.length === 0 ? (
            <View style={{ padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>
                No published opportunities yet.
              </Text>
            </View>
          ) : (
            featured.map((r) => {
              const requested = Number(r.amountRequested ?? 0);
              const funded = Number(r.amountFunded ?? 0);
              const pct = requested > 0 ? Math.round((funded / requested) * 100) : 0;
              const target = r.proposedReturnPct != null ? Number(r.proposedReturnPct) : null;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => router.push(`/(app)/funding/${r.id}`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>
                      {(r.category?.[0] ?? 'F').toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{r.title}</Text>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 3 }}>
                      {pct}% funded · {r.durationMonths ?? '—'}mo
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>{format(requested)}</Text>
                    {target != null ? (
                      <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>{target.toFixed(1)}%</Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
