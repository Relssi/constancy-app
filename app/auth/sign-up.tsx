import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore } from '../../src/store/useStore';
import { colors, font } from '../../src/theme/tokens';

export default function SignUp() {
  const router = useRouter();
  const signUp = useStore((s) => s.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (password !== confirm) {
      setError('As duas senhas estão diferentes. Digite a mesma senha nos dois campos.');
      return;
    }
    const r = signUp(email, name, password);
    if (!r.ok) setError(r.error || 'Não foi possível criar a conta.');
  };

  return (
    <Screen kbAvoid>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

      <View style={{ gap: 8 }}>
        <Eyebrow text="Criar Conta" />
        <Text style={styles.title}>Vamos{'\n'}começar.</Text>
        <Text style={styles.sub}>
          Escolha uma senha que você lembre. Pode ser uma palavra ou uns números simples.
        </Text>
      </View>

      <View style={{ gap: 18, marginTop: 6 }}>
        <TextField
          label="Seu nome"
          hint="Como você quer ser chamado."
          value={name}
          onChangeText={setName}
          placeholder="Ex: Maria"
        />
        <TextField
          label="Seu e-mail"
          hint="Precisa ser um e-mail que você já usa."
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="seu@email.com"
        />
        <TextField
          label="Crie uma senha"
          hint="No mínimo 4 letras ou números."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="••••"
        />
        <TextField
          label="Repita a senha"
          hint="Só pra confirmar que foi digitada certo."
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoCapitalize="none"
          placeholder="••••"
        />
        {error && <Text style={styles.errorBox}>{error}</Text>}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label="Criar minha conta"
        disabled={!name || !email || !password || !confirm}
        onPress={handleSubmit}
      />
      <Pressable onPress={() => router.replace('/auth/sign-in')} style={{ padding: 14, alignItems: 'center' }}>
        <Text style={styles.link}>Já tenho conta — entrar</Text>
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
