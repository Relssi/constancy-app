import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Pill } from '../../src/components/Pill';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, HungerType } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

const OPTIONS: { v: HungerType; label: string; hint: string }[] = [
  { v: 'physical', label: 'Física', hint: 'Vem devagar, o estômago avisa' },
  { v: 'emotional', label: 'Emocional', hint: 'Vem do nada, por ansiedade ou tédio' },
  { v: 'mixed', label: 'Dos dois tipos', hint: 'Depende do dia' },
];

export default function OnboardingHunger() {
  const [sel, setSel] = useState<HungerType | null>(null);
  const setProfile = useStore((s) => s.setProfile);
  const router = useRouter();
  return (
    <Screen>
      <Text style={styles.step}>PERGUNTA 2 DE 6</Text>
      <Eyebrow text="Tipo de Vontade" />
      <Text style={styles.title}>Que tipo de{'\n'}vontade te{'\n'}pega mais?</Text>
      <Text style={styles.body}>
        Cada tipo de vontade responde diferente. Por isso a pergunta.
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
          if (sel) setProfile({ hungerType: sel });
          router.push('/onboarding/goal');
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
