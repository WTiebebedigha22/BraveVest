import { useState } from 'react';
import { ScrollView, Text, View, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type Kind = 'investment' | 'payout' | 'maturity' | 'kyc' | 'system' | 'funding';

type Notif = {
  id: string;
  kind: Kind;
  title: string;
  body: string;
  date: string;
  read: boolean;
  action?: { label: string; path: string };
};

// TODO: wire to GET /api/notifications
const SEED: Notif[] = [];

const ICONS: Record<Kind, any> = {
  investment: 'trending-up',
  payout: 'dollar-sign',
  maturity: 'clock',
  kyc: 'shield',
  system: 'info',
  funding: 'layers',
};

export default function Notifications() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<Notif[]>(SEED);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = items.filter((i) => !i.read).length;
  const visible = filter === 'unread' ? items.filter((i) => !i.read) : items;

  async function refresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }

  function markAllRead() {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  }

  function open(n: Notif) {
    setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
    if (n.action) router.push(n.action.path as any);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.lime} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Notifications</Text>
          {unreadCount > 0 ? (
            <Pressable onPress={markAllRead}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>Mark all read</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          {(['all', 'unread'] as const).map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: active ? colors.textPrimary : colors.surfaceMuted }}
              >
                <Text style={{ color: active ? colors.background : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>
                  {f === 'all' ? 'All' : `Unread${unreadCount ? ` (${unreadCount})` : ''}`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {loading && items.length === 0 ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        ) : visible.length === 0 ? (
          <View style={{ padding: spacing.xxl, alignItems: 'center', marginTop: spacing.xl }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="bell-off" size={26} color={colors.textTertiary} />
            </View>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700', marginTop: spacing.lg }}>
              {filter === 'unread' ? 'No unread notifications' : "You're all caught up"}
            </Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, textAlign: 'center', maxWidth: 280, lineHeight: 19 }}>
              We'll let you know when your investments, payouts, or funding requests need attention.
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            {visible.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => open(n)}
                style={{
                  flexDirection: 'row', gap: spacing.md,
                  paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
                  borderBottomWidth: 1, borderBottomColor: colors.border,
                  backgroundColor: n.read ? 'transparent' : colors.surfaceMuted,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lime + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={ICONS[n.kind]} size={18} color={colors.lime} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: n.read ? '600' : '700' }} numberOfLines={1}>
                      {n.title}
                    </Text>
                    {!n.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lime }} /> : null}
                  </View>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 3, lineHeight: 18 }} numberOfLines={2}>{n.body}</Text>
                  <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: 6 }}>{relative(n.date)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function relative(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}
