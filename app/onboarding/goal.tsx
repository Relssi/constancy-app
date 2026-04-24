import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Pill } from '../../src/components/Pill';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, Goal } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

const OPTIONS: { v: Goal; label: string; hint: string }[] = [
  { v: 'lose_weight', label: 'Emagrecer', hint: 'Quero perder peso com calma' },
  { v: 'appetite', label: 'Controlar a vontade', hint: 'Diminuir a vontade de beliscar' },
  { v: 'discipline', label: 'Manter a rotina', hint: 'Seguir melhor o meu plano' },
];

export default function OnboardingGoal() {
  const [sel, setSel] = useState<Goal | null>(null);
  const setProfile = useStore((s) => s.setProfile);
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.step}>PERGUNTA 3 DE 6</Text>
      <Eyebrow text="Seu Objetivo" />
      <Text style={styles.title}>O que você{'\n'}quer alcançar?</Text>
      <Text style={styles.body}>
        O aplicativo vai focar tudo nisso. Sem confusão.
      </Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        {OPTIONS.map((o) => (
          <Pill
            key={o.v}
            label={`${o.label}  —  ${o.hint}`}
            active={sel === o.v}
            onPress={() => setSel(o.v)}
            style={{ paddingVertical: 20 }}
          />
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <Button
        label="Continuar"
        disabled={!sel}
        onPress={() => {
          if (sel) setProfile({ goal: sel });
          router.push('/onboarding/sex');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { color: colors.green, fontWeight: '700', letterSpacing: 2.4, fontSize: 11, fontFamily: font.numeric },
  title: {
    color: colors.textLight,
    fontSize: 38,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 44,
    marginTop: 8,
    letterSpacing: -0.8,
  },
  body: { color: colors.textMuted, fontSize: 15.5, lineHeight: 24, letterSpacing: -0.1 },
});
