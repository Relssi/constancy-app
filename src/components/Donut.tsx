import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/tokens';

type Props = {
  percent: number;
  size?: number;
  label?: string;
  sublabel?: string;
};

export function Donut({ percent, size = 110, label, sublabel }: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (c * Math.min(100, Math.max(0, percent))) / 100;
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
          stroke={colors.green}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill as any}>
        <View style={styles.center}>
          <Text style={styles.val}>{label ?? `${percent}%`}</Text>
          {sublabel && <Text style={styles.sub}>{sublabel}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  val: { color: colors.green, fontWeight: '800', fontSize: 22 },
  sub: { color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginTop: 2 },
});
