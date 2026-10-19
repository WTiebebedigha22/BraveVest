import { useRef, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/context/OnboardingContext';
import { Button } from '@/components/ui/Button';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  previewKind: 'card' | 'portfolio' | 'goals';
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    eyebrow: 'Welcome to BraveVest',
    title: 'Stretch out your investments over time',
    body: 'Put money to work in vetted solar, real estate, and SME opportunities — from as little as your first paycheck.',
    previewKind: 'card',
  },
  {
    key: 'portfolio',
    eyebrow: 'Track everything',
    title: 'One portfolio, every holding',
    body: 'See what you own, what it\'s worth, and how each position is performing — all in a single view.',
    previewKind: 'portfolio',
  },
  {
    key: 'goals',
    eyebrow: 'Save with purpose',
    title: 'Set goals and watch them fill',
    body: 'Define what you\'re saving for. Contribute when you can. Watch the bar move.',
    previewKind: 'goals',
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { colors } = useTheme();
  const { markSeen } = useOnboarding();
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== idx) setIdx(next);
  }

  function finish() {
    markSeen();
    router.replace('/(auth)/login');
  }

  function next() {
    if (idx === SLIDES.length - 1) finish();
    else scrollRef.current?.scrollTo({ x: width * (idx + 1), animated: true });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.lg }}>
        <Pressable onPress={finish}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s) => (
          <View key={s.key} style={{ width, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
            <Preview kind={s.previewKind} />
            <View style={{ height: spacing.xxl }} />
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.eyebrow}</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 32, textAlign: 'center', marginTop: spacing.md, lineHeight: 40 }}>{s.title}</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 15, textAlign: 'center', marginTop: spacing.md, lineHeight: 22, paddingHorizontal: spacing.lg }}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ padding: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: spacing.lg }}>
          {SLIDES.map((s, i) => (
            <View key={s.key} style={{
              width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
              backgroundColor: i === idx ? colors.lime : colors.border,
            }} />
          ))}
        </View>
        <Button label={idx === SLIDES.length - 1 ? 'Get started' : 'Continue'} onPress={next} full />
        <Pressable onPress={finish} style={{ alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>Browse assets</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Preview({ kind }: { kind: Slide['previewKind'] }) {
  const { colors } = useTheme();

  if (kind === 'card') {
    return (
      <View style={{ width: '100%', maxWidth: 320 }}>
        <LinearGradient colors={[...colors.heroGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radii.card, padding: spacing.xl, ...shadows.card }}>
          <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, opacity: 0.75 }}>USD Balance</Text>
          <Text style={{ color: colors.heroText, fontFamily: fonts.serif, fontSize: 34, marginTop: 4 }}>$8,786.55</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
            {['Deposit', 'Withdraw', 'Send', 'Receive'].map((label) => (
              <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.heroText + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.heroText, fontSize: 16 }}>◈</Text>
                </View>
                <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 10, marginTop: 6, opacity: 0.9 }}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (kind === 'portfolio') {
    return (
      <View style={{ width: '100%', maxWidth: 320 }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1, borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Crypto</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 4 }}>$20,321</Text>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 11, marginTop: 4 }}>▲ 0.24%</Text>
          </View>
          <View style={{ flex: 1, borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.lime }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, opacity: 0.8 }}>Stocks</Text>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 4 }}>$5,687</Text>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, marginTop: 4, opacity: 0.85 }}>▼ 1.35%</Text>
          </View>
        </View>
        <View style={{ borderRadius: radii.card, padding: spacing.lg, marginTop: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Profits</Text>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700', marginTop: 4 }}>$2,567.00</Text>
        </View>
      </View>
    );
  }

  // goals
  return (
    <View style={{ width: '100%', maxWidth: 320 }}>
      <View style={{ borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Emergency fund</Text>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>62%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: colors.surfaceMuted, borderRadius: 4, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 8, backgroundColor: colors.lime, borderRadius: 4, width: '62%' }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>₦310,000</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>of ₦500,000</Text>
        </View>
      </View>
      <View style={{ borderRadius: radii.card, padding: spacing.lg, marginTop: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Lagos trip</Text>
          <Text style={{ color: colors.teal, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>88%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: colors.surfaceMuted, borderRadius: 4, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 8, backgroundColor: colors.teal, borderRadius: 4, width: '88%' }} />
        </View>
      </View>
    </View>
  );
}
