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
  const { profile, checkIns, constancyLog, reset, setProfile, auth, signOut } = useStore();

  const goalLabel =
    profile.goal === 'lose_weight'
      ? 'Emagrecer'
      : profile.goal === 'appetite'
      ? 'Controlar a vontade'
      : 'Manter a rotina';

  const hungerLabel =
    profile.hungerType === 'emotional'
      ? 'Emocional'
      : profile.hungerType === 'physical'
      ? 'Física'
      : 'Dos dois tipos';

  return (
    <Screen>
      <View>
        <Eyebrow text="Meu Perfil" />
        <Text style={styles.title}>Sobre você.</Text>
        <Text style={styles.sub}>Essas respostas ajudam o aplicativo a te entender melhor.</Text>
      </View>

      {auth && (
        <Card>
          <Text style={styles.accountLabel}>CONECTADO COMO</Text>
          <Text style={styles.accountName}>{auth.name}</Text>
          <Text style={styles.accountEmail}>{auth.email}</Text>
        </Card>
      )}

      <Card padding={6}>
        <Row label="Objetivo" value={goalLabel} />
        <Divider />
        <Row label="Hora difícil do dia" value={slotLabel(profile.lossSlot ?? 'afternoon')} />
        <Divider />
        <Row label="Tipo de vontade" value={hungerLabel} />
        <Divider />
        <Row label="Tamanho do frasco" value={`${profile.bottleSize} cápsulas`} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <StatCard label="Vezes que respondi" value={checkIns.length} />
        <StatCard label="Cápsulas marcadas" value={constancyLog.filter((l) => l.taken).length} />
      </View>

      <Eyebrow text="Atalhos" />

      <LinkRow
        label="Ver dicas pra você"
        hint="Conteúdo escolhido pelo seu perfil"
        onPress={() => router.push('/content')}
      />
      <LinkRow
        label="Responder como estou"
        hint="2 perguntas, 30 segundos"
        onPress={() => router.push('/check-in')}
      />
      <LinkRow
        label="Ver tutorial de novo"
        hint="Explicação passo a passo"
        onPress={() => setProfile({ tutorialSeen: false })}
      />

      <Pressable onPress={signOut} style={{ padding: 16, alignItems: 'center', marginTop: 6 }}>
        <Text style={styles.signout}>Sair da conta</Text>
      </Pressable>

      <Pressable onPress={reset} style={{ padding: 16, alignItems: 'center' }}>
        <Text style={styles.danger}>Apagar minhas respostas e recomeçar</Text>
      </Pressable>

      <View style={{ alignItems: 'center', gap: 8, marginTop: 8 }}>
        <View style={styles.dot} />
        <Text style={styles.brandFooter}>
          CONSTANCY <Text style={{ color: colors.textDim }}>by FOCULAB</Text>
        </Text>
        <Text style={styles.tag}>Manter é uma escolha diária.</Text>
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
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function LinkRow({ label, hint, onPress }: { label: string; hint: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.linkText}>{label}</Text>
          <Text style={styles.linkHint}>{hint}</Text>
        </View>
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
    fontSize: 40,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 46,
    marginTop: 12,
    letterSpacing: -0.9,
  },
  sub: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: 10, letterSpacing: -0.1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
  rowLabel: { color: colors.textMuted, fontSize: 14.5, letterSpacing: -0.1 },
  rowValue: { color: colors.textLight, fontSize: 14.5, fontWeight: '600', letterSpacing: -0.2 },
  divider: { height: 1, backgroundColor: colors.navyBorder, marginHorizontal: 16 },
  statVal: {
    color: colors.textLight,
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: -1.2,
    fontFamily: font.numeric,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  linkText: { color: colors.textLight, fontSize: 16.5, fontWeight: '600', letterSpacing: -0.2 },
  linkHint: { color: colors.textMuted, fontSize: 13, marginTop: 5, fontStyle: 'italic', letterSpacing: -0.1 },
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
  chev: { color: colors.green, fontSize: 22 },
  danger: { color: colors.danger, fontSize: 13.5, fontWeight: '600', textDecorationLine: 'underline', letterSpacing: -0.1 },
  signout: { color: colors.textLight, fontSize: 14.5, fontWeight: '600', textDecorationLine: 'underline', letterSpacing: -0.1 },
  accountLabel: { color: colors.green, fontSize: 11, letterSpacing: 2, fontWeight: '700', fontFamily: font.numeric },
  accountName: { color: colors.textLight, fontSize: 24, fontFamily: font.serif, fontStyle: 'italic', marginTop: 8, letterSpacing: -0.5, lineHeight: 30 },
  accountEmail: { color: colors.textMuted, fontSize: 14, marginTop: 4, fontFamily: font.numeric, letterSpacing: -0.2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  brandFooter: { color: colors.textLight, fontSize: 11, letterSpacing: 2.4, fontWeight: '700', fontFamily: font.numeric },
  tag: { color: colors.textDim, fontFamily: font.serif, fontStyle: 'italic', fontSize: 14, letterSpacing: -0.2 },
});
