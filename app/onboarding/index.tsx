import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Eyebrow } from '../../src/components/Eyebrow';
import { Display } from '../../src/components/Display';
import { colors, font } from '../../src/theme/tokens';

export default function OnboardingWelcome() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: 28, paddingVertical: 30 }}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brand}>CONSTANCY</Text>
          <Text style={styles.byFoculab}>by Foculab</Text>
        </View>

        <View style={{ gap: 6 }}>
          <Eyebrow text="Bem-vindo" />
          <Display serif="Continue o que" sans="Você Começou." size="xl" />
        </View>

        <Text style={styles.lede}>
          Não com força de vontade.{'\n'}
          <Text style={{ color: colors.green, fontStyle: 'italic' }}>Com constância.</Text>
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>
          Antes de começar, <Text style={{ color: colors.textLight }}>3 perguntas rápidas</Text>. Isso
          calibra o app pro seu padrão — não pra um manual genérico.
        </Text>

        <Button label="Começar" icon="→" onPress={() => router.push('/onboarding/slot')} />

        <Text style={styles.tag}>Leva 60 segundos.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  brand: { color: colors.textLight, fontSize: 12, letterSpacing: 3, fontWeight: '800' },
  byFoculab: { color: colors.textDim, fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  lede: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 32,
  },
  divider: { height: 1, backgroundColor: colors.navyBorderHi, width: 40 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 24 },
  tag: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
});
