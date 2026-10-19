import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';
import { PAYMENT_METHODS, PaymentMethodId } from '@/constants/paymentMethods';

export function PaymentPicker({
  value, onChange, label = 'Payment method',
}: {
  value: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
  label?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginBottom: 10 }}>{label}</Text>
      <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.card, overflow: 'hidden' }}>
        {PAYMENT_METHODS.map((m, i) => {
          const active = value === m.id;
          const disabled = !m.enabled;
          return (
            <Pressable
              key={m.id}
              onPress={() => !disabled && onChange(m.id)}
              disabled={disabled}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.lg,
                borderBottomWidth: i < PAYMENT_METHODS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={m.icon} size={18} color={active ? colors.lime : colors.textPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{m.label}</Text>
                  {m.note ? (
                    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.surface }}>
                      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 10, fontWeight: '700' }}>{m.note}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>{m.sub}</Text>
              </View>
              <View style={{
                width: 20, height: 20, borderRadius: 10,
                borderWidth: 2,
                borderColor: active ? colors.lime : colors.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {active ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.lime }} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
