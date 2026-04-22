import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Heading } from '../../src/components/Heading';
import { Pill } from '../../src/components/Pill';
import { useStore, HungerType } from '../../src/store/useStore';
import { colors } from '../../src/theme/tokens';

const OPTIONS: { v: HungerType; label: string; hint: string }[] = [
  { v: 'physical', label: 'Física', hint: 'Vem aos poucos, estômago vazio' },
  { v: 'emotional', label: 'Emocional', hint: 'Vem do nada, ansiedade, tédio' },
  { v: 'mixed', label: 'Os dois', hint: 'Depende do dia' },
];

export default function OnboardingHunger() {
  const [sel, setSel] = useState<HungerType | null>(null);
  const setProfile = useStore((s) => s.setProfile);
  const router = useRouter();
  return (
    <Screen>
      <Text style={styles.step}>2 / 3</Text>
      <Heading serif="Que tipo" sans="De Fome Te Pega?" />
      <Text style={styles.body}>
        Fome emocional e física reagem diferente. Isso muda a intervenção.
      </Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        {OPTIONS.map((o) => (
          <Pill
            key={o.v}
            label={`${o.label}  ·  ${o.hint}`}
            active={sel === o.v}
            onPress={() => setSel(o.v)}
            style={{ paddingVertical: 16 }}
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
  step: { color: colors.green, fontWeight: '800', letterSpacing: 2, fontSize: 12 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
});
