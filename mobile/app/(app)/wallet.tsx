import { ScrollView, Text, View, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWallet, useWalletLedger, LedgerRow } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function WalletScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const { data: wallet, loading, error, refetch } = useWallet();
  const { data: ledger, refetch: refetchLedger } = useWalletLedger(20);

  async function refresh() {
    await Promise.all([refetch(), refetchLedger()]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!wallet} onRefresh={refresh} tintColor={colors.lime} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Wallet</Text>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View style={{ padding: spacing.xl, backgroundColor: colors.surfaceMuted, borderRadius: radii.card }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Available balance</Text>
            {loading && !wallet ? (
              <ActivityIndicator color={colors.lime} style={{ marginTop: 12 }} />
            ) : (
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 36, fontWeight: '700', marginTop: 6, letterSpacing: -0.5 }}>
                {format(wallet?.balance ?? 0, { decimals: 2 })}
              </Text>
            )}
            {wallet?.held ? (
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 8 }}>
                {format(wallet.held, { decimals: 2 })} on hold
              </Text>
            ) : null}
          </View>

          {error ? (
            <View style={{ marginTop: spacing.md, padding: spacing.md, backgroundColor: '#C0363A22', borderRadius: radii.input }}>
              <Text style={{ color: '#C0363A', fontFamily: fonts.sans, fontSize: 12 }}>{error.message}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
            <ActionButton icon="plus" label="Deposit" onPress={() => router.push('/(app)/deposit')} primary />
            <ActionButton icon="arrow-up" label="Withdraw" onPress={() => router.push('/(app)/withdraw')} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Recent activity</Text>
        </View>

        {!ledger || ledger.length === 0 ? (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <EmptyState
              title="No activity yet"
              body="Your deposits, withdrawals, and returns will appear here."
            />
          </View>
        ) : (
          <View>
            {ledger.map((row) => <LedgerItem key={row.id} row={row} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({ icon, label, onPress, primary }: { icon: any; label: string; onPress: () => void; primary?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: radii.button,
        backgroundColor: primary ? colors.lime : colors.surfaceMuted,
        borderWidth: 1,
        borderColor: primary ? colors.lime : colors.border,
      }}
    >
      <Feather name={icon} size={16} color={primary ? colors.onAccent : colors.textPrimary} />
      <Text style={{ color: primary ? colors.onAccent : colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

function LedgerItem({ row }: { row: LedgerRow }) {
  const { colors } = useTheme();
  const { format } = useCurrency();
  const isCredit = row.direction === 'credit';
  const icon: any =
    row.type === 'deposit' ? 'plus-circle' :
    row.type === 'withdrawal' ? 'arrow-up-circle' :
    row.type === 'commitment' ? 'layers' :
    row.type === 'repayment' ? 'refresh-cw' :
    row.type === 'payout' ? 'dollar-sign' :
    row.type === 'fee' ? 'minus-circle' :
    'activity';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isCredit ? colors.lime + '22' : colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={icon} size={16} color={isCredit ? colors.lime : colors.textSecondary} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
          {row.description || capitalize(row.type)}
        </Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 2 }}>
          {new Date(row.createdAt).toLocaleDateString()} · {row.reference.slice(-8)}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: isCredit ? colors.lime : colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>
          {isCredit ? '+' : '−'}{format(row.amount, { decimals: 2 })}
        </Text>
        {row.balanceAfter != null ? (
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 2 }}>
            {format(row.balanceAfter, { decimals: 2 })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
