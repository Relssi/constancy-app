import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Donut } from '../../src/components/Donut';
import { useStore } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

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
        <Text style={styles.title}>Sua{'\n'}cápsula</Text>
        <View style={[styles.badge, tookToday ? styles.badgeOn : styles.badgeOff]}>
          <Text style={[styles.badgeText, tookToday ? styles.badgeTextOn : styles.badgeTextOff]}>
            {tookToday ? 'Tomada hoje ✓' : 'Ainda não'}
          </Text>
        </View>
      </View>

      <Card>
        <View style={styles.bottleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottleLabel}>CÁPSULAS RESTANTES</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
              <Text style={styles.bottleBig}>{remaining}</Text>
              <Text style={styles.bottleSmall}> / {total}</Text>
            </View>
            <Text style={styles.muted}>~{remainingDays} dias restantes no frasco</Text>
          </View>
          <Donut percent={used} size={110} sublabel="USADO" />
        </View>
      </Card>

      <Pressable
        onPress={() => !tookToday && logConstancy(true)}
        disabled={tookToday}
        style={[styles.cta, tookToday && { opacity: 0.5 }]}
      >
        <Text style={styles.ctaText}>
          {tookToday ? '✓ Registrada hoje' : '◉ Registrar cápsula de hoje'}
        </Text>
      </Pressable>

      <Text style={styles.sectionLabel}>COMPOSIÇÃO</Text>
      <View style={{ gap: 8 }}>
        {COMPOSITION.map((c, i) => (
          <View key={i} style={styles.compRow}>
            <View style={[styles.dot, { backgroundColor: c.color }]} />
            <Text style={styles.compName}>{c.name}</Text>
            <Text style={styles.compTag}>{c.tag}</Text>
          </View>
        ))}
      </View>

      <Card variant="accent">
        <Text style={styles.sectionLabel}>— MODO DE USO</Text>
        <Text style={styles.howTitle}>2 cápsulas, 30min antes do momento de fraqueza.</Text>
        <Text style={styles.muted}>
          Cada pessoa tem o seu horário. Ajuste pelo seu padrão — não pelo relógio dos outros.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: {
    color: colors.textLight,
    fontSize: 34,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 36,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeOn: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: colors.green },
  badgeOff: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: colors.navyBorder },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextOn: { color: colors.green },
  badgeTextOff: { color: colors.textMuted },
  bottleRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bottleLabel: { color: colors.textMuted, fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  bottleBig: { color: colors.textLight, fontSize: 54, fontWeight: '900', lineHeight: 58 },
  bottleSmall: {
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '700',
    textDecorationLine: 'line-through',
  },
  muted: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  cta: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  ctaText: { color: '#06240F', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 6,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  compName: { flex: 1, color: colors.textLight, fontSize: 14, fontWeight: '700' },
  compTag: { color: colors.textDim, fontSize: 11, fontStyle: 'italic' },
  howTitle: { color: colors.textLight, fontSize: 16, fontWeight: '700', marginTop: 6 },
});
