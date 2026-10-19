import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export function AuthInput({
  label, value, onChange, placeholder, secure, keyboard, autoComplete, error, hint, rightAccessory,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboard?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoComplete?: any;
  error?: string;
  hint?: string;
  rightAccessory?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.input,
          borderWidth: 1,
          borderColor: error ? '#C0363A' : (focused ? colors.lime : colors.border),
          paddingHorizontal: spacing.md,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={hidden}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboard ?? 'default'}
          autoComplete={autoComplete}
          style={{
            flex: 1,
            color: colors.textPrimary,
            fontFamily: fonts.sans,
            fontSize: 15,
            paddingVertical: 14,
          }}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Feather name={hidden ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} />
          </Pressable>
        ) : null}
        {rightAccessory}
      </View>
      {error ? (
        <Text style={{ color: '#C0363A', fontFamily: fonts.sans, fontSize: 11, marginTop: 5 }}>{error}</Text>
      ) : hint ? (
        <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: 5 }}>{hint}</Text>
      ) : null}
    </View>
  );
}
