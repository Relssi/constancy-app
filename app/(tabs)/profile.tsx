import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
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
      <View>
        <Eyebrow text="Seu Perfil" />
        <Text style={styles.title}>Como o app{'\n'}te enxerga.</Text>
      </View>

      <Card padding={6}>
        <Row label="Objetivo" value={goalLabel} />
        <Divider />
        <Row label="Momento crítico" value={slotLabel(profile.lossSlot ?? 'afternoon')} />
        <Divider />
        <Row label="Tipo de fome" value={hungerLabel} />
        <Divider />
        <Row label="Frasco" value={`${profile.bottleSize} cápsulas`} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <StatCard label="Check-ins" value={checkIns.length} />
        <StatCard label="Cápsulas" value={constancyLog.filter((l) => l.taken).length} />
      </View>

      <LinkRow label="Conteúdo personalizado" onPress={() => router.push('/content')} />
      <LinkRow label="Fazer check-in" onPress={() => router.push('/check-in')} />

      <Pressable onPress={reset} style={{ padding: 14, alignItems: 'center' }}>
        <Text style={styles.danger}>Resetar onboarding</Text>
      </Pressable>

      <View style={{ alignItems: 'center', gap: 6, marginTop: 8 }}>
        <View style={styles.dot} />
        <Text style={styles.brandFooter}>
          CONSTANCY <Text style={{ color: colors.textDim }}>by FOCULAB</Text>
        </Text>
        <Text style={styles.tag}>Constância é uma escolha diária.</Text>
      </View>
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </Card>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.linkText}>{label}</Text>
        <View style={styles.chevWrap}>
          <Text style={styles.chev}>›</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textLight,
    fontSize: 36,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 40,
    marginTop: 10,
    letterSpacing: -0.5,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 14 },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.textLight, fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.navyBorder, marginHorizontal: 14 },
  statVal: { color: colors.textLight, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: '800',
    marginTop: 4,
  },
  linkText: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
  chevWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  chev: { color: colors.green, fontSize: 18 },
  danger: { color: colors.danger, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  brandFooter: { color: colors.textLight, fontSize: 11, letterSpacing: 3, fontWeight: '800' },
  tag: {
    color: colors.textDim,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 4,
  },
});
