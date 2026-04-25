import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeightEntry } from '../store/useStore';
import { colors, font } from '../theme/tokens';

type Props = { data: WeightEntry[]; targetKg?: number };

export function WeightChart({ data, targetKg }: Props) {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Registre seu peso pra começar a ver o gráfico.
        </Text>
      </View>
    );
  }

  const sorted = [...data].sort((a, b) => a.ts - b.ts);
  const show = sorted.slice(-12);
  const kgs = show.map((e) => e.kg);
  const candidates = [...kgs];
  if (targetKg) candidates.push(targetKg);
  const rawMin = Math.min(...candidates);
  const rawMax = Math.max(...candidates);
  const pad = Math.max((rawMax - rawMin) * 0.2, 0.5);
  const min = rawMin - pad;
  const max = rawMax + pad;
  const span = Math.max(max - min, 1);

  const H = 140;

  const targetTop = targetKg ? H - ((targetKg - min) / span) * H : null;
  const clampedTargetTop = targetTop !== null
    ? Math.max(0, Math.min(H, targetTop))
    : null;

  return (
    <View style={{ overflow: 'visible' }}>
      <View style={{ height: H, position: 'relative', marginTop: 18, paddingHorizontal: 4, overflow: 'visible' }}>
        {clampedTargetTop !== null && (
          <>
            <View style={[styles.targetLine, { top: clampedTargetTop }]} />
            <Text style={[styles.targetLabel, { top: Math.max(0, clampedTargetTop - 14) }]}>meta {targetKg}kg</Text>
          </>
        )}

        <View style={styles.chartRow}>
          {show.map((e, i) => {
            const h = ((e.kg - min) / span) * H;
            const isLast = i === show.length - 1;
            return (
              <View key={e.ts} style={styles.colWrap}>
                {isLast && (
                  <Text style={[styles.valueLabel, { bottom: Math.min(H - 14, h + 12) }]}>{e.kg}kg</Text>
                )}
                {/* barra vertical suave */}
                <View
                  style={[
                    styles.bar,
                    { height: h },
                  ]}
                />
                <View
                  style={[
                    styles.dot,
                    { bottom: h - 5 },
                    isLast && styles.dotLast,
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.xRow}>
        <Text style={styles.xLabel}>{fmt(show[0].ts)}</Text>
        {show.length > 2 && (
          <Text style={styles.xLabel}>{fmt(show[Math.floor(show.length / 2)].ts)}</Text>
        )}
        <Text style={styles.xLabel}>{fmt(show[show.length - 1].ts)}</Text>
      </View>
    </View>
  );
}

function fmt(ts: number) {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    gap: 4,
    overflow: 'visible',
  },
  colWrap: {
    flex: 1,
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    borderRadius: 3,
    backgroundColor: 'rgba(34,197,94,0.18)',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.navy,
  },
  dotLast: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  valueLabel: {
    position: 'absolute',
    color: colors.green,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: font.numeric,
    letterSpacing: -0.3,
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  targetLabel: {
    position: 'absolute',
    right: 4,
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    fontFamily: font.numeric,
  },
  xRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  xLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: font.numeric,
    letterSpacing: 0.3,
  },
});
