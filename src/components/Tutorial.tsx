import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, font, gradients } from '../theme/tokens';

type Step = {
  title: string;
  body: string;
  arrow: 'up' | 'down' | 'none';
};

const STEPS: Step[] = [
  {
    title: 'Oi! Este é seu aplicativo.',
    body: 'Ele te ajuda a manter a rotina sem precisar pensar muito. Vou te mostrar em 5 passos, tudo bem?',
    arrow: 'none',
  },
  {
    title: '1. Dias seguidos',
    body: 'No topo da tela inicial, você vê quantos dias seguidos você tomou a cápsula. Quanto mais, melhor.',
    arrow: 'up',
  },
  {
    title: '2. Ajuda na hora',
    body: 'Quando bater vontade de comer algo fora de hora, toque no botão verde "Me ajuda agora". O aplicativo te acalma em 30 segundos.',
    arrow: 'none',
  },
  {
    title: '3. O que fazer hoje',
    body: 'A lista "Minha rotina de hoje" mostra os passos do dia. Toque na bolinha pra marcar quando você terminar cada um.',
    arrow: 'none',
  },
  {
    title: '4. Menu de baixo',
    body: 'Embaixo da tela tem 4 botões: Início, Progresso, Cápsula e Eu. Toque em qualquer um pra trocar de tela. Pode explorar à vontade.',
    arrow: 'down',
  },
  {
    title: 'Pronto! Pode começar.',
    body: 'Se se perder, vá em "Eu" no menu de baixo e toque em "Ver tutorial de novo". Estou aqui pra te ajudar.',
    arrow: 'none',
  },
];

export function Tutorial({ visible, onFinish }: { visible: boolean; onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  function next() {
    if (last) {
      setStep(0);
      onFinish();
    } else {
      setStep(step + 1);
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        {s.arrow === 'up' && <View style={[styles.arrowUp]}><Text style={styles.arrowText}>▲</Text></View>}

        <View style={styles.bubbleWrap}>
          <View style={styles.bubble}>
            <LinearGradient
              colors={['rgba(34,197,94,0.10)', 'rgba(255,255,255,0.02)'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill as any}
            />
            <View style={styles.progressDots}>
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === step && styles.dotActive,
                    i < step && { backgroundColor: colors.green },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.stepNum}>Passo {Math.min(step + 1, STEPS.length)} de {STEPS.length}</Text>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.body}>{s.body}</Text>

            <View style={styles.actions}>
              {!last && (
                <Pressable onPress={onFinish} style={styles.skipBtn} hitSlop={12}>
                  <Text style={styles.skipText}>Pular tutorial</Text>
                </Pressable>
              )}
              <Pressable onPress={next} style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.85 }]}>
                <LinearGradient
                  colors={gradients.cta}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill as any}
                />
                <Text style={styles.nextText}>
                  {last ? 'Entendi, começar' : 'Próximo'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {s.arrow === 'down' && <View style={[styles.arrowDown]}><Text style={styles.arrowText}>▼</Text></View>}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,14,31,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bubbleWrap: { width: '100%', maxWidth: 480 },
  bubble: {
    borderRadius: radius.xl,
    padding: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(34,197,94,0.35)',
    backgroundColor: 'rgba(11,37,69,0.95)',
    ...shadow.glow,
  },
  progressDots: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: {
    width: 22,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dotActive: { backgroundColor: colors.green, width: 30 },
  stepNum: {
    color: colors.green,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    color: colors.textLight,
    fontSize: 26,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 32,
    marginBottom: 14,
  },
  body: {
    color: colors.textLight,
    fontSize: 18,
    lineHeight: 28,
    opacity: 0.85,
  },
  actions: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 8 },
  skipText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  nextBtn: {
    flex: 1,
    borderRadius: radius.pill,
    overflow: 'hidden',
    position: 'relative',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glow,
  },
  nextText: {
    color: '#06240F',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  arrowUp: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
  },
  arrowDown: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
  },
  arrowText: {
    color: colors.green,
    fontSize: 28,
    textShadowColor: colors.green,
    textShadowRadius: 12,
  },
});
