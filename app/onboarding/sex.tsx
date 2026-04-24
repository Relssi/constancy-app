import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Pill } from '../../src/components/Pill';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, Sex } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

export default function OnboardingSex() {
  const [sel, setSel] = useState<Sex | null>(null);
  const setProfile = useStore((s) => s.setProfile);
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.step}>PERGUNTA 4 DE 6</Text>
      <Eyebrow text="Sobre Você" />
      <Text style={styles.title}>Você é{'\n'}homem ou mulher?</Text>
      <Text style={styles.body}>
        Isso ajuda o aplicativo a calcular quantas calorias seu corpo gasta por dia.
      </Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        <Pill label="Mulher" active={sel === 'female'} onPress={() => setSel('female')} style={{ paddingVertical: 20 }} />
        <Pill label="Homem" active={sel === 'male'} onPress={() => setSel('male')} style={{ paddingVertical: 20 }} />
      </View>
      <View style={{ flex: 1 }} />
      <Button
        label="Continuar"
        disabled={!sel}
        onPress={() => {
          if (sel) setProfile({ sex: sel });
          router.push('/onboarding/body');
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
