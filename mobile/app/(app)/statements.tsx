import { useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

const TABS = ['Transactions', 'Portfolio'];

export default function Statements() {
  const router = useRouter();
  const { colors } = useTheme();
  const { format } = useCurrency();
  const [tab, setTab] = useState('Transactions');

  const transactions: { id: string; label: string; sub: string; amount: number }[] = [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.lg }}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>

          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 26, fontWeight: '700' }}>Statements</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6 }}>
            Download a record of every transaction and holding.
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            {TABS.map((t) => {
              const active = tab === t;
              return (
                <Pressable key={t} onPress={() => setTab(t)} style={{ paddingBottom: spacing.md }}>
                  <Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontFamily: fonts.sans, fontSize: 15, fontWeight: active ? '700' : '500' }}>{t}</Text>
                  {active ? <View style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: colors.textPrimary, borderRadius: 2 }} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {transactions.length === 0 ? (
          <View style={{ padding: spacing.xxl, alignItems: 'center' }}>
            <Feather name="file-text" size={32} color={colors.textTertiary} />
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600', marginTop: spacing.lg }}>No statements yet</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
              Your statements will appear here after your first investment.
            </Text>
          </View>
        ) : (
          transactions.map((t) => (
            <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>{t.label}</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 2 }}>{t.sub}</Text>
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>{format(t.amount)}</Text>
              <Feather name="download" size={16} color={colors.textSecondary} />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
