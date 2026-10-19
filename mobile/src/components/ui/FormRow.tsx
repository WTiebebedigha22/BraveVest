import { View, Text, TextInput } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export function FormRow({
  label, value, onChange, placeholder, numeric, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
  hint?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={numeric ? 'numeric' : 'default'}
        style={{
          backgroundColor: colors.surfaceMuted, color: colors.textPrimary,
          fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
          borderRadius: radii.input, fontSize: 15, borderWidth: 1, borderColor: colors.border,
        }}
      />
      {hint ? (
        <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: 5 }}>{hint}</Text>
      ) : null}
    </View>
  );
}
