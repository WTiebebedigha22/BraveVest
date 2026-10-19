import { useRef, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/context/OnboardingContext';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

type Slide = {
  key: string;
  icon: any;
  eyebrow: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    icon: 'compass',
    eyebrow: 'Welcome',
    title: 'Curated opportunities,\nnot random bets.',
    body: 'Real estate, agriculture, and SME lending — vetted by our team before they ever reach you.',
  },
  {
    key: 'diversify',
    icon: 'layers',
    eyebrow: 'Diversify',
    title: 'Start small,\nspread wide.',
    body: 'From ₦5,000 across a curated bundle, so no single outcome decides your return.',
  },
  {
    key: 'track',
    icon: 'trending-up',
    eyebrow: 'Track',
    title: 'Every naira,\naccounted for.',
    body: 'Watch holdings, commitments, and returns in one clean portfolio.',
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
        <Pressable onPress={finish} hitSlop={12}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Skip</Text>
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
          <View key={s.key} style={{ width, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 120, height: 120, borderRadius: 32, backgroundColor: colors.lime + '1A', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl }}>
              <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: colors.lime + '2A', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={s.icon} size={36} color={colors.lime} />
              </View>
            </View>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {s.eyebrow}
            </Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 34, textAlign: 'center', marginTop: spacing.md, lineHeight: 42 }}>
              {s.title}
            </Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 15, textAlign: 'center', marginTop: spacing.md, lineHeight: 22, maxWidth: 320 }}>
              {s.body}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ padding: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: spacing.lg }}>
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === idx ? colors.lime : colors.border,
              }}
            />
          ))}
        </View>

        <PrimaryButton label={idx === SLIDES.length - 1 ? 'Get started' : 'Continue'} onPress={next} />

        <Pressable onPress={finish} style={{ alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>I already have an account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
