import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
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
      style={[
        styles.pill,
        active ? styles.active : styles.idle,
        style,
      ]}
    >
      <Text style={[styles.label, { color: active ? '#06240F' : colors.textLight }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  idle: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: colors.navyBorder },
  active: { backgroundColor: colors.green, borderColor: colors.green },
  label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
});
