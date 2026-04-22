import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, radius, shadow } from '../theme/tokens';

type Variant = 'primary' | 'ghost' | 'outline';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const v = variantStyle(variant);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        v.container,
        variant === 'primary' && shadow.glow,
        (disabled || loading) && { opacity: 0.55 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.label.color as string} />
      ) : (
        <Text style={[styles.label, v.label]}>{label}</Text>
      )}
    </Pressable>
  );
}

function variantStyle(v: Variant) {
  switch (v) {
    case 'primary':
      return {
        container: { backgroundColor: colors.green },
        label: { color: '#06240F' },
      };
    case 'outline':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.navyBorder },
        label: { color: colors.textLight },
      };
    case 'ghost':
    default:
      return {
        container: { backgroundColor: 'rgba(255,255,255,0.06)' },
        label: { color: colors.textLight },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
