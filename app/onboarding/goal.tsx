import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Pill } from '../../src/components/Pill';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, Goal } from '../../src/store/useStore';
import { scheduleCheckInReminders, requestPermission } from '../../src/lib/notifications';
import { colors, font } from '../../src/theme/tokens';

const OPTIONS: { v: Goal; label: string; hint: string }[] = [
  { v: 'lose_weight', label: 'Emagrecer', hint: 'Quero perder peso com calma' },
  { v: 'appetite', label: 'Controlar a vontade', hint: 'Diminuir a vontade de beliscar' },
  { v: 'discipline', label: 'Manter a rotina', hint: 'Seguir melhor o meu plano' },
];

export default function OnboardingGoal() {
  const [sel, setSel] = useState<Goal | null>(null);
  const { setProfile, finishOnboarding, profile } = useStore();
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.step}>PERGUNTA 3 DE 3</Text>
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
        label="Pronto, ativar aplicativo"
        disabled={!sel}
        onPress={async () => {
          if (sel) setProfile({ goal: sel });
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
  step: { color: colors.green, fontWeight: '800', letterSpacing: 2, fontSize: 13 },
  title: {
    color: colors.textLight,
    fontSize: 36,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 42,
    marginTop: 4,
  },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 25 },
});
