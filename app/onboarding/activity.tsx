import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Pill } from '../../src/components/Pill';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, Activity } from '../../src/store/useStore';
import { scheduleCheckInReminders, requestPermission } from '../../src/lib/notifications';
import { colors, font } from '../../src/theme/tokens';

const OPTIONS: { v: Activity; label: string; hint: string }[] = [
  { v: 'sedentary', label: 'Fico mais parado', hint: 'Trabalho sentado, pouco movimento' },
  { v: 'light', label: 'Ando um pouco', hint: 'Caminho 1 ou 2 vezes na semana' },
  { v: 'moderate', label: 'Me mexo bastante', hint: 'Exercício 3 a 4 vezes na semana' },
  { v: 'active', label: 'Sou bem ativo', hint: 'Exercício quase todo dia' },
];

export default function OnboardingActivity() {
  const [sel, setSel] = useState<Activity | null>(null);
  const { setProfile, finishOnboarding, profile } = useStore();
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.step}>PERGUNTA 6 DE 6</Text>
      <Eyebrow text="Seu Dia a Dia" />
      <Text style={styles.title}>Como é seu{'\n'}dia a dia?</Text>
      <Text style={styles.body}>
        Não precisa ser exato. Escolha o que chega mais perto da sua rotina.
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
        label="Pronto, ativar aplicativo"
        disabled={!sel}
        onPress={async () => {
          if (sel) setProfile({ activity: sel });
          finishOnboarding();
          await requestPermission();
          await scheduleCheckInReminders(profile.lossSlot);
          router.replace('/');
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
