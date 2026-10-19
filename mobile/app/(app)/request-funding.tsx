import { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { api, endpoints } from '@/api/client';
import { AuthInput } from '@/components/ui/AuthInput';
import { AmountInput } from '@/components/ui/AmountInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing } from '@/theme/tokens';

const CATEGORIES = ['REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];
const PAYOUT_FREQ = ['monthly', 'quarterly', 'bullet'];

export default function RequestFunding() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currency, format } = useCurrency();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [returnPct, setReturnPct] = useState('');
  const [duration, setDuration] = useState('12');
  const [category, setCategory] = useState(CATEGORIES[3]);
  const [frequency, setFrequency] = useState(PAYOUT_FREQ[0]);
  const [busy, setBusy] = useState(false);

  const amountNum = Number(amount) || 0;
  const returnNum = Number(returnPct) || 0;
  const durationNum = Number(duration) || 0;

  async function submit() {
    if (!title.trim() || title.trim().length < 5) { Alert.alert('Missing title', 'At least 5 characters.'); return; }
    if (!amountNum || amountNum <= 0) { Alert.alert('Invalid amount'); return; }
    setBusy(true);
    try {
      await api.post(endpoints.funding.create, {
        title: title.trim(),
        summary: summary.trim() || null,
        description: description.trim() || null,
        category,
        amountRequested: amountNum,
        proposedReturnPct: returnNum || null,
        durationMonths: durationNum || null,
        repaymentFrequency: frequency,
      });
      Alert.alert('Draft saved', 'Matching starts once you submit from the Credit tab.');
      router.replace('/(app)/credit');
    } catch (e: any) {
      Alert.alert('Could not save', e?.response?.data?.message ?? e?.message ?? 'Unknown error');
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
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Request funding</Text>
          </View>

          {/* From/To summary card */}
          <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.card, padding: spacing.lg, marginBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="users" size={14} color={colors.onAccent} />
                </View>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Creditors</Text>
              </View>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>auto-matched</Text>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 6 }}>
              <Feather name="arrow-down" size={16} color={colors.textSecondary} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="briefcase" size={14} color={colors.onAccent} />
                </View>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>You</Text>
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>
                {amountNum ? format(amountNum) : '—'}
              </Text>
            </View>
          </View>

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginBottom: spacing.md }}>
            You're requesting funding from individual investors. Once submitted, we match your request to open creditors — each commitment is a peer-to-peer loan repaid over the agreed term.
          </Text>

          <AuthInput label="Title" value={title} onChange={setTitle} placeholder="Cold storage expansion" />
          <AuthInput label="Summary" value={summary} onChange={setSummary} placeholder="One-line description" />
          <AuthInput label="Full description" value={description} onChange={setDescription} placeholder="What is this for? How will it be repaid?" />

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginTop: spacing.lg, marginBottom: 8 }}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: active ? colors.lime : colors.surfaceMuted }}
                >
                  <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{c.replace('_', ' ')}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ marginTop: spacing.lg }}>
            <AmountInput
              label={`Amount requested (${currency})`}
              value={amount}
              onChange={setAmount}
              placeholder="0"
              currency={currency}
            />
          </View>

          <AuthInput label="Return %" value={returnPct} onChange={setReturnPct} placeholder="16.5" keyboard="numeric" />
          <AuthInput label="Duration (months)" value={duration} onChange={setDuration} placeholder="12" keyboard="numeric" />

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginTop: spacing.md, marginBottom: 8 }}>Repayment schedule</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {PAYOUT_FREQ.map((f) => {
              const active = frequency === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFrequency(f)}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: radii.input, alignItems: 'center', backgroundColor: active ? colors.lime : colors.surfaceMuted, borderWidth: 1, borderColor: active ? colors.lime : colors.border }}
                >
                  <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }}>{f}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Match preview */}
          <View style={{ marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Feather name="zap" size={14} color={colors.lime} />
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' }}>Match preview</Text>
            </View>
            <View style={{ gap: 8 }}>
              <MatchLine label="Open creditors" value="~14 active" />
              <MatchLine label="Est. fill time" value="2–4 hours" />
              <MatchLine label="Transfer window" value="5 minutes" />
              <MatchLine label="Disbursement check" value="5 minutes" />
            </View>
          </View>

          <PrimaryButton
            label={busy ? 'Saving…' : 'Save as draft'}
            onPress={submit}
            loading={busy}
            style={{ marginTop: spacing.xl }}
          />

          <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: spacing.md, textAlign: 'center' }}>
            You can edit the draft before submitting for review.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MatchLine({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}
