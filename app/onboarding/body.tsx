import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

export default function OnboardingBody() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const { setProfile, addWeight } = useStore();
  const router = useRouter();

  const ageN = parseInt(age, 10);
  const heightN = parseFloat(height.replace(',', '.'));
  const weightN = parseFloat(weight.replace(',', '.'));

  // aceita altura em cm (165) ou metros (1.65)
  const heightCm = heightN > 3 ? heightN : heightN * 100;

  const valid =
    !isNaN(ageN) && ageN >= 10 && ageN <= 100 &&
    !isNaN(heightCm) && heightCm >= 100 && heightCm <= 230 &&
    !isNaN(weightN) && weightN >= 30 && weightN <= 300;

  return (
    <Screen kbAvoid>
      <Text style={styles.step}>PERGUNTA 5 DE 6</Text>
      <Eyebrow text="Seu Corpo" />
      <Text style={styles.title}>Só mais{'\n'}uns dadinhos.</Text>
      <Text style={styles.body}>
        Com isso o aplicativo calcula quantas calorias seu corpo gasta. Ninguém mais vê esses dados.
      </Text>

      <View style={{ gap: 16, marginTop: 8 }}>
        <TextField
          label="Sua idade"
          hint="Em anos. Ex: 58"
          value={age}
          onChangeText={(v) => setAge(v.replace(/[^0-9]/g, '').slice(0, 3))}
          keyboardType="numeric"
          placeholder="Ex: 58"
        />
        <TextField
          label="Sua altura"
          hint="Pode ser em centímetros (165) ou em metros (1,65)."
          value={height}
          onChangeText={(v) => setHeight(v.replace(/[^0-9.,]/g, '').slice(0, 5))}
          keyboardType="numeric"
          placeholder="Ex: 165"
        />
        <TextField
          label="Seu peso agora"
          hint="Em quilos. Ex: 72. Pode colocar vírgula se quiser."
          value={weight}
          onChangeText={(v) => setWeight(v.replace(/[^0-9.,]/g, '').slice(0, 6))}
          keyboardType="numeric"
          placeholder="Ex: 72"
        />
      </View>

      <View style={{ flex: 1 }} />
      <Button
        label="Continuar"
        disabled={!valid}
        onPress={() => {
          if (valid) {
            setProfile({ age: ageN, heightCm: Math.round(heightCm) });
            addWeight(weightN);
            router.push('/onboarding/activity');
          }
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
  body: { color: colors.textMuted, fontSize: 15.5, lineHeight: 24, letterSpacing: -0.1, marginBottom: 8 },
});
