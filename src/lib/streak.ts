import { ConstancyLog } from '../store/useStore';

const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export function takenDays(log: ConstancyLog[]): Set<string> {
  const s = new Set<string>();
  log.filter((l) => l.taken).forEach((l) => s.add(dayKey(l.ts)));
  return s;
}

export function currentStreak(log: ConstancyLog[]): number {
  const days = takenDays(log);
  let streak = 0;
  const d = new Date();
  while (days.has(dayKey(d.getTime()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function bestStreak(log: ConstancyLog[]): number {
  const days = takenDays(log);
  if (!days.size) return 0;
  const sorted = [...days]
    .map((k) => {
      const [y, m, d] = k.split('-').map(Number);
      return new Date(y, m, d).getTime();
    })
    .sort((a, b) => a - b);
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i] - sorted[i - 1]) / 86400000;
    if (diff === 1) cur++;
    else cur = 1;
    best = Math.max(best, cur);
  }
  return best;
}

export function monthRate(log: ConstancyLog[], ref = new Date()): number {
  const days = takenDays(log);
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const today = ref.getDate();
  let hit = 0;
  for (let d = 1; d <= today; d++) {
    if (days.has(`${y}-${m}-${d}`)) hit++;
  }
  return Math.round((hit / today) * 100);
}

export function monthDays(log: ConstancyLog[], ref = new Date()) {
  const days = takenDays(log);
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const last = new Date(y, m + 1, 0).getDate();
  const today = ref.getDate();
  const arr: { day: number; taken: boolean; future: boolean; today: boolean }[] = [];
  for (let d = 1; d <= last; d++) {
    arr.push({
      day: d,
      taken: days.has(`${y}-${m}-${d}`),
      future: d > today,
      today: d === today,
    });
  }
  return arr;
}

export function weekBars(log: ConstancyLog[]) {
  const days = takenDays(log);
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const out: { label: string; value: number }[] = [];
  const base = new Date();
  const day = base.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setDate(base.getDate() + mondayOffset);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    out.push({ label: labels[i], value: days.has(key) ? 100 : d > base ? 0 : 0 });
  }
  return out;
}

export function monthName(ref = new Date()) {
  return ref.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
