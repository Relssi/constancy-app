import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { colors, font } from '../src/theme/tokens';

const PHASES = [
  { label: 'Inspira', seconds: 4 },
  { label: 'Segura', seconds: 2 },
  { label: 'Expira', seconds: 4 },
];

export default function Intervention() {
  const router = useRouter();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const scale = useRef(new Animated.Value(0.6)).current;
  const lastTarget = useRef(0.6);

  useEffect(() => {
    const p = PHASES[phaseIdx];
    const target = p.label === 'Inspira' ? 1 : p.label === 'Expira' ? 0.6 : lastTarget.current;
    lastTarget.current = target;
    Animated.timing(scale, {
      toValue: target,
      duration: p.seconds * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => {
      if (phaseIdx === PHASES.length - 1) {
        setCycle((c) => c + 1);
        setPhaseIdx(0);
      } else setPhaseIdx((i) => i + 1);
    }, p.seconds * 1000);
    return () => clearTimeout(t);
  }, [phaseIdx]);

  const done = cycle >= 3;

  return (
    <Screen scroll={false}>
      <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
        <Text style={styles.back}>‹ voltar</Text>
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.eyebrow}>— RESPIRA</Text>
        <Text style={styles.headline}>A vontade passa.</Text>
        <Text style={styles.sub}>A decisão fica.</Text>
        <Animated.View style={[styles.orb, { transform: [{ scale }] }]} />
        <Text style={styles.phase}>{done ? 'Pronto.' : PHASES[phaseIdx].label}</Text>
        <Text style={styles.cycle}>{done ? '3 / 3 ciclos' : `${cycle} / 3 ciclos`}</Text>
      </View>
      <Button
        label={done ? 'Voltar pro plano' : 'Já consegui decidir'}
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  eyebrow: { color: colors.green, fontSize: 11, letterSpacing: 3, fontWeight: '800' },
  headline: { color: colors.textLight, fontSize: 30, fontFamily: font.serif, fontStyle: 'italic' },
  sub: { color: colors.green, fontSize: 30, fontFamily: font.serif, fontStyle: 'italic' },
  orb: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 2,
    borderColor: colors.green,
    marginTop: 30,
    shadowColor: colors.green,
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  phase: { color: colors.textLight, fontSize: 22, fontWeight: '700', marginTop: 10 },
  cycle: { color: colors.textMuted, fontSize: 13, letterSpacing: 1 },
});
