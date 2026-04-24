import React from 'react';
import { Pressable, View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, font } from '../theme/tokens';

type Props = {
  label: string;
  detail: string;
  time: string;
  done: boolean;
  onToggle: () => void;
};

export function RoutineItem({ label, detail, time, done, onToggle }: Props) {
  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <LinearGradient
        colors={
          done
            ? ['rgba(34,197,94,0.10)', 'rgba(34,197,94,0.02)']
            : ['rgba(255,255,255,0.045)', 'rgba(255,255,255,0.015)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill as any}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: done ? 'rgba(34,197,94,0.28)' : colors.navyBorder,
          },
        ]}
      />
      <View style={[styles.check, done && styles.checkDone]}>
        {done && <Text style={styles.tick}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.label,
            done && { textDecorationLine: 'line-through', color: colors.textDim },
          ]}
        >
          {label}
        </Text>
        <Text style={[styles.detail, done && { color: colors.textDim }]}>{detail}</Text>
      </View>
      <View style={styles.timeBadge}>
        <Text style={[styles.time, done && { color: colors.green }]}>{time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ transition: 'all 0.2s ease' } as any) : {}),
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.navyBorderHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  tick: { color: '#06240F', fontWeight: '900', fontSize: 14 },
  label: { color: colors.textLight, fontSize: 15.5, fontWeight: '600', letterSpacing: -0.2 },
  detail: { color: colors.textMuted, fontSize: 12.5, marginTop: 3, letterSpacing: -0.1 },
  timeBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  time: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    fontFamily: font.numeric,
  },
});
