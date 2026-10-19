import { View, Text, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export function AmountInput({
  label, value, onChange, placeholder, currency, hint, error, onMax, maxAvailable,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  currency: string;
  hint?: string;
  error?: string;
  onMax?: () => void;
  maxAvailable?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      {(label || maxAvailable) ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          {label ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{label}</Text> : <View />}
          {maxAvailable ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Available: {maxAvailable}</Text> : null}
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.input,
          borderWidth: 1,
          borderColor: error ? '#C0363A' : colors.border,
          paddingHorizontal: spacing.md,
        }}
      >
        <TextInput
          value={value}
          onChangeText={(v) => onChange(v.replace(/[^0-9.]/g, ''))}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType="decimal-pad"
          style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700', paddingVertical: 14 }}
        />
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700', marginRight: 8 }}>{currency}</Text>
        {onMax ? (
          <Pressable onPress={onMax} hitSlop={8}>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Max</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={{ color: '#C0363A', fontFamily: fonts.sans, fontSize: 11, marginTop: 5 }}>{error}</Text>
      ) : hint ? (
        <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: 5 }}>{hint}</Text>
      ) : null}
    </View>
  );
}
