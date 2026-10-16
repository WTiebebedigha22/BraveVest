import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';

const TONE = {
  DRAFT: 'muted',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warn',
  APPROVED: 'good',
  PUBLISHED: 'good',
  FUNDED: 'good',
  CANCELLED: 'muted',
  REJECTED: 'bad',
  DEFAULTED: 'bad',
  CLOSED: 'muted',
  CONFIRMED: 'good',
  PENDING: 'warn',
  REFUNDED: 'info',
} as const;

export function StatusBadge({ status }: { status?: string }) {
  const { colors } = useTheme();
  const s = (status ?? 'DRAFT').toUpperCase();
  const tone = (TONE as any)[s] ?? 'muted';

  const bg =
    tone === 'good' ? colors.lime + '1F' :
    tone === 'warn' ? '#F5A62322' :
    tone === 'bad' ? '#E5484D22' :
    tone === 'info' ? colors.teal + '1F' :
    colors.surfaceMuted;

  const fg =
    tone === 'good' ? colors.lime :
    tone === 'warn' ? '#B8791A' :
    tone === 'bad' ? '#C0363A' :
    tone === 'info' ? colors.teal :
    colors.textSecondary;

  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, backgroundColor: bg, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }}>
        {s.replace('_', ' ')}
      </Text>
    </View>
  );
}
