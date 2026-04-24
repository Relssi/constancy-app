import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Eyebrow } from '../src/components/Eyebrow';
import { Pill } from '../src/components/Pill';
import { useStore, CheckIn } from '../src/store/useStore';
import { currentSlot } from '../src/lib/personalization';
import { colors, font } from '../src/theme/tokens';

export default function CheckInScreen() {
  const [hunger, setHunger] = useState<CheckIn['hunger'] | null>(null);
  const [control, setControl] = useState<CheckIn['control'] | null>(null);
  const addCheckIn = useStore((s) => s.addCheckIn);
  const router = useRouter();

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

      <View>
        <Eyebrow text="Como Você Está" />
        <Text style={styles.title}>Como está{'\n'}sua vontade agora?</Text>
        <Text style={styles.caption}>
          1 é pouca vontade. 5 é muita vontade de comer algo.
        </Text>
      </View>

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
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>pouca</Text>
        <Text style={styles.rangeLabel}>muita</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Eyebrow text="E no Geral Hoje?" />
        <Text style={styles.title2}>Como foi seu dia?</Text>
        <Text style={styles.caption}>
          Escolha como você tá se sentindo no controle da alimentação hoje.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        {(['high', 'medium', 'low'] as const).map((c) => (
          <Pill
            key={c}
            label={
              c === 'high'
                ? 'Bem, segui o plano'
                : c === 'medium'
                ? 'Mais ou menos'
                : 'Difícil, não consegui muito'
            }
            active={control === c}
            onPress={() => setControl(c)}
            style={{ paddingVertical: 18 }}
          />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label="Salvar resposta"
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
  backBtn: { paddingVertical: 6 },
  back: { color: colors.textMuted, fontSize: 15, fontWeight: '600', fontFamily: font.numeric, letterSpacing: -0.1 },
  title: {
    color: colors.textLight,
    fontSize: 34,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 40,
    marginTop: 10,
    letterSpacing: -0.7,
  },
  title2: {
    color: colors.textLight,
    fontSize: 28,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 34,
    marginTop: 8,
    letterSpacing: -0.6,
  },
  caption: { color: colors.textMuted, fontSize: 14.5, lineHeight: 22, marginTop: 10, fontStyle: 'italic', letterSpacing: -0.1 },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 4 },
  rangeLabel: { color: colors.textDim, fontSize: 11, fontWeight: '600', letterSpacing: 1, fontFamily: font.numeric },
});
