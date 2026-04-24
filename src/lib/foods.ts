import foodsData from '../data/foods.json';

export type Food = {
  /** índice no array (id estável enquanto o JSON não mudar de ordem) */
  id: number;
  /** nome original */
  name: string;
  /** kcal por 100g */
  kcal: number;
  /** proteína por 100g */
  protein: number;
  /** lipídeos por 100g */
  fat: number;
  /** carboidrato por 100g */
  carb: number;
};

type Raw = { n: string; k: number; p: number; f: number; c: number };

export const FOODS: Food[] = (foodsData as Raw[]).map((r, i) => ({
  id: i,
  name: r.n,
  kcal: r.k,
  protein: r.p,
  fat: r.f,
  carb: r.c,
}));

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const NORM_INDEX: string[] = FOODS.map((f) => normalize(f.name));

/** Busca alimentos por termo. Retorna até `limit` itens. */
export function searchFoods(term: string, limit = 40): Food[] {
  const q = normalize(term);
  if (!q) return FOODS.slice(0, limit);
  const tokens = q.split(' ').filter(Boolean);
  const scored: { f: Food; score: number }[] = [];
  for (let i = 0; i < FOODS.length; i++) {
    const n = NORM_INDEX[i];
    let score = 0;
    let all = true;
    for (const t of tokens) {
      const idx = n.indexOf(t);
      if (idx < 0) {
        all = false;
        break;
      }
      // tokens que aparecem no começo pontuam mais
      score += idx === 0 ? 10 : idx < 8 ? 4 : 1;
      // token exato no início do nome vale muito
      if (n.startsWith(t)) score += 6;
    }
    if (all) scored.push({ f: FOODS[i], score });
  }
  scored.sort((a, b) => b.score - a.score || a.f.name.localeCompare(b.f.name));
  return scored.slice(0, limit).map((x) => x.f);
}

export function getFood(id: number): Food | undefined {
  return FOODS[id];
}

/** kcal consumidas para `grams` gramas desse alimento. */
export function kcalFor(food: Food, grams: number): number {
  if (!grams || grams <= 0) return 0;
  return Math.round((food.kcal * grams) / 100);
}
