import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { Display } from '../../src/components/Display';
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
  const intervention = nextIntervention(profile, checkIns);

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brand}>CONSTANCY</Text>
          <Text style={styles.byFoculab}>by Foculab</Text>
        </View>
        <Text style={styles.date}>{formatDate()}</Text>
      </View>

      <View style={{ gap: 4, marginTop: 2 }}>
        <Text style={styles.greetEyebrow}>{greet()}</Text>
        <Text style={styles.name}>
          {profile.name ?? 'Você'} <Text style={{ color: colors.green, fontSize: 22 }}>✦</Text>
        </Text>
      </View>

      {failedToday && (
        <Card variant="accent">
          <Eyebrow text="Reset" />
          <Text style={styles.resetTitle}>Novo começo daqui.</Text>
          <Text style={styles.muted}>Próxima refeição é a linha de partida.</Text>
          <Pressable onPress={() => useStore.getState().clearFail()} style={{ marginTop: 10 }}>
            <Text style={styles.link}>Ok, sigo ›</Text>
          </Pressable>
        </Card>
      )}

      <Card variant="hero" padding={26} style={{ minHeight: 200 }}>
        <View style={styles.heroOrb} />
        <View style={styles.heroOrbSmall} />
        <Eyebrow text="Dias Consecutivos" />
        <View style={styles.streakRow}>
          <Text style={styles.streakBig}>{streak}</Text>
          <View style={{ marginBottom: 14, marginLeft: 10 }}>
            <Text style={styles.streakUnit}>dias</Text>
            <Text style={styles.streakSub}>em sequência</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#22C55E', '#34E671'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${Math.min(100, (streak / Math.max(7, best)) * 100)}%` }]}
          />
        </View>
        <Text style={styles.heroFoot}>
          Recorde <Text style={styles.heroFootStrong}>{best}d</Text>
          {best > streak && best > 0 ? `  ·  faltam ${best - streak}d pra bater` : '  ·  você tá no topo'}
        </Text>
      </Card>

      <Pressable onPress={() => router.push('/intervention')}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Eyebrow text="Intervenção Agora" />
            <View style={styles.livePulse}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </View>
          </View>
          <Text style={styles.intTitle}>{intervention.title}</Text>
          <Text style={styles.muted}>{intervention.body}</Text>
          <View style={styles.ctaInline}>
            <Text style={styles.link}>{intervention.action} ›</Text>
          </View>
        </Card>
      </Pressable>

      <View>
        <View style={styles.sectionHead}>
          <Eyebrow text="Rotina de Hoje" />
          <Text style={styles.sectionCount}>
            {done.length}/{DEFAULT_ROUTINE.length}
          </Text>
        </View>
        <View style={{ gap: 10, marginTop: 12 }}>
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
      </View>

      <Card variant="accent" padding={22}>
        <Text style={styles.quoteSerif}>"Constância não nasce do esforço.</Text>
        <Text style={styles.quoteSerifAccent}>Nasce da repetição protegida."</Text>
      </Card>

      <Pressable onPress={() => router.push('/check-in')}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Eyebrow text="Check-in Rápido" />
              <Text style={styles.intTitle}>Como tá agora?</Text>
              <Text style={styles.muted}>30 segundos. 2 perguntas.</Text>
            </View>
            <View style={styles.chevWrap}>
              <Text style={styles.chev}>›</Text>
            </View>
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/content')} style={{ paddingVertical: 8 }}>
        <Text style={styles.footerLink}>Conteúdo pra você ›</Text>
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
function formatDate() {
  return new Date()
    .toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
    .toUpperCase()
    .replace(/\./g, '');
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  brand: { color: colors.textLight, fontSize: 11, letterSpacing: 3, fontWeight: '800' },
  byFoculab: { color: colors.textDim, fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  date: { color: colors.textMuted, fontSize: 10.5, letterSpacing: 2, fontWeight: '700' },
  greetEyebrow: { color: colors.textMuted, fontSize: 11, letterSpacing: 2.5, fontWeight: '800' },
  name: {
    color: colors.textLight,
    fontSize: 34,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  heroOrb: {
    position: 'absolute',
    right: -60,
    top: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(34,197,94,0.10)',
    zIndex: 1,
  },
  heroOrbSmall: {
    position: 'absolute',
    right: 30,
    bottom: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(34,197,94,0.06)',
    zIndex: 1,
  },
  streakRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 12 },
  streakBig: {
    color: colors.textLight,
    fontSize: 86,
    fontWeight: '900',
    lineHeight: 88,
    fontFamily: font.sans,
    letterSpacing: -3,
  },
  streakUnit: { color: colors.textLight, fontSize: 18, fontWeight: '800' },
  streakSub: { color: colors.textMuted, fontSize: 11, letterSpacing: 1.5, fontWeight: '600', marginTop: 2 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  heroFoot: { color: colors.textMuted, fontSize: 12, marginTop: 10, letterSpacing: 0.5 },
  heroFootStrong: { color: colors.green, fontWeight: '800' },
  muted: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  intTitle: { color: colors.textLight, fontSize: 18, fontWeight: '700', marginTop: 6 },
  link: { color: colors.green, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  ctaInline: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  liveText: { color: colors.green, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionCount: { color: colors.green, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  quoteSerif: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 26,
  },
  quoteSerifAccent: {
    color: colors.green,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 26,
  },
  chevWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  chev: { color: colors.green, fontSize: 22, fontWeight: '400' },
  footerLink: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  resetTitle: {
    color: colors.textLight,
    fontSize: 20,
    fontFamily: font.serif,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
