import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { RoutineItem } from '../../src/components/RoutineItem';
import { Tutorial } from '../../src/components/Tutorial';
import { useStore, DEFAULT_ROUTINE } from '../../src/store/useStore';
import { currentStreak, bestStreak } from '../../src/lib/streak';
import { nextIntervention } from '../../src/lib/personalization';
import { colors, font } from '../../src/theme/tokens';

export default function Home() {
  const router = useRouter();
  const { profile, checkIns, constancyLog, routineDone, toggleRoutine, failedToday, finishTutorial } =
    useStore();
  const streak = currentStreak(constancyLog);
  const best = bestStreak(constancyLog);
  const key = new Date().toDateString();
  const done = routineDone[key] ?? [];
  const intervention = nextIntervention(profile, checkIns);
  const showTutorial = profile.onboarded && !profile.tutorialSeen;

  return (
    <Screen>
      <Tutorial visible={showTutorial} onFinish={finishTutorial} />

      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brand}>CONSTANCY</Text>
        </View>
        <Text style={styles.date}>{formatDate()}</Text>
      </View>

      <View style={{ gap: 6, marginTop: 2 }}>
        <Text style={styles.greetEyebrow}>{greet()}</Text>
        <Text style={styles.name}>
          {profile.name ?? 'Oi, tudo bem?'} <Text style={{ color: colors.green, fontSize: 24 }}>✦</Text>
        </Text>
      </View>

      {failedToday && (
        <Card variant="accent">
          <Eyebrow text="Recomeçar" />
          <Text style={styles.resetTitle}>Novo começo daqui.</Text>
          <Text style={styles.muted}>
            Próxima refeição é o ponto de partida. Só isso.
          </Text>
          <Pressable onPress={() => useStore.getState().clearFail()} style={styles.okBtn}>
            <Text style={styles.okText}>Entendi, pode continuar</Text>
          </Pressable>
        </Card>
      )}

      <Card variant="hero" padding={26} style={{ minHeight: 210 }}>
        <View style={styles.heroOrb} />
        <View style={styles.heroOrbSmall} />
        <Eyebrow text="Dias Seguidos" />
        <View style={styles.streakRow}>
          <Text style={styles.streakBig}>{streak}</Text>
          <View style={{ marginBottom: 14, marginLeft: 10 }}>
            <Text style={styles.streakUnit}>{streak === 1 ? 'dia' : 'dias'}</Text>
            <Text style={styles.streakSub}>tomando a cápsula</Text>
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
          Seu melhor foi <Text style={styles.heroFootStrong}>{best} {best === 1 ? 'dia' : 'dias'}</Text>
          {best > streak && best > 0 ? `  ·  ${best - streak} pra bater o recorde` : '  ·  continue assim'}
        </Text>
      </Card>

      <Pressable onPress={() => router.push('/intervention')}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Eyebrow text="Ajuda Agora" />
            <View style={styles.livePulse}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>AGORA</Text>
            </View>
          </View>
          <Text style={styles.intTitle}>{intervention.title}</Text>
          <Text style={styles.muted}>{intervention.body}</Text>
          <View style={styles.bigBtn}>
            <Text style={styles.bigBtnText}>Me ajuda agora →</Text>
          </View>
          <Text style={styles.helpCaption}>
            Toque no botão verde acima quando bater vontade. Leva 30 segundos.
          </Text>
        </Card>
      </Pressable>

      <View>
        <View style={styles.sectionHead}>
          <Eyebrow text="Minha Rotina de Hoje" />
          <View style={styles.countBadge}>
            <Text style={styles.sectionCount}>
              {done.length} de {DEFAULT_ROUTINE.length}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionHint}>Toque na bolinha quando terminar cada etapa.</Text>
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
        <Text style={styles.quoteSerifAccent}>Nasce da repetição cuidada."</Text>
      </Card>

      <Pressable onPress={() => router.push('/check-in')}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Eyebrow text="Como Você Está?" />
              <Text style={styles.intTitle}>Me conta em 30 segundos</Text>
              <Text style={styles.muted}>Só 2 perguntas simples.</Text>
            </View>
            <View style={styles.chevWrap}>
              <Text style={styles.chev}>›</Text>
            </View>
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/content')} style={{ paddingVertical: 10 }}>
        <Text style={styles.footerLink}>Ver dicas pra você ›</Text>
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
  brandDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  brand: { color: colors.textLight, fontSize: 12, letterSpacing: 3, fontWeight: '800' },
  date: { color: colors.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  greetEyebrow: { color: colors.textMuted, fontSize: 13, letterSpacing: 2.5, fontWeight: '800' },
  name: {
    color: colors.textLight,
    fontSize: 36,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  heroOrb: {
    position: 'absolute',
    right: -60,
    top: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
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
  streakRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 14 },
  streakBig: {
    color: colors.textLight,
    fontSize: 94,
    fontWeight: '900',
    lineHeight: 96,
    fontFamily: font.sans,
    letterSpacing: -3,
  },
  streakUnit: { color: colors.textLight, fontSize: 20, fontWeight: '800' },
  streakSub: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginTop: 2 },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 20,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  heroFoot: { color: colors.textMuted, fontSize: 14, marginTop: 12 },
  heroFootStrong: { color: colors.green, fontWeight: '800' },
  muted: { color: colors.textMuted, fontSize: 16, lineHeight: 24, marginTop: 8 },
  intTitle: { color: colors.textLight, fontSize: 20, fontWeight: '700', marginTop: 6 },
  bigBtn: {
    marginTop: 16,
    backgroundColor: colors.green,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  bigBtnText: { color: '#06240F', fontWeight: '900', fontSize: 17, letterSpacing: 0.3 },
  helpCaption: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  pulseDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  liveText: { color: colors.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHint: { color: colors.textMuted, fontSize: 14, marginTop: 6, fontStyle: 'italic' },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  sectionCount: { color: colors.green, fontSize: 13, fontWeight: '800' },
  quoteSerif: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 30,
  },
  quoteSerifAccent: {
    color: colors.green,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 30,
  },
  chevWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  chev: { color: colors.green, fontSize: 28, fontWeight: '400' },
  footerLink: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  okBtn: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.green,
    alignSelf: 'flex-start',
  },
  okText: { color: '#06240F', fontWeight: '800', fontSize: 15 },
  resetTitle: {
    color: colors.textLight,
    fontSize: 22,
    fontFamily: font.serif,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
