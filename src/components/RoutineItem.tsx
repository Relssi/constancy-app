import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Props = {
  label: string;
  detail: string;
  time: string;
  done: boolean;
  onToggle: () => void;
};

export function RoutineItem({ label, detail, time, done, onToggle }: Props) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
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
      <Text style={styles.time}>{time}</Text>
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
    borderRadius: 16,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.navyBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.green, borderColor: colors.green },
  tick: { color: '#06240F', fontWeight: '900', fontSize: 14 },
  label: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
  detail: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  time: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
});
