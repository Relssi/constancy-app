import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Heading } from '../src/components/Heading';
import { Card } from '../src/components/Card';
import { useStore } from '../src/store/useStore';
import { colors, font } from '../src/theme/tokens';

export default function Reset() {
  const router = useRouter();
  const markFail = useStore((s) => s.markFail);

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ voltar</Text>
      </Pressable>
      <Heading eyebrow="Reset" serif="Ok." sans="Próxima Refeição." />
      <Text style={styles.body}>
        Você não falhou o processo. Falhou uma decisão. Elas acontecem.
      </Text>
      <Text style={styles.body}>
        O que quebra a constância não é o erro — é o "já que errei, tanto faz".
      </Text>

      <Card variant="accent">
        <Text style={styles.cardTitle}>Foca nisso agora:</Text>
        <View style={{ gap: 10, marginTop: 10 }}>
          <Text style={styles.item}>· Bebe um copo de água.</Text>
          <Text style={styles.item}>· Próxima refeição = novo começo.</Text>
          <Text style={styles.item}>· Não compensa. Não pune. Só continua.</Text>
        </View>
      </Card>

      <View style={{ flex: 1 }} />
      <Button
        label="Sigo daqui"
        onPress={() => {
          markFail();
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 14 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 23 },
  cardTitle: { color: colors.textLight, fontSize: 16, fontWeight: '700', fontFamily: font.serif, fontStyle: 'italic' },
  item: { color: colors.textLight, fontSize: 15, lineHeight: 22 },
});
