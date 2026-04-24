import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Donut } from '../../src/components/Donut';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore } from '../../src/store/useStore';
import { colors, font, radius, shadow, gradients } from '../../src/theme/tokens';

const COMPOSITION = [
  { color: '#22C55E', name: 'Cromo', tag: 'ajuda no metabolismo' },
  { color: '#A78BFA', name: 'Cafeína', tag: 'dá foco e energia' },
  { color: '#34D399', name: 'Guaraná', tag: 'disposição natural' },
  { color: '#FBBF24', name: 'Laranja Moro', tag: 'protege o corpo' },
  { color: '#F472B6', name: 'Vitaminas A, C e E', tag: 'apoio diário' },
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
            {tookToday ? 'Tomada hoje' : 'Ainda falta'}
          </Text>
        </View>
      </View>

      <Card variant="hero" padding={24}>
        <View style={styles.bottleRow}>
          <View style={{ flex: 1 }}>
            <Eyebrow text="Cápsulas Restantes" />
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 10 }}>
              <Text style={styles.bottleBig}>{remaining}</Text>
              <Text style={styles.bottleSmall}> de {total}</Text>
            </View>
            <Text style={styles.muted}>Dá pra mais ~{remainingDays} dias</Text>
          </View>
          <Donut percent={used} size={118} sublabel="USADAS" />
        </View>
      </Card>

      <Pressable
        onPress={() => !tookToday && logConstancy(true)}
        disabled={tookToday}
        style={({ pressed }) => [
          styles.cta,
          shadow.glow,
          tookToday && { opacity: 0.6 },
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
        {tookToday && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(34,197,94,0.15)',
                borderWidth: 1,
                borderColor: 'rgba(34,197,94,0.4)',
                borderRadius: radius.md,
              },
            ]}
          />
        )}
        <View style={styles.ctaInner}>
          <Text style={[styles.ctaIcon, { color: tookToday ? colors.green : '#06240F' }]}>
            {tookToday ? '✓' : '◉'}
          </Text>
          <Text style={[styles.ctaText, { color: tookToday ? colors.green : '#06240F' }]}>
            {tookToday ? 'Já foi marcado hoje' : 'Marcar que tomei hoje'}
          </Text>
        </View>
      </Pressable>
      <Text style={styles.bigHelp}>
        Toque no botão verde depois de tomar a cápsula. Só isso.
      </Text>

      <View>
        <Eyebrow text="O que tem dentro" />
        <View style={{ gap: 8, marginTop: 12 }}>
          {COMPOSITION.map((c, i) => (
            <View key={i} style={styles.compRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: c.color, shadowColor: c.color, shadowOpacity: 0.6, shadowRadius: 8 },
                ]}
              />
              <Text style={styles.compName}>{c.name}</Text>
              <Text style={styles.compTag}>{c.tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <Card variant="accent" padding={22}>
        <Eyebrow text="Como Tomar" />
        <Text style={styles.howTitle}>
          2 cápsulas, 30 minutos antes do horário que costuma te dar vontade.
        </Text>
        <Text style={styles.muted}>
          Cada pessoa tem o seu horário. Toma no seu ritmo, não precisa pressa.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title: {
    color: colors.textLight,
    fontSize: 40,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 46,
    marginTop: 10,
    letterSpacing: -0.9,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeOn: { backgroundColor: 'rgba(34,197,94,0.14)', borderColor: 'rgba(34,197,94,0.35)' },
  badgeOff: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: colors.navyBorder },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 11.5, fontWeight: '600', letterSpacing: -0.1 },
  bottleRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bottleBig: {
    color: colors.textLight,
    fontSize: 62,
    fontWeight: '600',
    lineHeight: 66,
    letterSpacing: -2.2,
    fontFamily: font.numeric,
  },
  bottleSmall: {
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '500',
    fontFamily: font.numeric,
    letterSpacing: -0.5,
  },
  muted: {
    color: colors.textMuted,
    fontSize: 14.5,
    marginTop: 10,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  cta: {
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 22,
  },
  ctaIcon: { fontSize: 20, fontWeight: '700' },
  ctaText: { fontWeight: '700', fontSize: 16, letterSpacing: -0.2 },
  bigHelp: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 13.5,
    fontStyle: 'italic',
    marginTop: -2,
    letterSpacing: -0.1,
    lineHeight: 20,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  compName: { flex: 1, color: colors.textLight, fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  compTag: { color: colors.textDim, fontSize: 12.5, fontStyle: 'italic', letterSpacing: -0.1 },
  howTitle: {
    color: colors.textLight,
    fontSize: 21,
    fontWeight: '500',
    marginTop: 12,
    lineHeight: 31,
    fontFamily: font.serif,
    fontStyle: 'italic',
    letterSpacing: -0.4,
  },
});
