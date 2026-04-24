import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, Meal, MealItem } from '../../src/store/useStore';
import { formatTimeInput } from '../../src/lib/format';
import { calorieTarget, caloriesToday, mealKcal } from '../../src/lib/calc';
import { getFood, kcalFor, Food } from '../../src/lib/foods';
import { FoodPicker } from '../../src/components/FoodPicker';
import { colors, font, radius } from '../../src/theme/tokens';

const todayKey = () => new Date().toDateString();

export default function Meals() {
  const {
    meals, addMeal, updateMeal, removeMeal, toggleMealDone, mealDone,
    extrasLog, profile, weightLog, addExtra, removeExtra,
  } = useStore();
  const [editing, setEditing] = useState<Meal | null>(null);
  const [creating, setCreating] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const sorted = useMemo(() => [...meals].sort((a, b) => a.time.localeCompare(b.time)), [meals]);
  const target = calorieTarget(profile, weightLog);
  const consumed = caloriesToday(meals, mealDone, extrasLog);
  const doneToday = mealDone[todayKey()] ?? [];
  const plannedKcalToday = sorted.reduce((s, m) => s + mealKcal(m), 0);
  const todayExtras = useMemo(() => {
    const k = todayKey();
    return extrasLog
      .filter((e) => new Date(e.ts).toDateString() === k)
      .sort((a, b) => b.ts - a.ts);
  }, [extrasLog]);

  return (
    <Screen>
      <View>
        <Eyebrow text="Minha Alimentação" />
        <Text style={styles.title}>O que eu{'\n'}vou comer hoje.</Text>
        <Text style={styles.sub}>
          Marque ✓ quando comer. O app soma as calorias do seu dia.
        </Text>
      </View>

      {/* Card de total do dia */}
      <Card padding={20}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.bigStat}>{consumed}</Text>
            <Text style={styles.bigLabel}>calorias consumidas hoje</Text>
          </View>
          {target && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.targetVal}>{target}</Text>
              <Text style={styles.targetLabel}>meta do dia</Text>
            </View>
          )}
        </View>
        {target && (
          <>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (consumed / target) * 100)}%`,
                    backgroundColor: consumed > target ? colors.danger : colors.green,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressHint}>
              {consumed === 0
                ? 'Ainda não marcou nenhuma refeição hoje.'
                : consumed < target
                ? `Faltam ${target - consumed} calorias pra sua meta.`
                : consumed === target
                ? 'Chegou exatamente na meta. Ótimo.'
                : `Passou ${consumed - target} calorias da meta. Tudo bem.`}
            </Text>
          </>
        )}
        {!target && (
          <Text style={styles.progressHint}>
            Preencha idade, altura e peso no seu perfil pra ver a meta do dia.
          </Text>
        )}
      </Card>

      <Pressable onPress={() => setShowExtra(true)} style={styles.extraBtn}>
        <Text style={styles.extraPlus}>+</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.extraTitle}>Comi algo extra</Text>
          <Text style={styles.extraHint}>Comeu algo fora do plano? Registra aqui.</Text>
        </View>
      </Pressable>

      {todayExtras.length > 0 && (
        <View style={{ gap: 8 }}>
          <Text style={styles.listHeader}>
            Extras de hoje — {todayExtras.reduce((s, e) => s + e.calories, 0)} kcal
          </Text>
          {todayExtras.map((e) => (
            <View key={e.id} style={styles.extraItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.extraItemName}>{e.name}</Text>
                <Text style={styles.extraItemKcal}>{e.calories} kcal</Text>
              </View>
              <Pressable onPress={() => removeExtra(e.id)} style={styles.extraRemove} hitSlop={8}>
                <Text style={styles.extraRemoveTxt}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {sorted.length === 0 ? (
        <Card padding={24}>
          <Text style={styles.emptyTitle}>Ainda sem refeições.</Text>
          <Text style={styles.emptySub}>
            Toque no botão verde abaixo pra adicionar a primeira. Pode ser o café da manhã.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          <Text style={styles.listHeader}>
            Minhas refeições{plannedKcalToday > 0 ? ` — ${plannedKcalToday} kcal planejadas` : ''}
          </Text>
          {sorted.map((m) => {
            const done = doneToday.includes(m.id);
            return (
              <Card key={m.id} padding={14}>
                <View style={styles.mealRow}>
                  <Pressable onPress={() => toggleMealDone(m.id)} style={[styles.check, done && styles.checkDone]}>
                    {done && <Text style={styles.tick}>✓</Text>}
                  </Pressable>
                  <View style={styles.timeCol}>
                    <Text style={styles.timeTxt}>{m.time}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mealName, done && styles.mealDoneTxt]}>{m.name}</Text>
                    {m.notes ? <Text style={styles.mealNotes}>{m.notes}</Text> : null}
                    {m.items && m.items.length > 0 && (
                      <Text style={styles.mealItemsInline} numberOfLines={2}>
                        {m.items.map((it) => {
                          const f = getFood(it.foodId);
                          return f ? `${f.name.split(',')[0]} ${it.grams}g` : '';
                        }).filter(Boolean).join(' · ')}
                      </Text>
                    )}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {mealKcal(m) > 0 ? (
                        <View style={styles.calPill}>
                          <Text style={styles.calText}>{mealKcal(m)} kcal</Text>
                        </View>
                      ) : null}
                      {m.recurring && (
                        <View style={styles.recurPill}>
                          <Text style={styles.recurText}>todo dia</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <Pressable onPress={() => setEditing(m)} style={styles.smallBtn}>
                    <Text style={styles.smallBtnText}>Editar</Text>
                  </Pressable>
                  <Pressable onPress={() => removeMeal(m.id)} style={styles.smallBtnDanger}>
                    <Text style={styles.smallBtnDangerText}>Apagar</Text>
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      <Button label="+ Adicionar refeição" onPress={() => setCreating(true)} />

      <Modal
        visible={creating || !!editing}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <MealForm
          initial={editing ?? undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(data) => {
            if (editing) updateMeal(editing.id, data);
            else addMeal(data);
            setCreating(false);
            setEditing(null);
          }}
        />
      </Modal>

      <Modal
        visible={showExtra}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExtra(false)}
      >
        <ExtraForm
          onCancel={() => setShowExtra(false)}
          onSave={(name, cal) => {
            addExtra(name, cal);
            setShowExtra(false);
          }}
        />
      </Modal>
    </Screen>
  );
}

function MealForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Meal;
  onSave: (d: Omit<Meal, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [time, setTime] = useState(initial?.time ?? '');
  const [calories, setCalories] = useState(initial?.calories ? String(initial.calories) : '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [recurring, setRecurring] = useState(initial?.recurring ?? true);
  const [items, setItems] = useState<MealItem[]>(initial?.items ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);

  const itemsKcal = items.reduce((s, it) => {
    const f = getFood(it.foodId);
    return f ? s + kcalFor(f, it.grams) : s;
  }, 0);
  const hasItems = items.length > 0;

  function addItem(food: Food, grams: number) {
    setItems((prev) => [...prev, { foodId: food.id, grams }]);
    setPickerOpen(false);
  }
  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <View style={styles.modalBg}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.modalCard}>
          <Eyebrow text={initial ? 'Editar refeição' : 'Nova refeição'} />
          <Text style={styles.modalTitle}>
            {initial ? 'Editar' : 'O que vai'}
            {'\n'}
            {initial ? 'refeição.' : 'comer?'}
          </Text>
          <View style={{ gap: 16, marginTop: 16 }}>
            <TextField
              label="Nome da refeição"
              hint="Ex: Café da manhã, Almoço, Jantar, Lanche da tarde"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Almoço"
            />
            <TextField
              label="Horário"
              hint="Digite os números. O app coloca os dois-pontos sozinho (ex: 1230 vira 12:30)."
              value={time}
              onChangeText={(v) => setTime(formatTimeInput(v))}
              placeholder="12:30"
              keyboardType="numeric"
              maxLength={5}
            />

            {/* Itens do banco nutricional */}
            <View>
              <Text style={styles.itemsLabel}>Alimentos que vão entrar</Text>
              <Text style={styles.itemsHint}>
                Procure no banco e informe o peso. O app soma as calorias sozinho.
              </Text>

              {items.length > 0 && (
                <View style={{ gap: 8, marginTop: 10 }}>
                  {items.map((it, idx) => {
                    const f = getFood(it.foodId);
                    if (!f) return null;
                    const k = kcalFor(f, it.grams);
                    return (
                      <View key={idx} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemName} numberOfLines={2}>{f.name}</Text>
                          <Text style={styles.itemMeta}>{it.grams}g  ·  {k} kcal</Text>
                        </View>
                        <Pressable onPress={() => removeItem(idx)} style={styles.itemX} hitSlop={8}>
                          <Text style={styles.itemXTxt}>×</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                  <View style={styles.itemsTotal}>
                    <Text style={styles.itemsTotalLabel}>TOTAL</Text>
                    <Text style={styles.itemsTotalVal}>{itemsKcal} kcal</Text>
                  </View>
                </View>
              )}

              <Pressable onPress={() => setPickerOpen(true)} style={styles.pickBtn}>
                <Text style={styles.pickBtnTxt}>
                  {items.length === 0 ? '+ Buscar no banco de alimentos' : '+ Adicionar outro alimento'}
                </Text>
              </Pressable>
            </View>

            {!hasItems && (
              <TextField
                label="Calorias (opcional)"
                hint="Se preferir digitar direto em vez de usar o banco. Pode deixar em branco."
                value={calories}
                onChangeText={(v) => setCalories(v.replace(/[^0-9]/g, ''))}
                placeholder="Ex: 450"
                keyboardType="numeric"
              />
            )}

            <TextField
              label="Observação (opcional)"
              hint="Algum detalhe que queira lembrar."
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Com pouco sal"
            />

            <Pressable onPress={() => setRecurring(!recurring)} style={styles.recurRow}>
              <View style={[styles.recurBox, recurring && styles.recurBoxOn]}>
                {recurring && <Text style={styles.recurCheck}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recurLabel}>Repetir todo dia</Text>
                <Text style={styles.recurSub}>
                  Se marcado, essa refeição fica salva como sua rotina. Aparece todo dia pra você marcar.
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
            <View style={{ flex: 1 }}>
              <Button label="Cancelar" variant="outline" onPress={onCancel} />
            </View>
            <View style={{ flex: 1.3 }}>
              <Button
                label="Salvar"
                disabled={!name || time.length < 4}
                onPress={() =>
                  onSave({
                    name: name.trim(),
                    time: time.trim(),
                    calories: hasItems ? undefined : calories ? Number(calories) : undefined,
                    notes: notes.trim() || undefined,
                    recurring,
                    items: hasItems ? items : undefined,
                  })
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <FoodPicker
        visible={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        onPick={addItem}
      />
    </View>
  );
}

const QUICK_EXTRAS: { name: string; kcal: number }[] = [
  { name: 'Pedaço de bolo', kcal: 250 },
  { name: 'Brigadeiro', kcal: 120 },
  { name: 'Chocolate (1 barra pequena)', kcal: 200 },
  { name: 'Biscoito recheado (4)', kcal: 180 },
  { name: 'Hambúrguer', kcal: 550 },
  { name: 'Pizza (1 fatia)', kcal: 280 },
  { name: 'Refrigerante (lata)', kcal: 140 },
  { name: 'Salgadinho (pacote)', kcal: 320 },
  { name: 'Pão de queijo', kcal: 120 },
  { name: 'Sorvete (1 bola)', kcal: 150 },
];

function ExtraForm({
  onSave,
  onCancel,
}: {
  onSave: (name: string, kcal: number) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [cal, setCal] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  function handlePick(food: Food, grams: number) {
    const k = kcalFor(food, grams);
    onSave(`${food.name} (${grams}g)`, k);
    setPickerOpen(false);
  }

  return (
    <View style={styles.modalBg}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.modalCard}>
          <Eyebrow text="Comi Algo Extra" />
          <Text style={styles.modalTitle}>Ninguém é{'\n'}de ferro.</Text>
          <Text style={styles.extraIntro}>
            Escolha da lista rápida, busque no banco ou digite você mesmo.
          </Text>

          <Pressable onPress={() => setPickerOpen(true)} style={styles.extraPickBtn}>
            <Text style={styles.extraPickBtnTxt}>⌕  Buscar no banco de alimentos</Text>
            <Text style={styles.extraPickBtnHint}>+500 alimentos com calorias por peso</Text>
          </Pressable>

          <Text style={styles.extraSection}>LISTA RÁPIDA</Text>
          <View style={styles.quickGrid}>
            {QUICK_EXTRAS.map((q) => (
              <Pressable
                key={q.name}
                onPress={() => onSave(q.name, q.kcal)}
                style={styles.quickChip}
              >
                <Text style={styles.quickName}>{q.name}</Text>
                <Text style={styles.quickKcal}>{q.kcal} kcal</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.extraSection, { marginTop: 18 }]}>OU DIGITAR</Text>
          <View style={{ gap: 14, marginTop: 10 }}>
            <TextField
              label="O que foi?"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Coxinha na padaria"
            />
            <TextField
              label="Calorias (se souber)"
              hint="Se não tiver ideia, coloque um chute. Ex: 200"
              value={cal}
              onChangeText={(v) => setCal(v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="Ex: 250"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
            <View style={{ flex: 1 }}>
              <Button label="Cancelar" variant="outline" onPress={onCancel} />
            </View>
            <View style={{ flex: 1.3 }}>
              <Button
                label="Salvar"
                disabled={!name || !cal}
                onPress={() => onSave(name.trim(), Number(cal))}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <FoodPicker
        visible={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        onPick={handlePick}
      />
    </View>
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
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  bigStat: {
    color: colors.textLight,
    fontSize: 44,
    fontWeight: '600',
    letterSpacing: -1.8,
    fontFamily: font.numeric,
  },
  bigLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4, letterSpacing: -0.1 },
  targetVal: {
    color: colors.green,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.8,
    fontFamily: font.numeric,
  },
  targetLabel: { color: colors.textDim, fontSize: 11, marginTop: 2, letterSpacing: 0.4, fontFamily: font.numeric },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  progressHint: { color: colors.textMuted, fontSize: 13.5, marginTop: 10, fontStyle: 'italic', letterSpacing: -0.1 },

  extraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(236,121,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(236,121,53,0.4)',
    borderRadius: radius.md,
    padding: 16,
  },
  extraPlus: {
    width: 36,
    height: 36,
    textAlign: 'center',
    lineHeight: 34,
    fontSize: 22,
    color: '#EC7935',
    fontWeight: '700',
    fontFamily: font.numeric,
    backgroundColor: 'rgba(236,121,53,0.18)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(236,121,53,0.4)',
  },
  extraTitle: { color: colors.textLight, fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  extraHint: { color: colors.textMuted, fontSize: 13, marginTop: 3, fontStyle: 'italic', letterSpacing: -0.1 },

  listHeader: { color: colors.textDim, fontSize: 11, letterSpacing: 1.6, fontWeight: '600', fontFamily: font.numeric, marginTop: 4, marginBottom: 2 },
  emptyTitle: { color: colors.textLight, fontSize: 24, fontFamily: font.serif, fontStyle: 'italic', letterSpacing: -0.5 },
  emptySub: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: 10, letterSpacing: -0.1 },
  mealRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.navyBorderHi,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  tick: { color: '#06240F', fontWeight: '900', fontSize: 16 },
  timeCol: {
    minWidth: 64,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    alignItems: 'center',
  },
  timeTxt: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    fontFamily: font.numeric,
  },
  mealName: { color: colors.textLight, fontSize: 16.5, fontWeight: '600', letterSpacing: -0.2 },
  mealDoneTxt: { textDecorationLine: 'line-through', color: colors.textDim },
  mealNotes: { color: colors.textMuted, fontSize: 13, marginTop: 4, fontStyle: 'italic', letterSpacing: -0.1 },
  calPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  calText: { color: colors.textLight, fontSize: 12, fontWeight: '600', letterSpacing: 0.2, fontFamily: font.numeric },
  recurPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  recurText: { color: colors.green, fontSize: 11, fontWeight: '600', letterSpacing: 0.4, fontFamily: font.numeric },

  smallBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  smallBtnText: { color: colors.textLight, fontSize: 12.5, fontWeight: '600', letterSpacing: 0.6, fontFamily: font.numeric },
  smallBtnDanger: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
  },
  smallBtnDangerText: { color: colors.danger, fontSize: 12.5, fontWeight: '600', letterSpacing: 0.6, fontFamily: font.numeric },

  recurRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34,197,94,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  recurBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.navyBorderHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recurBoxOn: { backgroundColor: colors.green, borderColor: colors.green },
  recurCheck: { color: '#06240F', fontWeight: '900', fontSize: 14 },
  recurLabel: { color: colors.textLight, fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  recurSub: { color: colors.textMuted, fontSize: 13, marginTop: 3, lineHeight: 19, fontStyle: 'italic', letterSpacing: -0.1 },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(5,14,31,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
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
  extraIntro: { color: colors.textMuted, fontSize: 14.5, lineHeight: 22, marginTop: 12, letterSpacing: -0.1 },
  extraSection: { color: colors.textDim, fontSize: 11, letterSpacing: 1.8, fontWeight: '700', fontFamily: font.numeric, marginTop: 18 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(236,121,53,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(236,121,53,0.3)',
  },
  quickName: { color: colors.textLight, fontSize: 13, fontWeight: '600', letterSpacing: -0.1 },
  quickKcal: { color: '#EC7935', fontSize: 11, marginTop: 2, fontWeight: '600', fontFamily: font.numeric, letterSpacing: 0.3 },

  // Itens da refeição
  itemsLabel: { color: colors.textLight, fontSize: 14, fontWeight: '600', letterSpacing: -0.1 },
  itemsHint: { color: colors.textMuted, fontSize: 12.5, marginTop: 4, fontStyle: 'italic', letterSpacing: -0.1 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  itemName: { color: colors.textLight, fontSize: 13.5, fontWeight: '600', letterSpacing: -0.1, lineHeight: 18 },
  itemMeta: { color: colors.green, fontSize: 11.5, marginTop: 3, fontFamily: font.numeric, letterSpacing: 0.2, fontWeight: '600' },
  itemX: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)',
  },
  itemXTxt: { color: colors.danger, fontSize: 18, fontWeight: '700', marginTop: -2 },
  itemsTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.4)',
  },
  itemsTotalLabel: { color: colors.green, fontSize: 11, fontWeight: '700', letterSpacing: 1.6, fontFamily: font.numeric },
  itemsTotalVal: { color: colors.green, fontSize: 17, fontWeight: '700', fontFamily: font.numeric, letterSpacing: -0.4 },
  pickBtn: {
    marginTop: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.green,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(34,197,94,0.06)',
    alignItems: 'center',
  },
  pickBtnTxt: { color: colors.green, fontSize: 13.5, fontWeight: '600', letterSpacing: -0.1 },
  mealItemsInline: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
    letterSpacing: -0.1,
    fontStyle: 'italic',
  },

  // Extras de hoje (lista visível)
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(236,121,53,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(236,121,53,0.28)',
  },
  extraItemName: { color: colors.textLight, fontSize: 14.5, fontWeight: '600', letterSpacing: -0.2 },
  extraItemKcal: { color: '#EC7935', fontSize: 12, marginTop: 3, fontFamily: font.numeric, fontWeight: '600', letterSpacing: 0.2 },
  extraRemove: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)',
  },
  extraRemoveTxt: { color: colors.danger, fontSize: 18, fontWeight: '700', marginTop: -2 },

  // Botão de abrir o food picker dentro do ExtraForm
  extraPickBtn: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  extraPickBtnTxt: { color: colors.green, fontSize: 14.5, fontWeight: '700', letterSpacing: -0.2 },
  extraPickBtnHint: { color: colors.textMuted, fontSize: 12, marginTop: 3, fontStyle: 'italic', letterSpacing: -0.1 },
});
