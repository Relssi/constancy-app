import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/tokens';

type Props = {
  percent: number;
  size?: number;
  label?: string;
  sublabel?: string;
  color?: string;
};

export function Donut({ percent, size = 110, label, sublabel, color }: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, percent));
  const dash = (c * clamped) / 100;
  // Auto color by percent if not provided: red >100, amber 90-100, green 50-90, muted <50
  const autoColor =
    percent > 105
      ? colors.danger
      : percent >= 90
        ? colors.green
        : percent >= 50
          ? colors.green
          : colors.textMuted;
  const ringColor = color ?? autoColor;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill as any}>
        <View style={styles.center}>
          <Text style={[styles.val, { color: ringColor }]}>{label ?? `${percent}%`}</Text>
          {sublabel && <Text style={styles.sub}>{sublabel}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  val: { fontWeight: '800', fontSize: 22 },
  sub: { color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginTop: 2 },
});
