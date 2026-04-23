import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Eyebrow } from '../../src/components/Eyebrow';
import { colors, font } from '../../src/theme/tokens';

export default function AuthWelcome() {
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
          <Eyebrow text="Sua Conta" />
          <Text style={styles.title}>Entre ou crie{'\n'}sua conta.</Text>
        </View>

        <Text style={styles.lede}>
          Assim seus dados ficam salvos.{'\n'}
          <Text style={{ color: colors.green, fontStyle: 'italic' }}>Nada se perde.</Text>
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>
          Você precisa de um e-mail e uma senha. A senha pode ser bem simples — é só pra proteger suas respostas.
        </Text>

        <View style={{ gap: 12 }}>
          <Button label="Já tenho conta, entrar" onPress={() => router.push('/auth/sign-in')} />
          <Button
            label="Criar conta nova"
            variant="outline"
            onPress={() => router.push('/auth/sign-up')}
          />
        </View>

        <Text style={styles.tag}>Seus dados ficam só no seu aparelho.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  brand: { color: colors.textLight, fontSize: 13, letterSpacing: 3, fontWeight: '800' },
  byFoculab: { color: colors.textDim, fontSize: 12, letterSpacing: 2, fontWeight: '600' },
  title: {
    color: colors.textLight,
    fontSize: 44,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 50,
    marginTop: 6,
  },
  lede: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 32,
  },
  divider: { height: 1, backgroundColor: colors.navyBorderHi, width: 40 },
  body: { color: colors.textMuted, fontSize: 17, lineHeight: 26 },
  tag: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
