import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Heading } from '../../src/components/Heading';
import { Pill } from '../../src/components/Pill';
import { useStore, Goal } from '../../src/store/useStore';
import { scheduleCheckInReminders, requestPermission } from '../../src/lib/notifications';
import { colors } from '../../src/theme/tokens';

const OPTIONS: { v: Goal; label: string }[] = [
  { v: 'lose_weight', label: 'Emagrecer' },
  { v: 'appetite', label: 'Controlar apetite' },
  { v: 'discipline', label: 'Disciplina alimentar' },
];

export default function OnboardingGoal() {
  const [sel, setSel] = useState<Goal | null>(null);
  const { setProfile, finishOnboarding, profile } = useStore();
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.step}>3 / 3</Text>
      <Heading serif="Qual o" sans="Objetivo Principal?" />
      <Text style={styles.body}>O app foca tudo nisso. Sem dispersão.</Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        {OPTIONS.map((o) => (
          <Pill
            key={o.v}
            label={o.label}
            active={sel === o.v}
            onPress={() => setSel(o.v)}
            style={{ paddingVertical: 16 }}
          />
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <Button
        label="Ativar suporte"
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
  step: { color: colors.green, fontWeight: '800', letterSpacing: 2, fontSize: 12 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
});
