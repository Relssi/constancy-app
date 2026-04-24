import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

export default function SignIn() {
  const router = useRouter();
  const signIn = useStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    const r = signIn(email, password);
    if (!r.ok) setError(r.error || 'Não foi possível entrar.');
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

      <View style={{ gap: 8 }}>
        <Eyebrow text="Entrar" />
        <Text style={styles.title}>Bem-vindo{'\n'}de volta.</Text>
        <Text style={styles.sub}>
          Digite o e-mail e a senha que você criou. Se esqueceu, pode criar uma conta nova.
        </Text>
      </View>

      <View style={{ gap: 18, marginTop: 6 }}>
        <TextField
          label="Seu e-mail"
          hint="Exemplo: maria@gmail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="seu@email.com"
        />
        <TextField
          label="Sua senha"
          hint="A mesma que você criou quando abriu a conta."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          placeholder="••••"
        />
        {error && <Text style={styles.errorBox}>{error}</Text>}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label="Entrar"
        disabled={!email || !password}
        onPress={handleSubmit}
      />
      <Pressable onPress={() => router.replace('/auth/sign-up')} style={{ padding: 14, alignItems: 'center' }}>
        <Text style={styles.link}>Ainda não tenho conta — criar agora</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 15, fontWeight: '600', fontFamily: font.numeric, letterSpacing: -0.1 },
  title: {
    color: colors.textLight,
    fontSize: 42,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 48,
    marginTop: 10,
    letterSpacing: -0.9,
  },
  sub: { color: colors.textMuted, fontSize: 15.5, lineHeight: 24, marginTop: 8, letterSpacing: -0.1 },
  errorBox: {
    color: colors.danger,
    fontSize: 14.5,
    fontWeight: '600',
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
    borderRadius: 12,
    padding: 14,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  link: { color: colors.green, fontSize: 14.5, fontWeight: '600', textDecorationLine: 'underline', letterSpacing: -0.1 },
});
