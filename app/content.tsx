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
  back: { color: colors.textMuted, fontSize: 15, fontWeight: '600', fontFamily: font.numeric, letterSpacing: -0.1 },
  title: {
    color: colors.textLight,
    fontSize: 40,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 46,
    marginTop: 12,
    letterSpacing: -0.9,
  },
  sub: { color: colors.textMuted, fontSize: 15, marginTop: 10, lineHeight: 23, letterSpacing: -0.1 },
  tag: { color: colors.green, fontSize: 11, letterSpacing: 2.4, fontWeight: '700', marginBottom: 10, fontFamily: font.numeric },
  titleItem: {
    color: colors.textLight,
    fontSize: 22,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  bodyItem: { color: colors.textLight, fontSize: 15.5, lineHeight: 24, marginTop: 10, opacity: 0.85, letterSpacing: -0.1 },
});
