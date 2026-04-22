import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Heading } from '../../src/components/Heading';
import { Pill } from '../../src/components/Pill';
import { useStore, TimeSlot } from '../../src/store/useStore';
import { colors } from '../../src/theme/tokens';

const OPTIONS: { v: TimeSlot; label: string; hint: string }[] = [
  { v: 'morning', label: 'Manhã', hint: 'Fome ao acordar, café desregulado' },
  { v: 'afternoon', label: 'Tarde', hint: 'Crash depois do almoço, doce às 16h' },
  { v: 'night', label: 'Noite', hint: 'Ataques depois das 20h, tédio, TV' },
];

export default function OnboardingSlot() {
  const [sel, setSel] = useState<TimeSlot | null>(null);
  const setProfile = useStore((s) => s.setProfile);
  const router = useRouter();
  return (
    <Screen>
      <Text style={styles.step}>1 / 3</Text>
      <Heading serif="Quando você" sans="Perde o Controle?" />
      <Text style={styles.body}>
        A hora que mais te derruba. O app vai ficar mais firme nesse momento.
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
          if (sel) setProfile({ lossSlot: sel });
          router.push('/onboarding/hunger');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { color: colors.green, fontWeight: '800', letterSpacing: 2, fontSize: 12 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
});
