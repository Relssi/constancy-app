import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Props = { data: { label: string; value: number }[] };

export function Bars({ data }: Props) {
  return (
    <View style={{ gap: 10 }}>
      {data.map((d, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.label}>{d.label}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${d.value}%` }]} />
          </View>
          <Text style={styles.val}>{d.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { color: colors.textMuted, fontSize: 12, width: 34 },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.green, borderRadius: 5 },
  val: { color: colors.textMuted, fontSize: 11, width: 28, textAlign: 'right' },
});
