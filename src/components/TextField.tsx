import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius } from '../theme/tokens';

type Props = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, style, ...rest }: Props) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      <TextInput
        placeholderTextColor={colors.textDim}
        {...rest}
        style={[styles.input, error ? styles.inputError : null, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textLight, fontSize: 16, fontWeight: '700' },
  hint: { color: colors.textMuted, fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 18,
    color: colors.textLight,
    minHeight: 58,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 14, fontWeight: '700' },
});
