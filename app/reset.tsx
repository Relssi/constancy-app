import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Eyebrow } from '../src/components/Eyebrow';
import { useStore } from '../src/store/useStore';
import { colors, font } from '../src/theme/tokens';

export default function Reset() {
  const router = useRouter();
  const markFail = useStore((s) => s.markFail);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

      <View>
        <Eyebrow text="Recomeçar" />
        <Text style={styles.title}>Tudo bem.{'\n'}Pode continuar.</Text>
      </View>

      <Text style={styles.body}>
        Você não errou o caminho. Só uma hora difícil. Isso acontece com todo mundo.
      </Text>
      <Text style={styles.body}>
        O que quebra mesmo é pensar "já errei, agora tanto faz". Não é assim.
      </Text>

      <Card variant="accent">
        <Eyebrow text="Faça Agora" />
        <View style={{ gap: 12, marginTop: 14 }}>
          <Step n="1" text="Beba um copo de água devagar." />
          <Step n="2" text="A próxima refeição é um novo começo." />
          <Step n="3" text="Não precisa compensar. Não precisa se punir." />
        </View>
      </Card>

      <View style={{ flex: 1 }} />
      <Button
        label="Entendi, vou continuar"
        onPress={() => {
          markFail();
          router.replace('/');
        }}
      />
    </Screen>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 15, fontWeight: '600', fontFamily: font.numeric, letterSpacing: -0.1 },
  title: {
    color: colors.textLight,
    fontSize: 38,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 44,
    marginTop: 10,
    letterSpacing: -0.8,
  },
  body: { color: colors.textLight, fontSize: 16, lineHeight: 26, opacity: 0.85, letterSpacing: -0.1 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: '#06240F', fontWeight: '700', fontSize: 15, fontFamily: font.numeric },
  stepText: { flex: 1, color: colors.textLight, fontSize: 15.5, lineHeight: 24, letterSpacing: -0.1 },
});
