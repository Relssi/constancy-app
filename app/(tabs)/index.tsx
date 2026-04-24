import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { RoutineItem } from '../../src/components/RoutineItem';
import { Tutorial } from '../../src/components/Tutorial';
import { useStore } from '../../src/store/useStore';
import { currentStreak, bestStreak, monthRate } from '../../src/lib/streak';
import { nextIntervention, constancyAdherence, daysActive } from '../../src/lib/personalization';
import { calorieTarget, caloriesToday } from '../../src/lib/calc';
import { colors, font } from '../../src/theme/tokens';

const todayKey = () => new Date().toDateString();

export default function Home() {
  const router = useRouter();
  const {
    profile,
    checkIns,
    constancyLog,
    routineDone,
    toggleRoutine,
    failedToday,
    finishTutorial,
    routine,
    meals,
    mealDone,
    extrasLog,
    weightLog,
    waterLog,
    addWater,
    toggleMealDone,
  } = useStore();
  const streak = currentStreak(constancyLog);
  const best = bestStreak(constancyLog);
  const rate = monthRate(constancyLog);
  const adherence = constancyAdherence(constancyLog, 7);
  const answered = daysActive(checkIns, 7);
  const key = new Date().toDateString();
  const done = routineDone[key] ?? [];
  const intervention = nextIntervention(profile, checkIns);
  const showTutorial = profile.onboarded && !profile.tutorialSeen;

  const sortedMeals = [...meals].sort((a, b) => a.time.localeCompare(b.time));
  const displayMeals = sortedMeals.slice(0, 3);
  const target = calorieTarget(profile, weightLog);
  const consumed = caloriesToday(meals, mealDone, extrasLog);
  const doneToday = mealDone[todayKey()] ?? [];
  const waterCups = waterLog[todayKey()] ?? 0;

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
          {profile.name ?? 'Oi, tudo bem?'}{' '}
          <Text style={{ color: colors.green, fontSize: 24 }}>✦</Text>
        </Text>
      </View>

      {failedToday && (
        <Card variant="accent">
          <Eyebrow text="Recomeçar" />
          <Text style={styles.resetTitle}>Novo começo daqui.</Text>
          <Text style={styles.muted}>Próxima refeição é o ponto de partida. Só isso.</Text>
          <Pressable onPress={() => useStore.getState().clearFail()} style={styles.okBtn}>
            <Text style={styles.okText}>Entendi, pode continuar</Text>
          </Pressable>
        </Card>
      )}

      <Pressable onPress={() => router.push('/progress')}>
        <Card variant="hero" padding={26} style={{ minHeight: 230 }}>
          <View style={styles.heroOrb} />
          <View style={styles.heroOrbSmall} />
          <View style={styles.heroHead}>
            <Eyebrow text="Dias Seguidos" />
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>ver progresso completo ›</Text>
            </View>
          </View>
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
              style={[
                styles.progressFill,
                { width: `${Math.min(100, (streak / Math.max(7, best)) * 100)}%` },
              ]}
            />
          </View>

          <View style={styles.miniStatsRow}>
            <MiniStat value={`${best}`} unit={best === 1 ? 'dia' : 'dias'} label="seu recorde" />
            <View style={styles.miniDivider} />
            <MiniStat value={`${adherence}%`} unit="" label="cápsulas na semana" />
            <View style={styles.miniDivider} />
            <MiniStat value={`${answered}`} unit={answered === 1 ? 'dia' : 'dias'} label="respondeu essa semana" />
          </View>

          <Text style={styles.heroFoot}>
            No mês você está em <Text style={styles.heroFootStrong}>{rate}%</Text> dos dias
            {best > streak && best > 0
              ? `  ·  ${best - streak} ${best - streak === 1 ? 'dia' : 'dias'} pra bater o recorde`
              : '  ·  continue assim'}
          </Text>
        </Card>
      </Pressable>

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
              {done.length} de {routine.length}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionHint}>Toque na bolinha quando terminar cada etapa.</Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {routine.map((r) => (
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

      {/* Calorias do dia */}
      <View>
        <View style={styles.sectionHead}>
          <Eyebrow text="Calorias De Hoje" />
          {target && (
            <View style={styles.countBadge}>
              <Text style={styles.sectionCount}>meta {target} kcal</Text>
            </View>
          )}
        </View>
        <Pressable onPress={() => router.push('/meals')}>
          <Card padding={20}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.calBig}>{consumed}</Text>
                <Text style={styles.calBigLabel}>
                  {target ? `de ${target} kcal consumidas` : 'kcal consumidas hoje'}
                </Text>
              </View>
              {target && (
                <Text style={[
                  styles.calStatus,
                  consumed > target ? { color: '#F8B44B' } : { color: colors.green },
                ]}>
                  {consumed === 0
                    ? 'começar'
                    : consumed < target
                    ? `faltam ${target - consumed}`
                    : consumed === target
                    ? 'na meta'
                    : `+${consumed - target}`}
                </Text>
              )}
            </View>
            {target && (
              <View style={styles.calTrack}>
                <View
                  style={[
                    styles.calFill,
                    {
                      width: `${Math.min(100, (consumed / target) * 100)}%`,
                      backgroundColor: consumed > target ? '#F8B44B' : colors.green,
                    },
                  ]}
                />
              </View>
            )}
          </Card>
        </Pressable>
      </View>

      {/* Refeições do dia com check */}
      <View>
        <View style={styles.sectionHead}>
          <Eyebrow text="Minhas Refeições" />
          {sortedMeals.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.sectionCount}>{doneToday.length} de {sortedMeals.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionHint}>
          {sortedMeals.length === 0
            ? 'Você ainda não anotou suas refeições.'
            : 'Marque ✓ quando comer. O app soma as calorias.'}
        </Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {displayMeals.map((m) => {
            const d = doneToday.includes(m.id);
            return (
              <Pressable key={m.id} onPress={() => toggleMealDone(m.id)}>
                <Card padding={14}>
                  <View style={styles.mealRow}>
                    <View style={[styles.mealCheck, d && styles.mealCheckOn]}>
                      {d && <Text style={styles.mealCheckTxt}>✓</Text>}
                    </View>
                    <View style={styles.mealTime}>
                      <Text style={styles.mealTimeTxt}>{m.time}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.mealName, d && { textDecorationLine: 'line-through', color: colors.textDim }]}>
                        {m.name}
                      </Text>
                      {m.calories ? <Text style={styles.mealCal}>{m.calories} kcal</Text> : null}
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={() => router.push('/meals')} style={styles.manageBtn}>
          <Text style={styles.manageBtnText}>
            {sortedMeals.length === 0
              ? '+ Adicionar minhas refeições'
              : sortedMeals.length > displayMeals.length
              ? `Ver todas (${sortedMeals.length}) ›`
              : '✎ Organizar refeições'}
          </Text>
        </Pressable>
      </View>

      {/* Água */}
      <View>
        <Eyebrow text="Água De Hoje" />
        <Card padding={20}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.waterBig}>{waterCups}</Text>
              <Text style={styles.waterLabel}>
                {waterCups === 1 ? 'copo tomado hoje' : 'copos tomados hoje'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => addWater(-1)} style={[styles.waterBtn, styles.waterBtnMinus]}>
                <Text style={styles.waterBtnTxt}>−</Text>
              </Pressable>
              <Pressable onPress={() => addWater(1)} style={styles.waterBtn}>
                <Text style={styles.waterBtnTxt}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 16 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waterDrop,
                  i < waterCups && styles.waterDropOn,
                ]}
              />
            ))}
          </View>
          <Text style={styles.waterHint}>Meta boa: 8 copos por dia.</Text>
        </Card>
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

