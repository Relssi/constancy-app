import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Card } from '../src/components/Card';
import { Heading } from '../src/components/Heading';
import { useStore } from '../src/store/useStore';
import { contentForUser } from '../src/lib/personalization';
import { colors, font } from '../src/theme/tokens';

export default function Content() {
  const router = useRouter();
  const { profile, checkIns } = useStore();
  const items = contentForUser(profile, checkIns);

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ voltar</Text>
      </Pressable>
      <Heading eyebrow="Pra você" serif="Conteúdo" sans="Cirúrgico." />
      <Text style={styles.body}>Nada genérico. Só o que fala com o seu padrão.</Text>
      {items.map((it, i) => (
        <Card key={i}>
          <Text style={styles.tag}>— {it.tag.toUpperCase()}</Text>
          <Text style={styles.title}>{it.title}</Text>
          <Text style={styles.bodyItem}>{it.body}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 14 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  tag: { color: colors.green, fontSize: 10, letterSpacing: 2, fontWeight: '800', marginBottom: 8 },
  title: {
    color: colors.textLight,
    fontSize: 20,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  bodyItem: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: 8 },
});
