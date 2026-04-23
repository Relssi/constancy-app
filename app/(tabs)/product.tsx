import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Donut } from '../../src/components/Donut';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore } from '../../src/store/useStore';
import { colors, font, radius, shadow, gradients } from '../../src/theme/tokens';

const COMPOSITION = [
  { color: '#22C55E', name: 'Cromo', tag: 'metabolismo' },
  { color: '#A78BFA', name: 'Cafeína', tag: 'foco e energia' },
  { color: '#34D399', name: 'Guaraná', tag: 'estímulo natural' },
  { color: '#FBBF24', name: 'Laranja Moro', tag: 'antioxidante' },
  { color: '#F472B6', name: 'Vitaminas A, C e E', tag: 'suporte metabólico' },
  { color: '#60A5FA', name: 'Vitamina B5', tag: 'energia estável' },
];

export default function Product() {
  const { profile, constancyLog, logConstancy } = useStore();
  const takenCount = constancyLog.filter((l) => l.taken).length;
  const total = profile.bottleSize;
  const remaining = Math.max(0, total - takenCount);
  const used = Math.round((takenCount / total) * 100);
  const remainingDays = Math.floor(remaining / 2);
  const tookToday = constancyLog.some(
    (l) => new Date(l.ts).toDateString() === new Date().toDateString() && l.taken
  );

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Eyebrow text="Seu Frasco" />
          <Text style={styles.title}>Sua{'\n'}cápsula.</Text>
        </View>
        <View style={[styles.badge, tookToday ? styles.badgeOn : styles.badgeOff]}>
          <View style={[styles.badgeDot, { backgroundColor: tookToday ? colors.green : colors.textDim }]} />
          <Text style={[styles.badgeText, { color: tookToday ? colors.green : colors.textMuted }]}>
            {tookToday ? 'Tomada hoje' : 'Ainda não'}
          </Text>
        </View>
      </View>

      <Card variant="hero" padding={24}>
        <View style={styles.bottleRow}>
          <View style={{ flex: 1 }}>
            <Eyebrow text="Cápsulas Restantes" />
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 10 }}>
              <Text style={styles.bottleBig}>{remaining}</Text>
              <Text style={styles.bottleSmall}> / {total}</Text>
            </View>
            <Text style={styles.muted}>~{remainingDays} dias restantes</Text>
          </View>
          <Donut percent={used} size={118} sublabel="USADO" />
        </View>
      </Card>

      <Pressable
        onPress={() => !tookToday && logConstancy(true)}
        disabled={tookToday}
        style={({ pressed }) => [
          styles.cta,
          shadow.glow,
          tookToday && { opacity: 0.55 },
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
      >
        {!tookToday && (
          <LinearGradient
            colors={gradients.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill as any}
          />
        )}
        {tookToday && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(34,197,94,0.15)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.4)', borderRadius: radius.md }]} />}
        <View style={styles.ctaInner}>
          <Text style={[styles.ctaIcon, { color: tookToday ? colors.green : '#06240F' }]}>
            {tookToday ? '✓' : '◉'}
          </Text>
          <Text style={[styles.ctaText, { color: tookToday ? colors.green : '#06240F' }]}>
            {tookToday ? 'Registrada hoje' : 'Registrar cápsula de hoje'}
          </Text>
        </View>
      </Pressable>

      <View>
        <Eyebrow text="Composição" />
        <View style={{ gap: 8, marginTop: 12 }}>
          {COMPOSITION.map((c, i) => (
            <View key={i} style={styles.compRow}>
              <View style={[styles.dot, { backgroundColor: c.color, shadowColor: c.color, shadowOpacity: 0.6, shadowRadius: 8 }]} />
              <Text style={styles.compName}>{c.name}</Text>
              <Text style={styles.compTag}>{c.tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <Card variant="accent" padding={22}>
        <Eyebrow text="Modo de Uso" />
        <Text style={styles.howTitle}>2 cápsulas, 30min antes do momento de fraqueza.</Text>
        <Text style={styles.muted}>
          Cada pessoa tem o seu horário. Ajuste pelo seu padrão — não pelo relógio dos outros.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title: {
    color: colors.textLight,
    fontSize: 38,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 40,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeOn: { backgroundColor: 'rgba(34,197,94,0.14)', borderColor: 'rgba(34,197,94,0.35)' },
  badgeOff: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: colors.navyBorder },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  bottleRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bottleBig: {
    color: colors.textLight,
    fontSize: 62,
    fontWeight: '900',
    lineHeight: 64,
    letterSpacing: -2,
  },
  bottleSmall: { color: colors.textMuted, fontSize: 22, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: 13, marginTop: 8, lineHeight: 20 },
  cta: {
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  ctaIcon: { fontSize: 16, fontWeight: '900' },
  ctaText: { fontWeight: '800', fontSize: 14, letterSpacing: 1.5, textTransform: 'uppercase' },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
  compName: { flex: 1, color: colors.textLight, fontSize: 14, fontWeight: '700' },
  compTag: { color: colors.textDim, fontSize: 11, fontStyle: 'italic' },
  howTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 26,
    fontFamily: font.serif,
    fontStyle: 'italic',
  },
});
