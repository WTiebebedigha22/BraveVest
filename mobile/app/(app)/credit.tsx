import { useState } from 'react';
import { ScrollView, Text, View, Pressable, RefreshControl, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMyFunding, useMe, hasRole } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { api, endpoints } from '@/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function Credit() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const { data: me } = useMe();
  const { data, loading, error, refetch } = useMyFunding();
  const [modal, setModal] = useState(false);

  const items = data ?? [];
  const canBorrow = hasRole(me, 'BORROWER', 'ADMIN', 'SUPER_ADMIN');

  async function submit(id: string) {
    try { await api.post(endpoints.funding.submit(id)); refetch(); }
    catch (e: any) { Alert.alert('Could not submit', e?.response?.data?.message ?? e?.message); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && items.length > 0} onRefresh={refetch} tintColor={colors.lime} />}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.lg }}>
          <View>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Credit</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4 }}>
              Raise capital from individual investors.
            </Text>
          </View>
          {canBorrow ? (
            <Pressable onPress={() => setModal(true)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="plus" size={20} color={colors.onAccent} />
            </Pressable>
          ) : null}
        </View>

        {!canBorrow ? (
          <EmptyState title="Credit isn't enabled" body="Contact support to request credit access on your account." />
        ) : loading && items.length === 0 ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        ) : error ? (
          <EmptyState title="Couldn't load" body={error.message} />
        ) : items.length === 0 ? (
          <EmptyState title="No requests yet" body="Tap + to submit your first funding request." />
        ) : (
          items.map((r) => {
            const req = Number(r.amountRequested ?? 0);
            const fund = Number(r.amountFunded ?? 0);
            const pct = req > 0 ? Math.min(100, Math.round((fund / req) * 100)) : 0;
            return (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/(app)/funding/${r.id}`)}
                style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
                  <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600' }} numberOfLines={2}>{r.title}</Text>
                  <StatusBadge status={r.status} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{format(req)} requested</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{pct}% funded</Text>
                </View>

                {r.status === 'DRAFT' ? (
                  <Pressable
                    onPress={() => submit(r.id)}
                    style={{ marginTop: spacing.md, alignSelf: 'flex-start', backgroundColor: colors.lime, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.button }}
                  >
                    <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>Submit for review</Text>
                  </Pressable>
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <NewRequestModal open={modal} onClose={() => setModal(false)} onDone={() => { setModal(false); refetch(); }} />
    </SafeAreaView>
  );
}

function NewRequestModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [amount, setAmount] = useState('');
  const [returnPct, setReturnPct] = useState('');
  const [duration, setDuration] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amt = Number(amount);
    if (!title.trim() || !Number.isFinite(amt) || amt <= 0) { Alert.alert('Missing fields', 'Enter a title and a valid amount.'); return; }
    setBusy(true);
    try {
      await api.post(endpoints.funding.create, {
        title: title.trim(),
        summary: summary.trim() || null,
        category: 'SME',
        amountRequested: amt,
        proposedReturnPct: returnPct ? Number(returnPct) : null,
        durationMonths: duration ? Number(duration) : null,
        repaymentFrequency: 'monthly',
      });
      Alert.alert('Saved', 'Draft created. Open it to submit for review.');
      setTitle(''); setSummary(''); setAmount(''); setReturnPct(''); setDuration('');
      onDone();
    } catch (e: any) { Alert.alert('Could not create', e?.response?.data?.message ?? e?.message); }
    finally { setBusy(false); }
  }

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' }}>
        <ScrollView style={{ maxHeight: '85%' }} contentContainerStyle={{ backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.xl, ...shadows.floating }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700' }}>New credit request</Text>
            <Pressable onPress={onClose}><Feather name="x" size={22} color={colors.textSecondary} /></Pressable>
          </View>

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginBottom: spacing.md }}>
            You're requesting funding from individual investors. Each commitment is a peer-to-peer loan — you'll receive the capital upfront and repay it over the agreed term.
          </Text>

          <Field label="Title" value={title} onChange={setTitle} placeholder="Cold storage expansion" />
          <Field label="Summary" value={summary} onChange={setSummary} placeholder="One-line description" />
          <Field label="Amount (NGN)" value={amount} onChange={setAmount} placeholder="4500000" numeric />
          <Field label="Return %" value={returnPct} onChange={setReturnPct} placeholder="16.5" numeric />
          <Field label="Duration (months)" value={duration} onChange={setDuration} placeholder="18" numeric />

          <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: colors.lime, paddingVertical: spacing.md, borderRadius: radii.button, alignItems: 'center', marginTop: spacing.lg }}>
            {busy ? <ActivityIndicator color={colors.onAccent} /> : <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Save draft</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, value, onChange, placeholder, numeric }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; numeric?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={numeric ? 'numeric' : 'default'}
        style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, borderWidth: 1, borderColor: colors.border }}
      />
    </View>
  );
}
