import { ScrollView, Text, View, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

const FAQS = [
  { icon: 'help-circle', q: 'How do I invest?', a: 'Browse the Funding tab, pick a request that matches your goals, and commit an amount above the minimum. Funds are sent via Paystack.' },
  { icon: 'clock', q: 'When do I get returns?', a: 'Returns are paid on the schedule the borrower sets — monthly, quarterly, or at maturity. You\'ll see each payment in your Portfolio.' },
  { icon: 'shield', q: 'How is my money protected?', a: 'Funds are held with regulated payment partners. Each project is vetted by our team, and you can diversify across multiple requests to reduce risk.' },
  { icon: 'user', q: 'What does KYC require?', a: 'A government-issued ID, a selfie, and proof of address. Approval usually takes a few minutes during business hours.' },
  { icon: 'send', q: 'How do I request funding?', a: 'From Profile → Request funding. Fill in your request details and submit. Our team reviews it and publishes approved requests on the marketplace.' },
  { icon: 'repeat', q: 'Can I withdraw any time?', a: 'Returns and matured principal can be withdrawn. Funds committed to active projects are locked for the project term.' },
];

const CONTACT = [
  { icon: 'message-circle', title: 'Live chat', sub: 'Mon–Fri, 9am–6pm WAT', action: () => Alert.alert('Live chat', 'Chat coming soon.') },
  { icon: 'mail', title: 'Email', sub: 'support@bravevest.com', action: () => Linking.openURL('mailto:support@bravevest.com?subject=Support%20request') },
  { icon: 'phone', title: 'Phone', sub: '+234 800 000 0000', action: () => Linking.openURL('tel:+2348000000000') },
  { icon: 'file-text', title: 'Submit a ticket', sub: 'Detailed issues', action: () => Alert.alert('Ticket', 'Ticket form coming soon.') },
];

export default function Support() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>Support</Text>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>How can we help?</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, lineHeight: 19 }}>
            Answers to common questions, and real humans when you need them.
          </Text>
        </View>

        {/* ─── Contact methods ─── */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          {CONTACT.map((c) => (
            <Pressable
              key={c.title}
              onPress={c.action}
              style={{ width: '47.5%', padding: spacing.lg, borderRadius: radii.card, backgroundColor: colors.surfaceMuted }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Feather name={c.icon as any} size={18} color={colors.lime} />
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{c.title}</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginTop: 3 }}>{c.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* ─── FAQ ─── */}
        <Text style={{
          color: colors.textSecondary,
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginHorizontal: spacing.lg,
          marginTop: spacing.xl,
          marginBottom: spacing.sm,
        }}>
          Frequently asked
        </Text>

        <View style={{ marginHorizontal: spacing.lg, backgroundColor: colors.surfaceMuted, borderRadius: radii.card, overflow: 'hidden' }}>
          {FAQS.map((f, i) => (
            <View key={f.q}>
              <FaqRow icon={f.icon} q={f.q} a={f.a} />
              {i < FAQS.length - 1 ? <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} /> : null}
            </View>
          ))}
        </View>

        {/* ─── Legal / links ─── */}
        <Text style={{
          color: colors.textSecondary,
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginHorizontal: spacing.lg,
          marginTop: spacing.xl,
          marginBottom: spacing.sm,
        }}>
          Resources
        </Text>

        <View style={{ marginHorizontal: spacing.lg, backgroundColor: colors.surfaceMuted, borderRadius: radii.card, overflow: 'hidden' }}>
          <LinkRow icon="book-open" label="Help center" onPress={() => router.push('/(app)/settings')} />
          <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />
          <LinkRow icon="file-text" label="Terms of service" onPress={() => Linking.openURL('https://bravevest.com/terms')} />
          <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />
          <LinkRow icon="shield" label="Privacy policy" onPress={() => Linking.openURL('https://bravevest.com/privacy')} />
          <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />
          <LinkRow icon="alert-triangle" label="Risk disclosure" onPress={() => Linking.openURL('https://bravevest.com/risk-disclosure')} />
        </View>

        <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, textAlign: 'center', marginTop: spacing.xxl }}>
          BraveVest support · Available Mon–Fri, 9am–6pm WAT
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────────────────────────────────── */

function FaqRow({ icon, q, a }: { icon: any; q: string; a: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md, padding: spacing.lg }}>
      <Feather name={icon} size={18} color={colors.textPrimary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700', lineHeight: 19 }}>{q}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, lineHeight: 19 }}>{a}</Text>
      </View>
    </View>
  );
}

function LinkRow({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
      <Feather name={icon} size={18} color={colors.textPrimary} />
      <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>{label}</Text>
      <Feather name="chevron-right" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}