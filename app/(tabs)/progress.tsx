import { View, Text, StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { Calendar } from '../../src/components/Calendar';
import { Bars } from '../../src/components/Bars';
import { WeightChart } from '../../src/components/WeightChart';
import { Heatmap30 } from '../../src/components/Heatmap30';
import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { useStore } from '../../src/store/useStore';
import {
  currentStreak,
  bestStreak,
  monthRate,
  monthDays,
  weekBars,
  monthName,
} from '../../src/lib/streak';
import {
  userTDEE,
  latestWeight,
  weeklyWeightDelta,
  weeklyAvgCalories,
} from '../../src/lib/calc';
import { colors, font, radius } from '../../src/theme/tokens';

export default function ProgressScreen() {
  const {
    constancyLog, weightLog, profile, meals, mealDone, extrasLog,
    addWeight, setProfile,
  } = useStore();
  const [weightModal, setWeightModal] = useState(false);
  const [targetModal, setTargetModal] = useState(false);

  const streak = currentStreak(constancyLog);
  const best = bestStreak(constancyLog);
  const rate = monthRate(constancyLog);
  const days = monthDays(constancyLog);
  const bars = weekBars(constancyLog);

  const tdeeVal = userTDEE(profile, weightLog);
  const currentKg = latestWeight(weightLog);
  const weeklyDelta = weeklyWeightDelta(weightLog);
  const avgCal = weeklyAvgCalories(meals, mealDone, extrasLog);
  const target = profile.targetWeightKg;

  const insight =
    streak >= 6
      ? `Você manteve a rotina em ${streak} dos últimos 7 dias. Isso é ótimo. Continue.`
      : streak >= 3
      ? `${streak} dias seguidos. Você tá pegando o ritmo.`
      : 'Marque os próximos dias. Em 3 dias eu já consigo te mostrar como você tá indo.';

  return (
    <Screen>
      <View>
        <Eyebrow text={cap(monthName())} />
        <Text style={styles.title}>Seu progresso</Text>
        <Text style={styles.sub}>Veja como você tá indo este mês.</Text>
      </View>

      {/* SEÇÃO: PESO */}
      <View>
        <Eyebrow text="Meu Peso" />
        <Card>
          <View style={styles.weightHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.weightNow}>{currentKg ? `${currentKg}` : '—'}</Text>
              <Text style={styles.weightLabel}>quilos agora</Text>
            </View>
            {weeklyDelta !== null && (
              <View style={[styles.deltaPill, weeklyDelta <= 0 ? styles.deltaDown : styles.deltaUp]}>
                <Text style={[styles.deltaText, weeklyDelta <= 0 ? { color: colors.green } : { color: '#F8B44B' }]}>
                  {weeklyDelta > 0 ? '+' : ''}{weeklyDelta} kg
                </Text>
                <Text style={styles.deltaHint}>nesta semana</Text>
              </View>
            )}
          </View>

          <WeightChart data={weightLog} targetKg={target} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            <View style={{ flex: 1 }}>
              <Button label="+ Registrar peso" onPress={() => setWeightModal(true)} />
            </View>
            <Pressable onPress={() => setTargetModal(true)} style={styles.targetBtn}>
              <Text style={styles.targetBtnText}>
                {target ? `Meta ${target}kg` : 'Definir meta'}
              </Text>
            </Pressable>
          </View>
        </Card>
      </View>

      {/* SEÇÃO: CALORIAS + METABOLISMO */}
      <View>
        <Eyebrow text="Calorias Do Seu Corpo" />
        {tdeeVal ? (
          <Card>
            <Text style={styles.tdeeLabel}>SEU CORPO GASTA POR DIA</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <Text style={styles.tdeeVal}>{tdeeVal}</Text>
              <Text style={styles.tdeeUnit}>kcal</Text>
            </View>
            <Text style={styles.tdeeHint}>
              Cálculo baseado na sua idade, altura, peso e rotina. Se você consumir perto disso, mantém o peso. Menos, emagrece. Mais, ganha.
            </Text>

            {avgCal !== null && (
              <View style={styles.avgRow}>
                <Text style={styles.avgLabel}>Média dos últimos 7 dias</Text>
                <Text style={[
                  styles.avgVal,
                  avgCal > tdeeVal && { color: '#F8B44B' },
                  avgCal <= tdeeVal && { color: colors.green },
                ]}>
                  {avgCal} kcal
                </Text>
              </View>
            )}
          </Card>
        ) : (
          <Card>
            <Text style={styles.tdeeEmpty}>
              Preencha sua idade, altura e peso pra ver quantas calorias seu corpo gasta por dia.
            </Text>
          </Card>
        )}
      </View>

      {/* SEÇÃO: CONSTÂNCIA */}
      <View>
        <Text style={styles.helpCaption}>
          Os dias em verde são os que você tomou a cápsula. Os brancos você pulou.
        </Text>
        <View style={{ marginTop: 12 }}>
          <Card padding={22}>
            <Calendar days={days} />
          </Card>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Dias seguidos" value={streak} unit="" highlight />
        <Stat label="Do mês" value={rate} unit="%" />
        <Stat label="Seu recorde" value={best} unit="" />
      </View>

      <View>
        <Eyebrow text="Últimos 30 Dias" />
        <View style={{ marginTop: 12 }}>
          <Card>
            <Heatmap30 log={constancyLog} />
          </Card>
        </View>
      </View>

      <Card variant="accent">
        <View style={styles.insightHead}>
          <Text style={styles.insightSpark}>✦</Text>
          <Text style={styles.insightLabel}>OBSERVAÇÃO DA SEMANA</Text>
        </View>
        <Text style={styles.insight}>{insight}</Text>
      </Card>

      <View>
        <Eyebrow text="Dias em que você tomou" />
        <View style={{ marginTop: 12 }}>
          <Card>
            <Bars data={bars} />
          </Card>
        </View>
      </View>

      <View style={styles.quoteWrap}>
        <View style={styles.quoteLine} />
        <Text style={styles.quote}>
          "Manter é uma escolha diária.{'\n'}E escolhas diárias precisam de cuidado."
        </Text>
      </View>

      <Modal visible={weightModal} transparent animationType="fade" onRequestClose={() => setWeightModal(false)}>
        <WeightForm
          current={currentKg}
          onCancel={() => setWeightModal(false)}
          onSave={(kg) => {
            addWeight(kg);
            setWeightModal(false);
          }}
        />
      </Modal>

      <Modal visible={targetModal} transparent animationType="fade" onRequestClose={() => setTargetModal(false)}>
        <TargetForm
          current={target}
          onCancel={() => setTargetModal(false)}
          onSave={(kg) => {
            setProfile({ targetWeightKg: kg });
            setTargetModal(false);
          }}
          onClear={() => {
            setProfile({ targetWeightKg: undefined });
            setTargetModal(false);
          }}
        />
      </Modal>
    </Screen>
  );
}

function WeightForm({
  current,
  onSave,
  onCancel,
}: {
  current: number | null;
  onSave: (kg: number) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(current ? String(current) : '');
  const n = parseFloat(val.replace(',', '.'));
  const valid = !isNaN(n) && n >= 30 && n <= 300;
  return (
    <KeyboardAvoidingView
      style={styles.modalBg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      <ScrollView
        contentContainerStyle={styles.modalScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalCard}>
          <Eyebrow text="Registrar Peso" />
          <Text style={styles.modalTitle}>Qual seu{'\n'}peso hoje?</Text>
          <View style={{ gap: 14, marginTop: 16 }}>
            <TextField
              label="Peso em quilos"
              hint="Pode usar vírgula. Ex: 72,4"
              value={val}
              onChangeText={(v) => setVal(v.replace(/[^0-9.,]/g, '').slice(0, 6))}
              keyboardType="numeric"
              placeholder="Ex: 72"
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
            <View style={{ flex: 1 }}>
              <Button label="Cancelar" variant="outline" onPress={onCancel} />
            </View>
            <View style={{ flex: 1.3 }}>
              <Button label="Salvar" disabled={!valid} onPress={() => onSave(n)} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TargetForm({
  current,
  onSave,
  onCancel,
  onClear,
}: {
  current?: number;
  onSave: (kg: number) => void;
  onCancel: () => void;
  onClear: () => void;
}) {
  const [val, setVal] = useState(current ? String(current) : '');
  const n = parseFloat(val.replace(',', '.'));
  const valid = !isNaN(n) && n >= 30 && n <= 300;
  return (
    <KeyboardAvoidingView
      style={styles.modalBg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      <ScrollView
        contentContainerStyle={styles.modalScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalCard}>
          <Eyebrow text="Minha Meta" />
          <Text style={styles.modalTitle}>Qual peso{'\n'}você quer?</Text>
          <Text style={styles.targetIntro}>
            Não precisa ser rápido. O importante é saber pra onde ir.
          </Text>
          <View style={{ gap: 14, marginTop: 16 }}>
            <TextField
              label="Peso que quer alcançar"
              hint="Em quilos. Pode usar vírgula."
              value={val}
              onChangeText={(v) => setVal(v.replace(/[^0-9.,]/g, '').slice(0, 6))}
              keyboardType="numeric"
              placeholder="Ex: 65"
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
            <View style={{ flex: 1 }}>
              <Button label="Cancelar" variant="outline" onPress={onCancel} />
            </View>
            <View style={{ flex: 1.3 }}>
              <Button label="Salvar meta" disabled={!valid} onPress={() => onSave(n)} />
            </View>
          </View>
          {current && (
            <Pressable onPress={onClear} style={{ padding: 14, alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.clearLink}>Tirar a meta</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Stat({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <Card variant={highlight ? 'accent' : 'dark'} style={{ flex: 1, alignItems: 'flex-start' }} padding={16}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.statVal, highlight && { color: colors.green }]}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  title: {
    color: colors.textLight,
    fontSize: 40,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 12,
    letterSpacing: -0.9,
    lineHeight: 46,
  },
  sub: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 10,
    lineHeight: 23,
    letterSpacing: -0.1,
  },
  helpCaption: {
    color: colors.textMuted,
    fontSize: 13.5,
    fontStyle: 'italic',
    lineHeight: 20,
    letterSpacing: -0.1,
  },

  weightHead: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 },
  weightNow: {
    color: colors.textLight,
    fontSize: 44,
    fontWeight: '600',
    letterSpacing: -1.8,
    fontFamily: font.numeric,
  },
  weightLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2, letterSpacing: -0.1 },
  deltaPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'flex-end',
  },
  deltaDown: {
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  deltaUp: {
    backgroundColor: 'rgba(248,180,75,0.12)',
    borderColor: 'rgba(248,180,75,0.35)',
  },
  deltaText: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3, fontFamily: font.numeric },
  deltaHint: { color: colors.textDim, fontSize: 10, marginTop: 2, letterSpacing: 0.3, fontFamily: font.numeric },

  targetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.navyBorderHi,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBtnText: { color: colors.textLight, fontSize: 13, fontWeight: '600', letterSpacing: 0.4, fontFamily: font.numeric },

  tdeeLabel: { color: colors.green, fontSize: 11, letterSpacing: 2, fontWeight: '700', fontFamily: font.numeric },
  tdeeVal: {
    color: colors.textLight,
    fontSize: 54,
    fontWeight: '600',
    letterSpacing: -2.4,
    fontFamily: font.numeric,
  },
  tdeeUnit: { color: colors.textMuted, fontSize: 16, fontWeight: '500', fontFamily: font.numeric },
  tdeeHint: { color: colors.textMuted, fontSize: 14, marginTop: 12, lineHeight: 21, letterSpacing: -0.1 },
  tdeeEmpty: { color: colors.textMuted, fontSize: 15, lineHeight: 23, letterSpacing: -0.1, fontStyle: 'italic' },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.navyBorder,
  },
  avgLabel: { color: colors.textMuted, fontSize: 13, letterSpacing: -0.1 },
  avgVal: { color: colors.textLight, fontSize: 18, fontWeight: '700', letterSpacing: -0.4, fontFamily: font.numeric },

  statVal: {
    color: colors.textLight,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -1.2,
    fontFamily: font.numeric,
  },
  statUnit: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 3,
    fontFamily: font.numeric,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: -0.1,
    lineHeight: 16,
  },
  insightHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightSpark: { color: colors.green, fontSize: 14 },
  insightLabel: {
    color: colors.green,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    fontFamily: font.numeric,
  },
  insight: {
    color: colors.textLight,
    fontSize: 19,
    lineHeight: 29,
    marginTop: 14,
    fontFamily: font.serif,
    fontStyle: 'italic',
    letterSpacing: -0.3,
  },
  quoteWrap: { alignItems: 'center', marginTop: 8, gap: 12 },
  quoteLine: { width: 30, height: 1.5, backgroundColor: colors.green },
  quote: {
    color: colors.textMuted,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
    letterSpacing: -0.2,
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(5,14,31,0.85)',
  },
  modalScroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    paddingVertical: 40,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.navyBorderHi,
    padding: 24,
  },
  modalTitle: {
    color: colors.textLight,
    fontSize: 30,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 36,
    marginTop: 8,
    letterSpacing: -0.7,
  },
  targetIntro: { color: colors.textMuted, fontSize: 14.5, lineHeight: 22, marginTop: 10, letterSpacing: -0.1 },
  clearLink: { color: colors.danger, fontSize: 13.5, fontWeight: '600', textDecorationLine: 'underline', letterSpacing: -0.1 },
});
