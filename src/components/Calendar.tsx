import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Day = { day: number; taken: boolean; future: boolean; today: boolean };

export function Calendar({ days }: { days: Day[] }) {
  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  return (
    <View style={{ gap: 8 }}>
      {weeks.map((w, wi) => (
        <View key={wi}>
          <View style={styles.row}>
            {labels.map((l, i) => (
              <Text key={i} style={styles.label}>
                {l}
              </Text>
            ))}
          </View>
          <View style={styles.row}>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = w[i];
              if (!d) return <View key={i} style={styles.cellEmpty} />;
              const bg = d.future
                ? 'transparent'
                : d.taken
                ? colors.green
                : 'rgba(255,255,255,0.04)';
              const border = d.today ? colors.green : 'transparent';
              const textColor = d.future
                ? colors.textDim
                : d.taken
                ? '#06240F'
                : colors.textMuted;
              return (
                <View
                  key={i}
                  style={[
                    styles.cell,
                    { backgroundColor: bg, borderColor: border, borderWidth: d.today ? 2 : 0 },
                  ]}
                >
                  <Text style={[styles.num, { color: textColor, fontWeight: d.taken ? '800' : '600' }]}>
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  label: { flex: 1, textAlign: 'center', color: colors.textDim, fontSize: 10, marginBottom: 4 },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 42,
  },
  cellEmpty: { flex: 1, aspectRatio: 1, maxWidth: 42 },
  num: { fontSize: 13 },
});
