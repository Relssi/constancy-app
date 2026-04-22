import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { RoutineItem } from '../../src/components/RoutineItem';
import { useStore, DEFAULT_ROUTINE } from '../../src/store/useStore';
import { currentStreak, bestStreak } from '../../src/lib/streak';
import { nextIntervention } from '../../src/lib/personalization';
import { colors, font } from '../../src/theme/tokens';

export default function Home() {
  const router = useRouter();
  const { profile, checkIns, constancyLog, routineDone, toggleRoutine, failedToday } = useStore();
  const streak = currentStreak(constancyLog);
  const best = bestStreak(constancyLog);
  const key = new Date().toDateString();
  const done = routineDone[key] ?? [];
  const greeting = greet();
  const intervention = nextIntervention(profile, checkIns);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{greeting}</Text>
        <Text style={styles.name}>
          {profile.name ?? 'Você'} <Text style={{ color: colors.green }}>✦</Text>
        </Text>
      </View>

      {failedToday && (
        <Card variant="accent">
          <Text style={styles.resetTitle}>Novo começo daqui.</Text>
          <Text style={styles.muted}>Próxima refeição é a linha de partida.</Text>
          <Pressable onPress={() => useStore.getState().clearFail()} style={styles.linkBtn}>
            <Text style={styles.link}>Ok, sigo ›</Text>
          </Pressable>
        </Card>
      )}

      <Card style={styles.streakCard}>
        <Text style={styles.streakLabel}>DIAS CONSECUTIVOS</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakBig}>{streak}</Text>
          <Text style={styles.streakUnit}>dias</Text>
        </View>
        <Text style={styles.muted}>
          Melhor sequência: <Text style={{ color: colors.textLight, fontWeight: '800' }}>{best} dias</Text>
          {best > streak ? ' — você tá chegando lá.' : ' — você tá no topo.'}
        </Text>
        <View style={styles.orbBig} />
        <View style={styles.orbSmall} />
      </Card>

      <Pressable onPress={() => router.push('/intervention')}>
        <Card>
          <Text style={styles.sectionLabel}>— INTERVENÇÃO AGORA</Text>
          <Text style={styles.intTitle}>{intervention.title}</Text>
          <Text style={styles.muted}>{intervention.body}</Text>
          <Text style={[styles.link, { marginTop: 10 }]}>{intervention.action} ›</Text>
        </Card>
      </Pressable>

      <Text style={styles.sectionLabel}>ROTINA DE HOJE</Text>
      <View style={{ gap: 10 }}>
        {DEFAULT_ROUTINE.map((r) => (
          <RoutineItem
            key={r.id}
            label={r.label}
            detail={r.detail}
            time={r.time}
            done={done.includes(r.id)}
            onToggle={() => toggleRoutine(r.id)}
          />
        ))}
      </View>

      <Card variant="accent" style={styles.quoteCard}>
        <Text style={styles.quoteText}>Constância não nasce do esforço.</Text>
        <Text style={styles.quoteSmall}>Nasce da repetição protegida.</Text>
      </Card>

      <Pressable onPress={() => router.push('/check-in')}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.sectionLabel}>— CHECK-IN RÁPIDO</Text>
            <Text style={styles.intTitle}>Como tá agora?</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/content')} style={{ paddingVertical: 8 }}>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>Conteúdo pra você ›</Text>
      </Pressable>
    </Screen>
  );
}

function greet() {
  const h = new Date().getHours();
  if (h < 12) return 'BOM DIA';
  if (h < 18) return 'BOA TARDE';
  return 'BOA NOITE';
}

const styles = StyleSheet.create({
  header: { marginBottom: 4 },
  eyebrow: { color: colors.textMuted, fontSize: 12, letterSpacing: 2, fontWeight: '700' },
  name: {
    color: colors.textLight,
    fontSize: 32,
    fontWeight: '800',
    fontFamily: font.serif,
    fontStyle: 'italic',
    marginTop: 6,
  },
  streakCard: { overflow: 'hidden', minHeight: 170 },
  streakLabel: { color: colors.green, fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  streakRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 10 },
  streakBig: { color: colors.textLight, fontSize: 74, fontWeight: '900', lineHeight: 78 },
  streakUnit: { color: colors.textMuted, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  orbBig: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  orbSmall: {
    position: 'absolute',
    right: 20,
    bottom: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34,197,94,0.05)',
  },
  muted: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  sectionLabel: {
    color: colors.green,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '800',
    marginBottom: 8,
  },
  intTitle: { color: colors.textLight, fontSize: 17, fontWeight: '700' },
  link: { color: colors.green, fontSize: 13, fontWeight: '700' },
  linkBtn: { marginTop: 10 },
  chev: { color: colors.green, fontSize: 28, fontWeight: '300' },
  quoteCard: { alignItems: 'flex-start' },
  quoteText: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 16,
  },
  quoteSmall: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  resetTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontFamily: font.serif,
    fontStyle: 'italic',
  },
});
