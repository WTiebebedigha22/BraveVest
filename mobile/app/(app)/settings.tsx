import { useState } from 'react';
import { ScrollView, Text, View, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';
import { api, endpoints } from '@/api/client';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function Settings() {
  const router = useRouter();
  const { colors, mode, setMode } = useTheme();
  const { logout } = useAuth();

  // Security
  const [biometric, setBiometric] = useState(false);

  // Master switches
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Investment activity
  const [notifNewOpportunities, setNotifNewOpportunities] = useState(true);
  const [notifCommitments, setNotifCommitments] = useState(true);
  const [notifPayouts, setNotifPayouts] = useState(true);
  const [notifMaturity, setNotifMaturity] = useState(true);

  // Credit & funding
  const [notifFundingUpdates, setNotifFundingUpdates] = useState(true);
  const [notifNewCommitments, setNotifNewCommitments] = useState(true);
  const [notifRepayments, setNotifRepayments] = useState(true);

  // Account & other
  const [notifKyc, setNotifKyc] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifRewards, setNotifRewards] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const notificationsMuted = !pushNotifications && !emailNotifications;

  async function toggle(key: string, value: boolean, setter: (v: boolean) => void) {
    setter(value);
    try { await api.patch(endpoints.users.me, { [key]: value }); } catch {}
  }

  async function onDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This cannot be undone. All your data — investments, commitments, and statements — will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Contact support', 'Account deletion requires support verification. Email support@bravevest.com'),
        },
      ]
    );
  }

  async function onLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Settings</Text>
        </View>

        {/* ─── Appearance ─── */}
        <Label>Appearance</Label>
        <Group>
          <View style={{ padding: spacing.lg }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: 10 }}>Theme</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['system', 'light', 'dark'] as const).map((m) => {
                const active = m === mode;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: radii.input, alignItems: 'center',
                      backgroundColor: active ? colors.lime : colors.surfaceMuted,
                      borderWidth: 1, borderColor: active ? colors.lime : colors.border,
                    }}
                  >
                    <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700', textTransform: 'capitalize' }}>{m}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Group>

        {/* ─── Notifications: masters ─── */}
        <Label>Notifications</Label>
        <Group>
          <ToggleRow icon="bell" label="Push notifications" sub="Master switch for this device" value={pushNotifications} onValueChange={(v) => toggle('pushNotifications', v, setPushNotifications)} />
          <Divider />
          <ToggleRow icon="mail" label="Email notifications" sub="Master switch for email" value={emailNotifications} onValueChange={(v) => toggle('emailNotifications', v, setEmailNotifications)} />
        </Group>

        {/* ─── Investment activity ─── */}
        <Label>Investment activity</Label>
        <Group>
          <ToggleRow icon="trending-up" label="New opportunities" sub="When a vetted request is published" value={notifNewOpportunities} onValueChange={(v) => toggle('notifNewOpportunities', v, setNotifNewOpportunities)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="check-circle" label="Commitment confirmed" sub="When your investment is recorded" value={notifCommitments} onValueChange={(v) => toggle('notifCommitments', v, setNotifCommitments)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="dollar-sign" label="Payouts received" sub="When returns land in your wallet" value={notifPayouts} onValueChange={(v) => toggle('notifPayouts', v, setNotifPayouts)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="clock" label="Maturity reminders" sub="Before a project completes" value={notifMaturity} onValueChange={(v) => toggle('notifMaturity', v, setNotifMaturity)} disabled={notificationsMuted} />
        </Group>

        {/* ─── Credit & funding ─── */}
        <Label>Credit & funding</Label>
        <Group>
          <ToggleRow icon="send" label="Funding request updates" sub="Review status, approval, rejection" value={notifFundingUpdates} onValueChange={(v) => toggle('notifFundingUpdates', v, setNotifFundingUpdates)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="users" label="New commitments" sub="When someone funds your request" value={notifNewCommitments} onValueChange={(v) => toggle('notifNewCommitments', v, setNotifNewCommitments)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="alert-circle" label="Repayment reminders" sub="Upcoming and overdue obligations" value={notifRepayments} onValueChange={(v) => toggle('notifRepayments', v, setNotifRepayments)} disabled={notificationsMuted} />
        </Group>

        {/* ─── Account & other ─── */}
        <Label>Account & other</Label>
        <Group>
          <ToggleRow icon="shield" label="KYC & verification" sub="Status changes to your account" value={notifKyc} onValueChange={(v) => toggle('notifKyc', v, setNotifKyc)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="lock" label="Security alerts" sub="New sign-ins, password changes" value={notifSecurity} onValueChange={(v) => toggle('notifSecurity', v, setNotifSecurity)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="gift" label="Rewards & referrals" sub="Bonuses, streaks, referral milestones" value={notifRewards} onValueChange={(v) => toggle('notifRewards', v, setNotifRewards)} disabled={notificationsMuted} />
          <Divider />
          <ToggleRow icon="megaphone" label="Product updates" sub="New features and announcements" value={marketingEmails} onValueChange={(v) => toggle('marketingEmails', v, setMarketingEmails)} disabled={notificationsMuted} />
        </Group>

        {/* ─── Security ─── */}
        <Label>Security</Label>
        <Group>
          <ToggleRow icon="fingerprint" label="Biometric login" sub="Face ID or fingerprint on this device" value={biometric} onValueChange={(v) => toggle('biometric', v, setBiometric)} />
          <Divider />
          <Pressable onPress={() => Alert.alert('Change password', 'Open the web app to change your password, or contact support.')} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
            <Feather name="lock" size={18} color={colors.textPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Change password</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>Update your sign-in credentials</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
          <Divider />
          <Pressable onPress={() => Alert.alert('Sessions', 'Devices signed in coming soon.')} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
            <Feather name="monitor" size={18} color={colors.textPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Active sessions</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>Review and sign out other devices</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
        </Group>

        {/* ─── Account ─── */}
        <Label>Account</Label>
        <Group>
          <Pressable onPress={onLogout} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
            <Feather name="log-out" size={18} color={colors.textPrimary} />
            <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Sign out</Text>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
          <Divider />
          <Pressable onPress={onDeleteAccount} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
            <Feather name="trash-2" size={18} color="#C0363A" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#C0363A', fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Delete account</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>Permanently remove all data</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
        </Group>

        <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, textAlign: 'center', marginTop: spacing.xxl }}>
          BraveVest · v0.4.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <Text style={{
      color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700',
      letterSpacing: 0.8, textTransform: 'uppercase',
      marginHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm,
    }}>
      {children}
    </Text>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginHorizontal: spacing.lg, backgroundColor: colors.surfaceMuted, borderRadius: radii.card, overflow: 'hidden' }}>
      {children}
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />;
}

function ToggleRow({ icon, label, sub, value, onValueChange, disabled }: { icon: any; label: string; sub: string; value: boolean; onValueChange: (v: boolean) => void; disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, opacity: disabled ? 0.4 : 1 }}>
      <Feather name={icon} size={18} color={colors.textPrimary} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>{label}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>{sub}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} trackColor={{ false: colors.border, true: colors.lime }} thumbColor="#fff" />
    </View>
  );
}
