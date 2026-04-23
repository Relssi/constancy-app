import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Card } from '../src/components/Card';
import { Eyebrow } from '../src/components/Eyebrow';
import { useStore } from '../src/store/useStore';
import { contentForUser } from '../src/lib/personalization';
import { colors, font } from '../src/theme/tokens';

export default function Content() {
  const router = useRouter();
  const { profile, checkIns } = useStore();
  const items = contentForUser(profile, checkIns);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>
      <View>
        <Eyebrow text="Dicas Pra Você" />
        <Text style={styles.title}>Conselhos simples.</Text>
        <Text style={styles.sub}>Escolhidos pelo seu perfil. Sem complicar.</Text>
      </View>
      {items.map((it, i) => (
        <Card key={i}>
          <Text style={styles.tag}>— {it.tag.toUpperCase()}</Text>
          <Text style={styles.titleItem}>{it.title}</Text>
          <Text style={styles.bodyItem}>{it.body}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  title: {
    color: colors.textLight,
    fontSize: 36,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 42,
    marginTop: 8,
  },
  sub: { color: colors.textMuted, fontSize: 15, marginTop: 10, lineHeight: 24 },
  tag: { color: colors.green, fontSize: 11, letterSpacing: 2, fontWeight: '800', marginBottom: 10 },
  titleItem: {
    color: colors.textLight,
    fontSize: 22,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 30,
  },
  bodyItem: { color: colors.textLight, fontSize: 16, lineHeight: 25, marginTop: 10, opacity: 0.85 },
});