function MiniStat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniVal}>
        {value}
        {unit ? <Text style={styles.miniUnit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
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
  brand: {
    color: colors.textLight,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
    fontFamily: font.numeric,
  },
  date: {
    color: colors.textMuted,
    fontSize: 10.5,
    letterSpacing: 1.8,
    fontWeight: '600',
    fontFamily: font.numeric,
  },
  greetEyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 2.2,
    fontWeight: '700',
    fontFamily: font.numeric,
  },
  name: {
    color: colors.textLight,
    fontSize: 38,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: -0.8,
    lineHeight: 46,
  },
  heroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tapHint: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  tapHintText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: font.numeric,
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
  streakRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 16 },
  streakBig: {
    color: colors.textLight,
    fontSize: 82,
    fontWeight: '600',
    lineHeight: 84,
    fontFamily: font.numeric,
    letterSpacing: -3,
  },
  streakUnit: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  streakSub: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: -0.1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  miniStatsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 18,
    gap: 0,
  },
  miniStat: { flex: 1, alignItems: 'flex-start' },
  miniVal: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.6,
    fontFamily: font.numeric,
  },
  miniUnit: { color: colors.textMuted, fontSize: 11, fontWeight: '500', fontFamily: font.numeric },
  miniLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 5,
    lineHeight: 15,
    letterSpacing: -0.1,
  },
  miniDivider: { width: 1, backgroundColor: colors.navyBorder, marginHorizontal: 10 },
  heroFoot: { color: colors.textMuted, fontSize: 13, marginTop: 18, lineHeight: 19, letterSpacing: -0.1 },
  heroFootStrong: { color: colors.green, fontWeight: '700', fontFamily: font.numeric },
  muted: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
    letterSpacing: -0.1,
  },
  intTitle: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: -0.4,
    lineHeight: 26,
  },
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
  bigBtnText: { color: '#06240F', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 },
  helpCaption: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 19,
    letterSpacing: -0.1,
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
  liveText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    fontFamily: font.numeric,
  },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHint: {
    color: colors.textMuted,
    fontSize: 13.5,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  countBadge: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  sectionCount: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: font.numeric,
  },
  manageBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  manageBtnText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealTime: {
    minWidth: 60,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    alignItems: 'center',
  },
  mealTimeTxt: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: font.numeric,
  },
  mealName: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  mealCal: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    fontFamily: font.numeric,
  },
  quoteSerif: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 21,
    lineHeight: 31,
    letterSpacing: -0.3,
  },
  quoteSerifAccent: {
    color: colors.green,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 21,
    lineHeight: 31,
    letterSpacing: -0.3,
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
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  okBtn: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.green,
    alignSelf: 'flex-start',
  },
  okText: { color: '#06240F', fontWeight: '700', fontSize: 15, letterSpacing: -0.2 },
  resetTitle: {
    color: colors.textLight,
    fontSize: 24,
    fontFamily: font.serif,
    fontStyle: 'italic',
    marginTop: 8,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  calBig: {
    color: colors.textLight,
    fontSize: 44,
    fontWeight: '600',
    letterSpacing: -1.8,
    fontFamily: font.numeric,
  },
  calBigLabel: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  calStatus: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontFamily: font.numeric,
    marginBottom: 4,
  },
  calTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: 16,
    overflow: 'hidden',
  },
  calFill: { height: '100%', borderRadius: 4 },
  mealCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.navyBorderHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCheckOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  mealCheckTxt: { color: '#06240F', fontWeight: '900', fontSize: 15 },
  waterBig: {
    color: colors.textLight,
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: -1.6,
    fontFamily: font.numeric,
  },
  waterLabel: { color: colors.textMuted, fontSize: 12.5, marginTop: 3, letterSpacing: -0.1 },
  waterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBtnMinus: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: colors.navyBorder,
  },
  waterBtnTxt: {
    color: colors.textLight,
    fontSize: 22,
    fontWeight: '600',
    fontFamily: font.numeric,
  },
  waterDrop: {
    flex: 1,
    height: 10,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  waterDropOn: {
    backgroundColor: 'rgba(60,175,255,0.35)',
    borderColor: 'rgba(60,175,255,0.6)',
  },
  waterHint: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 10,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
});
