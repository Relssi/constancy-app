import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { searchFoods, Food, kcalFor } from '../lib/foods';
import { Button } from './Button';
import { colors, font, radius } from '../theme/tokens';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onPick: (food: Food, grams: number) => void;
  /** valor inicial da busca (opcional) */
  initialQuery?: string;
};

export function FoodPicker({ visible, onCancel, onPick, initialQuery = '' }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [picked, setPicked] = useState<Food | null>(null);
  const [grams, setGrams] = useState('100');

  const results = useMemo(() => searchFoods(q, 60), [q]);

  function reset() {
    setQ('');
    setPicked(null);
    setGrams('100');
  }

  function handleCancel() {
    reset();
    onCancel();
  }

  function handleConfirm() {
    if (!picked) return;
    const g = Math.max(1, parseInt(grams, 10) || 0);
    onPick(picked, g);
    reset();
  }

  const gramsNum = Math.max(0, parseInt(grams, 10) || 0);
  const computed = picked ? kcalFor(picked, gramsNum) : 0;

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.bg}
      pointerEvents="auto"
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
      <View style={styles.card} pointerEvents="box-none">
          <Text style={styles.eyebrow}>BANCO DE ALIMENTOS</Text>
          <Text style={styles.title}>
            {picked ? 'Quanto\ncomeu?' : 'Procurar\nalimento.'}
          </Text>

          {!picked ? (
            <>
              <View style={styles.searchWrap}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  value={q}
                  onChangeText={setQ}
                  placeholder="Ex: arroz, frango, banana…"
                  placeholderTextColor={colors.textDim}
                  style={styles.search}
                  autoFocus
                />
                {q.length > 0 && (
                  <Pressable onPress={() => setQ('')} style={styles.searchClear}>
                    <Text style={styles.searchClearTxt}>×</Text>
                  </Pressable>
                )}
              </View>
              <Text style={styles.hint}>
                Valores por 100g. Depois você digita o peso do que comeu.
              </Text>
              <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
                {results.length === 0 ? (
                  <Text style={styles.empty}>
                    Não achei esse alimento. Tenta outro nome ou volta e digite manualmente.
                  </Text>
                ) : (
                  results.map((f) => (
                    <Pressable
                      key={f.id}
                      onPress={() => setPicked(f)}
                      style={styles.row}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowName} numberOfLines={2}>{f.name}</Text>
                        <Text style={styles.rowMacros}>
                          P {f.protein}g  ·  C {f.carb}g  ·  G {f.fat}g
                        </Text>
                      </View>
                      <View style={styles.kcalPill}>
                        <Text style={styles.kcalPillTxt}>{f.kcal}</Text>
                        <Text style={styles.kcalPillUnit}>kcal/100g</Text>
                      </View>
                    </Pressable>
                  ))
                )}
              </ScrollView>
              <View style={{ marginTop: 14 }}>
                <Button label="Cancelar" variant="outline" onPress={handleCancel} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.pickedCard}>
                <Text style={styles.pickedName}>{picked.name}</Text>
                <Text style={styles.pickedBase}>{picked.kcal} kcal por 100g</Text>
              </View>

              <Text style={styles.label}>Peso que comeu (em gramas)</Text>
              <TextInput
                value={grams}
                onChangeText={(v) => setGrams(v.replace(/[^0-9]/g, '').slice(0, 4))}
                placeholder="Ex: 150"
                placeholderTextColor={colors.textDim}
                keyboardType="numeric"
                style={styles.gramsInput}
              />
              <Text style={styles.hint2}>
                Uma colher de sopa ≈ 20g  ·  uma xícara ≈ 200g  ·  uma fatia de pão ≈ 25g
              </Text>

              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>DÁ</Text>
                <Text style={styles.resultKcal}>{computed} kcal</Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                <View style={{ flex: 1 }}>
                  <Button label="Voltar" variant="outline" onPress={() => setPicked(null)} />
                </View>
                <View style={{ flex: 1.3 }}>
                  <Button
                    label="Adicionar"
                    disabled={gramsNum <= 0}
                    onPress={handleConfirm}
                  />
                </View>
              </View>
            </>
          )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,14,31,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    zIndex: 999,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.navyBorderHi,
    padding: 20,
  },
  eyebrow: {
    color: colors.textDim,
    fontSize: 10.5,
    letterSpacing: 2.2,
    fontWeight: '700',
    fontFamily: font.numeric,
  },
  title: {
    color: colors.textLight,
    fontSize: 28,
    fontFamily: font.serif,
    fontStyle: 'italic',
    lineHeight: 34,
    marginTop: 8,
    letterSpacing: -0.7,
  },
  searchWrap: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
    borderRadius: radius.md,
    paddingHorizontal: 12,
  },
  searchIcon: {
    color: colors.textDim,
    fontSize: 18,
    marginRight: 8,
  },
  search: {
    flex: 1,
    color: colors.textLight,
    fontSize: 16,
    paddingVertical: 12,
    letterSpacing: -0.2,
  },
  searchClear: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  searchClearTxt: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '600',
    marginTop: -2,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 8,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.navyBorder,
  },
  rowName: {
    color: colors.textLight,
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  rowMacros: {
    color: colors.textMuted,
    fontSize: 11.5,
    marginTop: 3,
    fontFamily: font.numeric,
    letterSpacing: 0.2,
  },
  kcalPill: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    minWidth: 70,
  },
  kcalPillTxt: {
    color: colors.green,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: font.numeric,
    letterSpacing: -0.3,
  },
  kcalPillUnit: {
    color: colors.green,
    fontSize: 9,
    fontFamily: font.numeric,
    letterSpacing: 0.3,
    marginTop: 1,
    opacity: 0.8,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    padding: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
  pickedCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  pickedName: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  pickedBase: {
    color: colors.green,
    fontSize: 12.5,
    marginTop: 4,
    fontFamily: font.numeric,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  label: {
    color: colors.textLight,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginTop: 16,
  },
  gramsInput: {
    marginTop: 8,
    color: colors.textLight,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: font.numeric,
    letterSpacing: -0.6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.navyBorder,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  hint2: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
  resultBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.4)',
    alignItems: 'center',
  },
  resultLabel: {
    color: colors.green,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    fontFamily: font.numeric,
  },
  resultKcal: {
    color: colors.green,
    fontSize: 36,
    fontWeight: '700',
    fontFamily: font.numeric,
    letterSpacing: -1,
    marginTop: 4,
  },
});
