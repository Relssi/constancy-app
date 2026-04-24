import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../theme/tokens';

export function Eyebrow({ text, align = 'left' }: { text: string; align?: 'left' | 'center' }) {
  return (
    <View style={[styles.row, align === 'center' && { justifyContent: 'center' }]}>
      <View style={styles.line} />
      <Text style={styles.text}>{text.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { width: 22, height: 1.5, backgroundColor: colors.green, borderRadius: 1 },
  text: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
    fontFamily: font.numeric,
  },
});
