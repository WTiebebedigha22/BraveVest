import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrency } from '@/context/CurrencyContext';
import { fonts, radii, spacing } from '@/theme/tokens';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import type { FundingRequest } from '@/api/hooks';

export function FundingCard({ request, onPress }: { request: FundingRequest; onPress?: () => void }) {
  const { colors } = useTheme();
  const { format } = useCurrency();

  const requested = Number(request.amountRequested ?? 0);
  const funded = Number(request.amountFunded ?? 0);
  const pct = requested > 0 ? Math.min(100, Math.round((funded / requested) * 100)) : 0;
  const target = request.proposedReturnPct != null ? Number(request.proposedReturnPct) : null;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderRadius: radii.card,
        borderWidth: 1, borderColor: colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
        <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' }} numberOfLines={2}>
          {request.title}
        </Text>
        {target != null && (
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>
            {target.toFixed(1)}%
          </Text>
        )}
      </View>

      {request.summary ? (
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, lineHeight: 18 }} numberOfLines={2}>
          {request.summary}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {request.category ? (
            <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.surfaceMuted }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, fontWeight: '600' }}>
                {request.category.replace('_', ' ')}
              </Text>
            </View>
          ) : null}
          {request.durationMonths ? (
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>
              {request.durationMonths}mo
            </Text>
          ) : null}
        </View>
        {request.status !== 'PUBLISHED' && <StatusBadge status={request.status} />}
      </View>

      <View style={{ marginTop: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>
            {format(funded)} raised
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>
            of {format(requested)}
          </Text>
        </View>
        <ProgressBar percent={pct} />
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, textAlign: 'right', marginTop: 4 }}>
          {pct}% funded
        </Text>
      </View>
    </Pressable>
  );
}
