import { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, ActivityIndicator, Pressable, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFundingRequest, useMe, hasRole } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { api, endpoints } from '@/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function FundingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { format, currency } = useCurrency();
  const { data: request, loading, error, refetch } = useFundingRequest(String(id ?? ''));
  const { data: me } = useMe();
  const [modal, setModal] = useState(false);

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View></SafeAreaView>;
  if (error || !request) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <EmptyState title="Funding request not found" body={error?.message} />
        <Pressable onPress={() => router.back()} style={{ marginTop: spacing.md, borderWidth: 1, borderColor: colors.lime, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.pill }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>Go back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  const requested = Number(request.amountRequested ?? 0);
  const funded = Number(request.amountFunded ?? 0);
  const pct = requested > 0 ? Math.min(100, Math.round((funded / requested) * 100)) : 0;
  const target = request.proposedReturnPct != null ? Number(request.proposedReturnPct) : null;
  const canCommit = request.status === 'PUBLISHED' && !hasRole(me, 'BORROWER');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <StatusBadge status={request.status} />

        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700', marginTop: spacing.md }}>
          {request.title}
        </Text>

        {request.summary ? (
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 }}>
            {request.summary}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
          <Stat label="Amount requested" value={format(requested)} />
          <Stat label="Return" value={target != null ? `${target.toFixed(1)}%` : '—'} accent={colors.lime} />
          <Stat label="Term" value={request.durationMonths ? `${request.durationMonths} months` : '—'} />
          <Stat label="Category" value={request.category ? request.category.replace('_', ' ') : '—'} />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{format(funded)} raised</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{pct}% of {format(requested)}</Text>
          </View>
          <ProgressBar percent={pct} height={8} />
        </View>

        {request.description ? (
          <>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.sm }}>About</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, lineHeight: 22 }}>{request.description}</Text>
          </>
        ) : null}

        {/* Match status (placeholder until Phase 6) */}
        <View style={{ marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Match status</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.surfaceMuted }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime }} />
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>AWAITING</Text>
            </View>
          </View>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
            When creditors commit, funds transfer within a 5-minute window. Disbursement is verified within 5 minutes of transfer.
          </Text>
        </View>

        {/* Match status (placeholder until Phase 6) */}
        <View style={{ marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Match status</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.surfaceMuted }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime }} />
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>AWAITING</Text>
            </View>
          </View>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
            When creditors commit, funds transfer within a 5-minute window. Disbursement is verified within 5 minutes of transfer.
          </Text>
        </View>

        <View style={{ marginTop: spacing.xl, padding: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: radii.card }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 }}>
            <Text style={{ fontWeight: '700', color: colors.textPrimary }}>About commitments: </Text>
            when you commit, you're funding a peer-to-peer loan. The borrower receives your capital and repays over the term at the stated return.
          </Text>
        </View>

        {canCommit ? (
          <Pressable onPress={() => setModal(true)} style={{ backgroundColor: colors.lime, paddingVertical: spacing.md, borderRadius: radii.button, alignItems: 'center', marginTop: spacing.xl }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>Commit</Text>
          </Pressable>
        ) : null}

        <View style={{ height: 120 }} />
      </ScrollView>

      <CommitModal
        open={modal}
        onClose={() => setModal(false)}
        onDone={() => { setModal(false); refetch(); }}
        request={request}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: '50%', marginBottom: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700', marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function CommitModal({ open, onClose, onDone, request }: { open: boolean; onClose: () => void; onDone: () => void; request: any }) {
  const { colors } = useTheme();
  const { currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const requested = Number(request?.amountRequested ?? 0);
  const funded = Number(request?.amountFunded ?? 0);
  const remaining = Math.max(0, requested - funded);
  const min = request?.minCommitment != null ? Number(request.minCommitment) : 1;
  const max = Math.min(
    request?.maxCommitment != null ? Number(request.maxCommitment) : Infinity,
    remaining
  );

  async function submit() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) { Alert.alert('Enter an amount'); return; }
    if (n < min) { Alert.alert(`Minimum is ${min}`); return; }
    if (n > max) { Alert.alert(`Maximum is ${max}`); return; }
    setBusy(true);
    try {
      await api.post(endpoints.commitments.create, { requestId: request.id, amount: n });
      Alert.alert('Committed', 'Your commitment has been recorded.');
      setAmount('');
      onDone();
    } catch (e: any) {
      Alert.alert('Could not commit', e?.response?.data?.message ?? e?.message ?? 'Unknown error');
    } finally { setBusy(false); }
  }

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.xl, ...shadows.floating }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700' }}>Commit to {request?.title}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6 }}>
            {formatStatic(remaining, currency)} remains · min {formatStatic(min, currency)}
          </Text>

          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.lg }}>Amount ({currency})</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="100000"
            placeholderTextColor={colors.textTertiary}
            style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border }}
          />

          <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: colors.lime, paddingVertical: spacing.md, borderRadius: radii.button, alignItems: 'center', marginTop: spacing.xl }}>
            {busy ? <ActivityIndicator color={colors.onAccent} /> : <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Confirm commitment</Text>}
          </Pressable>
          <Pressable onPress={onClose} style={{ alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Small helper — no hook, so used outside the tree
function formatStatic(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${Number(n).toLocaleString()}`;
  }
}
