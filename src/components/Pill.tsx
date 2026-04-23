import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme/tokens';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Pill({ label, active, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {active ? (
        <LinearGradient
          colors={['rgba(34,197,94,0.22)', 'rgba(34,197,94,0.08)'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill as any}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.03)' }]} />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: active ? 'rgba(34,197,94,0.5)' : colors.navyBorder,
          },
        ]}
      />
      <Text style={[styles.label, { color: active ? colors.green : colors.textLight }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ transition: 'all 0.15s ease' } as any) : {}),
  },
  label: { fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
});
