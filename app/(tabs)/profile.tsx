import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { useStore } from '../../src/store/useStore';
import { slotLabel } from '../../src/lib/personalization';
import { colors, font } from '../../src/theme/tokens';

export default function Profile() {
  const router = useRouter();
  const { profile, checkIns, constancyLog, reset } = useStore();

  const goalLabel =
    profile.goal === 'lose_weight'
      ? 'Emagrecer'
      : profile.goal === 'appetite'
      ? 'Controlar apetite'
      : 'Disciplina alimentar';

  const hungerLabel =
    profile.hungerType === 'emotional'
      ? 'Emocional'
      : profile.hungerType === 'physical'
      ? 'Física'
      : 'Mista';

  return (
    <Screen>
      <Text style={styles.eyebrow}>SEU PERFIL</Text>
      <Text style={styles.title}>Como o app te{'\n'}enxerga.</Text>

      <Card>
        <Row label="Objetivo" value={goalLabel} />
        <Divider />
        <Row label="Momento crítico" value={slotLabel(profile.lossSlot ?? 'afternoon')} />
        <Divider />
        <Row label="Tipo de fome" value={hungerLabel} />
        <Divider />
        <Row label="Frasco" value={`${profile.bottleSize} cápsulas`} />
      </Card>

      <Card variant="accent">
        <Text style={styles.sectionLabel}>— SEUS DADOS</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Stat label="Check-ins" value={checkIns.length} />
          <Stat label="Registros cápsula" value={constancyLog.length} />
        </View>
      </Card>

      <Pressable onPress={() => router.push('/content')}>
        <Card style={styles.linkRow}>
          <Text style={styles.linkText}>Conteúdo personalizado</Text>
          <Text style={styles.chev}>›</Text>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/check-in')}>
        <Card style={styles.linkRow}>
          <Text style={styles.linkText}>Fazer check-in</Text>
          <Text style={styles.chev}>›</Text>
        </Card>
      </Pressable>

      <Pressable onPress={reset} style={{ padding: 12, alignItems: 'center' }}>
        <Text style={styles.danger}>Resetar onboarding</Text>
      </Pressable>

      <Text style={styles.footer}>
        CONSTANCY <Text style={{ color: colors.textDim }}>by FOCULAB</Text>
      </Text>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.green, fontSize: 10, letterSpacing: 2, fontWeight: '800' },
  title: {
    color: colors.textLight,
    fontSize: 30,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 36,
    marginTop: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.textLight, fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.navyBorder },
  sectionLabel: { color: colors.green, fontSize: 10, letterSpacing: 2, fontWeight: '800' },
  statVal: { color: colors.textLight, fontSize: 26, fontWeight: '900' },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 2,
  },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkText: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
  chev: { color: colors.green, fontSize: 22 },
  danger: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  footer: {
    color: colors.green,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '800',
    marginTop: 20,
  },
});
