import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Heading } from '../../src/components/Heading';
import { colors, font } from '../../src/theme/tokens';

export default function OnboardingWelcome() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: 30, paddingVertical: 40 }}>
        <Text style={styles.brand}>● CONSTANCY <Text style={styles.byFoculab}>by Foculab</Text></Text>
        <Heading
          eyebrow="Bem-vindo"
          serif="Continue o que"
          sans="Você Começou."
        />
        <Text style={styles.lede}>
          Não com força de vontade. <Text style={{ color: colors.green }}>Com constância.</Text>
        </Text>
        <Text style={styles.body}>
          Antes de começar, 3 perguntas rápidas. Isso calibra o app pro seu padrão —
          não pra um manual genérico.
        </Text>
        <Button label="Começar" onPress={() => router.push('/onboarding/slot')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.green,
    fontFamily: font.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
  },
  byFoculab: { color: colors.textDim, fontWeight: '400' },
  lede: {
    color: colors.textLight,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 28,
  },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
});
