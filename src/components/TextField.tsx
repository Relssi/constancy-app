import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, font } from '../theme/tokens';

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
  label: { color: colors.textLight, fontSize: 15.5, fontWeight: '600', letterSpacing: -0.2 },
  hint: {
    color: colors.textMuted,
    fontSize: 13.5,
    lineHeight: 20,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 17,
    color: colors.textLight,
    minHeight: 58,
    fontFamily: font.sans,
    letterSpacing: -0.2,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 13.5, fontWeight: '600', letterSpacing: -0.1 },
});
