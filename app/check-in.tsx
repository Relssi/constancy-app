import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Heading } from '../src/components/Heading';
import { Pill } from '../src/components/Pill';
import { useStore, CheckIn } from '../src/store/useStore';
import { currentSlot } from '../src/lib/personalization';
import { colors } from '../src/theme/tokens';

export default function CheckInScreen() {
  const [hunger, setHunger] = useState<CheckIn['hunger'] | null>(null);
  const [control, setControl] = useState<CheckIn['control'] | null>(null);
  const addCheckIn = useStore((s) => s.addCheckIn);
  const router = useRouter();

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ voltar</Text>
      </Pressable>
      <Heading eyebrow="Check-in" serif="Como tá" sans="A Fome Agora?" />
      <Text style={styles.body}>1 = nenhuma · 5 = intensa</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pill
            key={n}
            label={String(n)}
            active={hunger === n}
            onPress={() => setHunger(n as CheckIn['hunger'])}
            style={{ flex: 1 }}
          />
        ))}
      </View>

      <Text style={[styles.body, { marginTop: 16 }]}>Controle hoje</Text>
      <View style={styles.row}>
        {(['low', 'medium', 'high'] as const).map((c) => (
          <Pill
            key={c}
            label={c === 'low' ? 'Baixo' : c === 'medium' ? 'Médio' : 'Alto'}
            active={control === c}
            onPress={() => setControl(c)}
            style={{ flex: 1 }}
          />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label="Registrar"
        disabled={!hunger || !control}
        onPress={() => {
          if (hunger && control) {
            addCheckIn({ hunger, control, slot: currentSlot() });
            router.replace('/');
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 14 },
  body: { color: colors.textMuted, fontSize: 14 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
});
