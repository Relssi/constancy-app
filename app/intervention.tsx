import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { colors, font } from '../src/theme/tokens';

const PHASES = [
  { label: 'Puxe o ar devagar', seconds: 4 },
  { label: 'Segure', seconds: 2 },
  { label: 'Solte o ar', seconds: 4 },
];

export default function Intervention() {
  const router = useRouter();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const scale = useRef(new Animated.Value(0.6)).current;
  const lastTarget = useRef(0.6);

  useEffect(() => {
    const p = PHASES[phaseIdx];
    const target =
      p.label === 'Puxe o ar devagar' ? 1 : p.label === 'Solte o ar' ? 0.6 : lastTarget.current;
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
      <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start', padding: 6 }}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.eyebrow}>— RESPIRE COMIGO</Text>
        <Text style={styles.headline}>A vontade passa.</Text>
        <Text style={styles.sub}>A decisão fica.</Text>
        <Animated.View style={[styles.orb, { transform: [{ scale }] }]} />
        <Text style={styles.phase}>{done ? 'Pronto.' : PHASES[phaseIdx].label}</Text>
        <Text style={styles.cycle}>
          {done ? 'Você completou os 3 ciclos' : `${cycle} de 3 respirações`}
        </Text>
        <Text style={styles.helper}>
          {done
            ? 'Beba um copo de água agora. A vontade vai ceder.'
            : 'Siga o círculo verde. Respire no ritmo dele.'}
        </Text>
      </View>
      <Button
        label={done ? 'Voltar pro início' : 'Já estou melhor'}
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 15, fontWeight: '600', fontFamily: font.numeric, letterSpacing: -0.1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  eyebrow: { color: colors.green, fontSize: 11, letterSpacing: 2.4, fontWeight: '700', fontFamily: font.numeric },
  headline: { color: colors.textLight, fontSize: 34, fontFamily: font.serif, fontStyle: 'italic', letterSpacing: -0.7 },
  sub: { color: colors.green, fontSize: 34, fontFamily: font.serif, fontStyle: 'italic', letterSpacing: -0.7 },
  orb: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 2,
    borderColor: colors.green,
    marginTop: 30,
    shadowColor: colors.green,
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  phase: { color: colors.textLight, fontSize: 22, fontWeight: '600', marginTop: 14, letterSpacing: -0.3 },
  cycle: { color: colors.textMuted, fontSize: 13, fontWeight: '600', fontFamily: font.numeric, letterSpacing: 0.2 },
  helper: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
});
