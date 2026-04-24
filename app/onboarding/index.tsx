import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Eyebrow } from '../../src/components/Eyebrow';
import { colors, font } from '../../src/theme/tokens';

export default function OnboardingWelcome() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: 26, paddingVertical: 30 }}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brand}>CONSTANCY</Text>
          <Text style={styles.byFoculab}>por FOCULAB</Text>
        </View>

        <View style={{ gap: 8 }}>
          <Eyebrow text="Bem-vindo" />
          <Text style={styles.title}>Seja{'\n'}bem-vindo.</Text>
        </View>

        <Text style={styles.lede}>
          Aqui você tem apoio todo dia.{'\n'}
          <Text style={{ color: colors.green, fontStyle: 'italic' }}>Sem pressa. Sem pressão.</Text>
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>
          Vamos começar com <Text style={{ color: colors.textLight, fontWeight: '700' }}>3 perguntas simples</Text>. Elas ajudam o aplicativo a te entender melhor.
        </Text>

        <Button label="Começar" onPress={() => router.push('/onboarding/slot')} />

        <Text style={styles.tag}>Leva menos de 1 minuto.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  brand: { color: colors.textLight, fontSize: 12, letterSpacing: 2.6, fontWeight: '700', fontFamily: font.numeric },
  byFoculab: { color: colors.textDim, fontSize: 11, letterSpacing: 1.8, fontWeight: '600', fontFamily: font.numeric },
  title: {
    color: colors.textLight,
    fontSize: 44,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 50,
    marginTop: 8,
    letterSpacing: -1,
  },
  lede: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  divider: { height: 1, backgroundColor: colors.navyBorderHi, width: 40 },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 25, letterSpacing: -0.1 },
  tag: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1.4,
    fontWeight: '600',
    fontFamily: font.numeric,
  },
});
