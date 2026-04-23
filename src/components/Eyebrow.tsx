import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

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
  text: { color: colors.green, fontSize: 10.5, letterSpacing: 3, fontWeight: '800' },
});
