import { Profile, Activity, Sex, WeightEntry, ExtraEntry, Meal } from '../store/useStore';
import { getFood, kcalFor } from './foods';

/** kcal de uma refeição: se tem items, soma do banco; senão usa o campo calories. */
export function mealKcal(m: Meal): number {
  if (m.items && m.items.length) {
    return m.items.reduce((s, it) => {
      const f = getFood(it.foodId);
      return f ? s + kcalFor(f, it.grams) : s;
    }, 0);
  }
  return m.calories ?? 0;
}

// Mifflin-St Jeor
export function bmr(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export function tdee(sex: Sex, weightKg: number, heightCm: number, age: number, activity: Activity): number {
  return Math.round(bmr(sex, weightKg, heightCm, age) * ACTIVITY_FACTOR[activity]);
}

export function activityLabel(a: Activity): string {
  switch (a) {
    case 'sedentary': return 'Fico mais parado';
    case 'light': return 'Ando um pouco';
    case 'moderate': return 'Me mexo bastante';
    case 'active': return 'Sou bem ativo';
  }
}

export function latestWeight(log: WeightEntry[]): number | null {
  if (!log.length) return null;
  return [...log].sort((a, b) => b.ts - a.ts)[0].kg;
}

/** Calcula TDEE usando o último peso registrado (ou nada se faltar info). */
export function userTDEE(profile: Profile, weightLog: WeightEntry[]): number | null {
  const { sex, age, heightCm, activity } = profile;
  const kg = latestWeight(weightLog);
  if (!sex || !age || !heightCm || !activity || !kg) return null;
  return tdee(sex, kg, heightCm, age, activity);
}

/** Caloria alvo diária: usa calorieGoal se tiver, senão TDEE, senão null. */
export function calorieTarget(profile: Profile, weightLog: WeightEntry[]): number | null {
  if (profile.calorieGoal && profile.calorieGoal > 0) return profile.calorieGoal;
  return userTDEE(profile, weightLog);
}

const dayKey = (d: Date | number) => new Date(d).toDateString();

/** Soma de calorias consumidas HOJE (refeições marcadas como feitas + extras de hoje). */
export function caloriesToday(
  meals: Meal[],
  mealDone: Record<string, string[]>,
  extras: ExtraEntry[]
): number {
  const key = dayKey(Date.now());
  const doneIds = new Set(mealDone[key] ?? []);
  const mealsKcal = meals
    .filter((m) => doneIds.has(m.id))
    .reduce((s, m) => s + mealKcal(m), 0);
  const extrasKcal = extras
    .filter((e) => dayKey(e.ts) === key)
    .reduce((s, e) => s + e.calories, 0);
  return mealsKcal + extrasKcal;
}

/** Peso atual − peso há 7 dias (aproximado pelo registro mais próximo do dia 7). */
export function weeklyWeightDelta(log: WeightEntry[]): number | null {
  if (log.length < 2) return null;
  const sorted = [...log].sort((a, b) => a.ts - b.ts);
  const latest = sorted[sorted.length - 1];
  const target = latest.ts - 7 * 24 * 60 * 60 * 1000;
  // encontra o registro mais próximo do target (mas antes do latest)
  let closest: WeightEntry | null = null;
  let bestDiff = Infinity;
  for (const e of sorted) {
    if (e.ts >= latest.ts) break;
    const diff = Math.abs(e.ts - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      closest = e;
    }
  }
  if (!closest) return null;
  return +(latest.kg - closest.kg).toFixed(1);
}

/** Média de kcal dos últimos N dias (só dias com registro). */
export function weeklyAvgCalories(
  meals: Meal[],
  mealDone: Record<string, string[]>,
  extras: ExtraEntry[],
  days = 7
): number | null {
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  const totals: Record<string, number> = {};
  // refeições feitas nos últimos N dias
  for (const [key, ids] of Object.entries(mealDone)) {
    const d = new Date(key).getTime();
    if (d < cutoff) continue;
    const kcal = ids
      .map((id) => meals.find((m) => m.id === id))
      .filter(Boolean)
      .reduce((s, m) => s + mealKcal(m!), 0);
    totals[key] = (totals[key] ?? 0) + kcal;
  }
  for (const e of extras) {
    if (e.ts < cutoff) continue;
    const key = dayKey(e.ts);
    totals[key] = (totals[key] ?? 0) + e.calories;
  }
  const vals = Object.values(totals).filter((v) => v > 0);
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
