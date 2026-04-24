import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConstancyLog } from '../store/useStore';
import { colors, font } from '../theme/tokens';

type Props = { log: ConstancyLog[] };

/** 30 quadradinhos dos últimos 30 dias. Verde = tomou. Cinza = não. */
export function Heatmap30({ log }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysTaken = new Set<string>();
  for (const l of log) {
    if (!l.taken) continue;
    const d = new Date(l.ts);
    d.setHours(0, 0, 0, 0);
    daysTaken.add(d.toDateString());
  }

  const cells: { key: string; taken: boolean; label: number; isFirst: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    cells.push({
      key,
      taken: daysTaken.has(key),
      label: d.getDate(),
      isFirst: d.getDate() === 1,
    });
  }

  const takenCount = cells.filter((c) => c.taken).length;

  return (
    <View>
      <View style={styles.grid}>
        {cells.map((c) => (
          <View key={c.key} style={[styles.cell, c.taken && styles.cellTaken]}>
            {c.isFirst && <Text style={styles.firstLabel}>{c.label}</Text>}
          </View>
        ))}
      </View>
      <Text style={styles.footer}>
        {takenCount} de 30 dias — últimos 30 dias
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  cell: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellTaken: {
    backgroundColor: 'rgba(34,197,94,0.35)',
    borderColor: colors.green,
  },
  firstLabel: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: font.numeric,
    fontWeight: '600',
  },
  footer: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
});
