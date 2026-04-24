import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, gradients, font } from '../theme/tokens';

type Variant = 'primary' | 'ghost' | 'outline';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, style, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && shadow.glow,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {variant === 'primary' && (
        <LinearGradient
          colors={gradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill as any}
        />
      )}
      {variant === 'outline' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.navyBorderHi },
          ]}
        />
      )}
      {variant === 'ghost' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.05)' },
          ]}
        />
      )}
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#06240F' : colors.textLight} />
        ) : (
          <>
            {icon && <Text style={[styles.icon, labelColor(variant)]}>{icon}</Text>}
            <Text style={[styles.label, labelColor(variant)]}>{label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

function labelColor(v: Variant) {
  return { color: v === 'primary' ? '#06240F' : colors.textLight };
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    position: 'relative',
  },
  inner: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontFamily: font.numeric,
  },
  icon: { fontSize: 14, fontWeight: '700', fontFamily: font.numeric },
});
