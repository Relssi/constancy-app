import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useState, useMemo } from 'react';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { useStore, Meal } from '../../src/store/useStore';
import { colors, font, radius } from '../../src/theme/tokens';

export default function Meals() {
  const { meals, addMeal, updateMeal, removeMeal } = useStore();
  const [editing, setEditing] = useState<Meal | null>(null);
  const [creating, setCreating] = useState(false);

  const sorted = useMemo(() => [...meals].sort((a, b) => a.time.localeCompare(b.time)), [meals]);
  const totalCals = sorted.reduce((s, m) => s + (m.calories ?? 0), 0);
  const withCals = sorted.filter((m) => m.calories && m.calories > 0).length;

  return (
    <Screen>
      <View>
        <Eyebrow text="Minha Alimentação" />
        <Text style={styles.title}>O que eu{'\n'}vou comer hoje.</Text>
        <Text style={styles.sub}>
          Anote as refeições do seu dia. Os horários e o que vai comer. Calorias só se você quiser.
        </Text>
      </View>

      {sorted.length > 0 && (
        <Card padding={18}>
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statVal}>{sorted.length}</Text>
              <Text style={styles.statLabel}>refeições{'\n'}planejadas</Text>
            </View>
            <View style={styles.vdiv} />
            <View style={{ flex: 1 }}>
              <Text style={styles.statVal}>{totalCals > 0 ? totalCals : '—'}</Text>
              <Text style={styles.statLabel}>calorias{'\n'}no total do dia</Text>
            </View>
          </View>
          {withCals > 0 && withCals < sorted.length && (
            <Text style={styles.statHint}>
              {sorted.length - withCals} refeição(ões) sem calorias. Pode preencher depois se quiser.
            </Text>
          )}
        </Card>
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
          {sorted.map((m) => (
            <Card key={m.id} padding={16}>
              <View style={styles.mealRow}>
                <View style={styles.timeCol}>
                  <Text style={styles.timeTxt}>{m.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mealName}>{m.name}</Text>
                  {m.notes ? <Text style={styles.mealNotes}>{m.notes}</Text> : null}
                  {m.calories ? (
                    <View style={styles.calPill}>
                      <Text style={styles.calText}>{m.calories} kcal</Text>
                    </View>
                  ) : null}
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
          ))}
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

  return (
    <View style={styles.modalBg}>
      <View style={styles.modalCard}>
        <Eyebrow text={initial ? 'Editar refeição' : 'Nova refeição'} />
        <Text style={styles.modalTitle}>
          {initial ? 'Editar' : 'O que vai'}
          {'\n'}
          {initial ? 'refeição.' : 'comer?'}
        </Text>
        <View style={{ gap: 16, marginTop: 16 }}>
          <TextField
            label="O que você vai comer"
            hint="Ex: Arroz, feijão, frango grelhado e salada"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Almoço"
          />
          <TextField
            label="Horário"
            hint="Formato 00:00. Ex: 12:30"
            value={time}
            onChangeText={setTime}
            placeholder="12:30"
            keyboardType="numeric"
          />
          <TextField
            label="Calorias (opcional)"
            hint="Se não souber, pode deixar em branco. Não precisa."
            value={calories}
            onChangeText={(v) => setCalories(v.replace(/[^0-9]/g, ''))}
            placeholder="Ex: 450"
            keyboardType="numeric"
          />
          <TextField
            label="Observação (opcional)"
            hint="Algum detalhe que queira lembrar."
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Com pouco sal"
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
          <View style={{ flex: 1 }}>
            <Button label="Cancelar" variant="outline" onPress={onCancel} />
          </View>
          <View style={{ flex: 1.3 }}>
            <Button
              label="Salvar"
              disabled={!name || !time}
              onPress={() =>
                onSave({
                  name: name.trim(),
                  time: time.trim(),
                  calories: calories ? Number(calories) : undefined,
                  notes: notes.trim() || undefined,
                })
              }
            />
          </View>
        </View>
      </View>
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
    marginTop: 10,
    letterSpacing: -0.5,
  },
  sub: { color: colors.textMuted, fontSize: 15, lineHeight: 24, marginTop: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  vdiv: { width: 1, alignSelf: 'stretch', backgroundColor: colors.navyBorder, marginHorizontal: 14 },
  statVal: { color: colors.textLight, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  statLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4, lineHeight: 16 },
  statHint: { color: colors.textDim, fontSize: 12, marginTop: 14, fontStyle: 'italic', lineHeight: 18 },
  emptyTitle: { color: colors.textLight, fontSize: 22, fontFamily: font.serif, fontStyle: 'italic' },
  emptySub: { color: colors.textMuted, fontSize: 15, lineHeight: 24, marginTop: 10 },
  mealRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  timeCol: {
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    alignItems: 'center',
  },
  timeTxt: { color: colors.green, fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  mealName: { color: colors.textLight, fontSize: 17, fontWeight: '700' },
  mealNotes: { color: colors.textMuted, fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  calPill: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  calText: { color: colors.textLight, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  smallBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  smallBtnText: { color: colors.textLight, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  smallBtnDanger: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
  },
  smallBtnDangerText: { color: colors.danger, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
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
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.navyBorderHi,
    padding: 24,
  },
  modalTitle: {
    color: colors.textLight,
    fontSize: 28,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 34,
    marginTop: 6,
  },
});
