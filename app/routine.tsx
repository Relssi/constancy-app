import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { Card } from '../src/components/Card';
import { Eyebrow } from '../src/components/Eyebrow';
import { useStore, RoutineItem as RI } from '../src/store/useStore';
import { colors, font, radius } from '../src/theme/tokens';

export default function RoutineEditor() {
  const router = useRouter();
  const { routine, addRoutineItem, updateRoutineItem, removeRoutineItem, moveRoutineItem } = useStore();
  const [editing, setEditing] = useState<RI | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

      <View>
        <Eyebrow text="Minha Rotina" />
        <Text style={styles.title}>Monte a rotina{'\n'}do seu dia.</Text>
        <Text style={styles.sub}>
          Adicione ou mude as etapas. Use as setas pra colocar na ordem que você faz.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        {routine.map((r, i) => (
          <Card key={r.id} padding={14}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>{r.label}</Text>
                <Text style={styles.itemDetail}>{r.detail}</Text>
                <View style={styles.timePill}>
                  <Text style={styles.timeText}>{r.time}</Text>
                </View>
              </View>
              <View style={{ gap: 8, alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <IconBtn
                    label="↑"
                    disabled={i === 0}
                    onPress={() => moveRoutineItem(r.id, 'up')}
                  />
                  <IconBtn
                    label="↓"
                    disabled={i === routine.length - 1}
                    onPress={() => moveRoutineItem(r.id, 'down')}
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable onPress={() => setEditing(r)} style={styles.smallBtn}>
                    <Text style={styles.smallBtnText}>Editar</Text>
                  </Pressable>
                  <Pressable onPress={() => removeRoutineItem(r.id)} style={styles.smallBtnDanger}>
                    <Text style={styles.smallBtnDangerText}>Apagar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Button label="+ Adicionar etapa na rotina" variant="outline" onPress={() => setCreating(true)} />

      <Modal visible={creating || !!editing} transparent animationType="fade" onRequestClose={() => { setCreating(false); setEditing(null); }}>
        <RoutineForm
          initial={editing ?? undefined}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) updateRoutineItem(editing.id, data);
            else addRoutineItem(data);
            setCreating(false);
            setEditing(null);
          }}
        />
      </Modal>
    </Screen>
  );
}

function IconBtn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.iconBtn, disabled && { opacity: 0.3 }]}>
      <Text style={styles.iconBtnText}>{label}</Text>
    </Pressable>
  );
}

function RoutineForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: RI;
  onSave: (d: Omit<RI, 'id'>) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? '');
  const [detail, setDetail] = useState(initial?.detail ?? '');
  const [time, setTime] = useState(initial?.time ?? '');
  return (
    <View style={styles.modalBg}>
      <View style={styles.modalCard}>
        <Eyebrow text={initial ? 'Editar etapa' : 'Nova etapa'} />
        <Text style={styles.modalTitle}>{initial ? 'Editar' : 'Adicionar'}{'\n'}na rotina.</Text>
        <View style={{ gap: 16, marginTop: 16 }}>
          <TextField
            label="Nome da etapa"
            hint="Ex: Tomar cápsula, Café da manhã, Caminhada"
            value={label}
            onChangeText={setLabel}
            placeholder="Ex: Almoço"
          />
          <TextField
            label="Um detalhezinho"
            hint="Pode ser uma observação curta. Não precisa ser longo."
            value={detail}
            onChangeText={setDetail}
            placeholder="Ex: Beber água antes"
          />
          <TextField
            label="Horário"
            hint="Formato 00:00. Ex: 07:30"
            value={time}
            onChangeText={setTime}
            placeholder="07:30"
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
          <View style={{ flex: 1 }}>
            <Button label="Cancelar" variant="outline" onPress={onCancel} />
          </View>
          <View style={{ flex: 1.3 }}>
            <Button
              label="Salvar"
              disabled={!label || !time}
              onPress={() => onSave({ label: label.trim(), detail: detail.trim(), time: time.trim() })}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  title: {
    color: colors.textLight,
    fontSize: 36,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 42,
    marginTop: 8,
  },
  sub: { color: colors.textMuted, fontSize: 15, lineHeight: 24, marginTop: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  itemLabel: { color: colors.textLight, fontSize: 17, fontWeight: '700' },
  itemDetail: { color: colors.textMuted, fontSize: 14, marginTop: 3 },
  timePill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  timeText: { color: colors.green, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  iconBtnText: { color: colors.textLight, fontSize: 18, fontWeight: '900' },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  smallBtnText: { color: colors.textLight, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  smallBtnDanger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
  },
  smallBtnDangerText: { color: colors.danger, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
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
