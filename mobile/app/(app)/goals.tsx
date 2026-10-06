import { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator, Pressable, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGoals } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { api } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function Goals() {
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const { data, loading, error, refetch } = useGoals();
  const [modal, setModal] = useState(false);
  const goals = data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && goals.length > 0} onRefresh={refetch} tintColor={colors.lime} />}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
          <View>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Goals</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4 }}>Save with purpose.</Text>
          </View>
          <Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }} onPress={() => setModal(true)}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 22, lineHeight: 24 }}>＋</Text>
          </Pressable>
        </View>

        {loading && goals.length === 0 ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <EmptyState title="Couldn't load goals" body={error.message} />
        : goals.length === 0 ? <EmptyState title="No goals yet" body="Tap ＋ to set your first savings goal." />
        : goals.map((g) => {
          const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
          return (
            <Card key={g.id} style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600', flex: 1, marginRight: spacing.md }} numberOfLines={1}>{g.title}</Text>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{pct}%</Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' }}>
                <View style={{ height: 6, backgroundColor: colors.lime, borderRadius: 3, width: `${pct}%` }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{currency} {convert(g.currentAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>of {currency} {convert(g.targetAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </View>
            </Card>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      <NewGoalModal visible={modal} onClose={() => setModal(false)} onCreated={refetch} />
    </SafeAreaView>
  );
}

function NewGoalModal({ visible, onClose, onCreated }: { visible: boolean; onClose: () => void; onCreated: () => void }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amt = Number(target.replace(/[^0-9.]/g, ''));
    if (!title.trim() || !amt) { Alert.alert('Missing fields', 'Enter a title and target amount.'); return; }
    setBusy(true);
    try {
      await api.post('/api/goals', { title: title.trim(), targetAmount: amt });
      setTitle(''); setTarget(''); onClose(); onCreated();
    } catch (e: any) { Alert.alert('Could not create goal', e?.response?.data?.message ?? e?.message ?? 'Unknown error'); }
    finally { setBusy(false); }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.xl, ...shadows.floating }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginBottom: spacing.lg }}>New goal</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Title</Text>
          <TextInput style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border }} value={title} onChangeText={setTitle} placeholder="e.g. Emergency fund" placeholderTextColor={colors.textTertiary} />
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.md }}>Target amount (NGN)</Text>
          <TextInput style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border }} value={target} onChangeText={setTarget} keyboardType="numeric" placeholder="500000" placeholderTextColor={colors.textTertiary} />
          <Button label="Create goal" onPress={submit} loading={busy} full style={{ marginTop: spacing.xl }} />
          <Pressable style={{ alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm }} onPress={onClose}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
