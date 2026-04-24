import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TimeSlot = 'morning' | 'afternoon' | 'night';
export type HungerType = 'emotional' | 'physical' | 'mixed';
export type Goal = 'lose_weight' | 'appetite' | 'discipline';
export type Sex = 'male' | 'female';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active';

export type CheckIn = {
  id: string;
  ts: number;
  hunger: 1 | 2 | 3 | 4 | 5;
  control: 'low' | 'medium' | 'high';
  slot: TimeSlot;
};

export type ConstancyLog = { ts: number; taken: boolean };

export type RoutineItem = {
  id: string;
  label: string;
  detail: string;
  time: string;
};

export type Meal = {
  id: string;
  name: string;
  time: string;
  calories?: number;
  notes?: string;
  recurring?: boolean;
};

export type WeightEntry = { ts: number; kg: number };
export type ExtraEntry = { id: string; ts: number; name: string; calories: number };

export type Profile = {
  onboarded: boolean;
  tutorialSeen: boolean;
  lossSlot?: TimeSlot;
  hungerType?: HungerType;
  goal?: Goal;
  name?: string;
  bottleSize: number;
  bottleStartedAt: number;
  // Novo: dados pra calcular metabolismo
  sex?: Sex;
  age?: number;
  heightCm?: number;
  activity?: Activity;
  targetWeightKg?: number;
  calorieGoal?: number; // opcional, se não setar usa TDEE
};

export type Auth = { email: string; name: string } | null;

type UserBucket = {
  passwordHash: string;
  profile: Profile;
  checkIns: CheckIn[];
  constancyLog: ConstancyLog[];
  routineDone: Record<string, string[]>;
  failedToday: boolean;
  routine: RoutineItem[];
  meals: Meal[];
  weightLog: WeightEntry[];
  waterLog: Record<string, number>; // dateKey -> copos
  extrasLog: ExtraEntry[];
  mealDone: Record<string, string[]>; // dateKey -> meal ids feitos
};

export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: 'capsule', label: 'Tomar cápsulas', detail: '2 cápsulas com água', time: '07:00' },
  { id: 'breakfast', label: 'Café da manhã', detail: 'Seguir o plano', time: '08:00' },
  { id: 'lunch', label: 'Almoço', detail: 'Confirmar ao comer', time: '12:00' },
  { id: 'dinner', label: 'Jantar', detail: 'Confirmar ao comer', time: '19:00' },
];

const DEFAULT_PROFILE: Profile = {
  onboarded: false,
  tutorialSeen: false,
  bottleSize: 60,
  bottleStartedAt: Date.now(),
};

const uid = () => Math.random().toString(36).slice(2, 10);

type State = {
  auth: Auth;
  accounts: Record<string, UserBucket>;
  profile: Profile;
  checkIns: CheckIn[];
  constancyLog: ConstancyLog[];
  routineDone: Record<string, string[]>;
  failedToday: boolean;
  routine: RoutineItem[];
  meals: Meal[];
  weightLog: WeightEntry[];
  waterLog: Record<string, number>;
  extrasLog: ExtraEntry[];
  mealDone: Record<string, string[]>;
  signUp: (email: string, name: string, password: string) => { ok: boolean; error?: string };
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  setProfile: (p: Partial<Profile>) => void;
  finishOnboarding: () => void;
  finishTutorial: () => void;
  addCheckIn: (c: Omit<CheckIn, 'id' | 'ts'>) => void;
  logConstancy: (taken: boolean) => void;
  toggleRoutine: (id: string) => void;
  addRoutineItem: (r: Omit<RoutineItem, 'id'>) => void;
  updateRoutineItem: (id: string, r: Partial<Omit<RoutineItem, 'id'>>) => void;
  removeRoutineItem: (id: string) => void;
  moveRoutineItem: (id: string, direction: 'up' | 'down') => void;
  addMeal: (m: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, m: Partial<Omit<Meal, 'id'>>) => void;
  removeMeal: (id: string) => void;
  toggleMealDone: (id: string) => void;
  addWeight: (kg: number) => void;
  removeWeight: (ts: number) => void;
  addWater: (delta: number) => void;
  addExtra: (name: string, calories: number) => void;
  removeExtra: (id: string) => void;
  markFail: () => void;
  clearFail: () => void;
  reset: () => void;
};

const todayKey = () => new Date().toDateString();

// Simple hash — suficiente pra prototipo local (NÃO usar em produção sem backend real)
function hashPw(pw: string): string {
  let h = 5381;
  const salt = 'constancy-foculab-2025';
  const s = salt + pw + salt;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

const normEmail = (e: string) => e.trim().toLowerCase();

function freshBucket(name: string, password: string): UserBucket {
  return {
    passwordHash: hashPw(password),
    profile: { ...DEFAULT_PROFILE, name, bottleStartedAt: Date.now() },
    checkIns: [],
    constancyLog: [],
    routineDone: {},
    failedToday: false,
    routine: DEFAULT_ROUTINE.map((r) => ({ ...r })),
    meals: [],
    weightLog: [],
    waterLog: {},
    extrasLog: [],
    mealDone: {},
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      auth: null,
      accounts: {},
      profile: { ...DEFAULT_PROFILE },
      checkIns: [],
      constancyLog: [],
      routineDone: {},
      failedToday: false,
      routine: DEFAULT_ROUTINE.map((r) => ({ ...r })),
      meals: [],
      weightLog: [],
      waterLog: {},
      extrasLog: [],
      mealDone: {},

      signUp: (emailRaw, nameRaw, password) => {
        const email = normEmail(emailRaw);
        const name = nameRaw.trim();
        if (!email.includes('@') || email.length < 5)
          return { ok: false, error: 'Digite um e-mail válido.' };
        if (password.length < 4)
          return { ok: false, error: 'A senha precisa ter pelo menos 4 letras ou números.' };
        if (!name) return { ok: false, error: 'Digite seu nome.' };
        const s = get();
        if (s.accounts[email]) return { ok: false, error: 'Esse e-mail já tem conta. Entre com a senha.' };
        const bucket = freshBucket(name, password);
        set({
          accounts: { ...s.accounts, [email]: bucket },
          auth: { email, name },
          profile: bucket.profile,
          checkIns: bucket.checkIns,
          constancyLog: bucket.constancyLog,
          routineDone: bucket.routineDone,
          failedToday: bucket.failedToday,
          routine: bucket.routine,
          meals: bucket.meals,
          weightLog: bucket.weightLog,
          waterLog: bucket.waterLog,
          extrasLog: bucket.extrasLog,
          mealDone: bucket.mealDone,
        });
        return { ok: true };
      },

      signIn: (emailRaw, password) => {
        const email = normEmail(emailRaw);
        const s = get();
        const acc = s.accounts[email];
        if (!acc) return { ok: false, error: 'Não encontramos uma conta com esse e-mail.' };
        if (acc.passwordHash !== hashPw(password))
          return { ok: false, error: 'Senha incorreta. Tente de novo.' };
        set({
          auth: { email, name: acc.profile.name || email.split('@')[0] },
          profile: acc.profile,
          checkIns: acc.checkIns,
          constancyLog: acc.constancyLog,
          routineDone: acc.routineDone,
          failedToday: acc.failedToday,
          routine: acc.routine?.length ? acc.routine : DEFAULT_ROUTINE.map((r) => ({ ...r })),
          meals: acc.meals ?? [],
          weightLog: acc.weightLog ?? [],
          waterLog: acc.waterLog ?? {},
          extrasLog: acc.extrasLog ?? [],
          mealDone: acc.mealDone ?? {},
        });
        return { ok: true };
      },

      signOut: () => {
        const s = get();
        if (s.auth) {
          const email = s.auth.email;
          const bucket: UserBucket = {
            passwordHash: s.accounts[email]?.passwordHash ?? '',
            profile: s.profile,
            checkIns: s.checkIns,
            constancyLog: s.constancyLog,
            routineDone: s.routineDone,
            failedToday: s.failedToday,
            routine: s.routine,
            meals: s.meals,
            weightLog: s.weightLog,
            waterLog: s.waterLog,
            extrasLog: s.extrasLog,
            mealDone: s.mealDone,
          };
          set({
            accounts: { ...s.accounts, [email]: bucket },
            auth: null,
            profile: { ...DEFAULT_PROFILE },
            checkIns: [],
            constancyLog: [],
            routineDone: {},
            failedToday: false,
            routine: DEFAULT_ROUTINE.map((r) => ({ ...r })),
            meals: [],
            weightLog: [],
            waterLog: {},
            extrasLog: [],
            mealDone: {},
          });
        }
      },

      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      finishOnboarding: () => set((s) => ({ profile: { ...s.profile, onboarded: true } })),
      finishTutorial: () => set((s) => ({ profile: { ...s.profile, tutorialSeen: true } })),
      addCheckIn: (c) =>
        set((s) => ({
          checkIns: [
            ...s.checkIns,
            { ...c, id: uid(), ts: Date.now() },
          ],
        })),
      logConstancy: (taken) =>
        set((s) => ({ constancyLog: [...s.constancyLog, { ts: Date.now(), taken }] })),
      toggleRoutine: (id) =>
        set((s) => {
          const key = todayKey();
          const list = s.routineDone[key] ?? [];
          const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
          return { routineDone: { ...s.routineDone, [key]: next } };
        }),
      addRoutineItem: (r) =>
        set((s) => ({ routine: [...s.routine, { ...r, id: uid() }] })),
      updateRoutineItem: (id, r) =>
        set((s) => ({ routine: s.routine.map((x) => (x.id === id ? { ...x, ...r } : x)) })),
      removeRoutineItem: (id) =>
        set((s) => ({ routine: s.routine.filter((x) => x.id !== id) })),
      moveRoutineItem: (id, direction) =>
        set((s) => {
          const idx = s.routine.findIndex((x) => x.id === id);
          if (idx < 0) return {};
          const swap = direction === 'up' ? idx - 1 : idx + 1;
          if (swap < 0 || swap >= s.routine.length) return {};
          const next = [...s.routine];
          [next[idx], next[swap]] = [next[swap], next[idx]];
          return { routine: next };
        }),
      addMeal: (m) => set((s) => ({ meals: [...s.meals, { ...m, id: uid() }] })),
      updateMeal: (id, m) =>
        set((s) => ({ meals: s.meals.map((x) => (x.id === id ? { ...x, ...m } : x)) })),
      removeMeal: (id) => set((s) => ({ meals: s.meals.filter((x) => x.id !== id) })),
      toggleMealDone: (id) =>
        set((s) => {
          const key = todayKey();
          const list = s.mealDone[key] ?? [];
          const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
          return { mealDone: { ...s.mealDone, [key]: next } };
        }),
      addWeight: (kg) =>
        set((s) => ({ weightLog: [...s.weightLog, { ts: Date.now(), kg }] })),
      removeWeight: (ts) =>
        set((s) => ({ weightLog: s.weightLog.filter((x) => x.ts !== ts) })),
      addWater: (delta) =>
        set((s) => {
          const key = todayKey();
          const cur = s.waterLog[key] ?? 0;
          const next = Math.max(0, cur + delta);
          return { waterLog: { ...s.waterLog, [key]: next } };
        }),
      addExtra: (name, calories) =>
        set((s) => ({
          extrasLog: [...s.extrasLog, { id: uid(), ts: Date.now(), name, calories }],
        })),
      removeExtra: (id) =>
        set((s) => ({ extrasLog: s.extrasLog.filter((x) => x.id !== id) })),
      markFail: () => set({ failedToday: true }),
      clearFail: () => set({ failedToday: false }),
      reset: () =>
        set({
          profile: { ...DEFAULT_PROFILE, name: get().auth?.name, bottleStartedAt: Date.now() },
          checkIns: [],
          constancyLog: [],
          routineDone: {},
          failedToday: false,
          routine: DEFAULT_ROUTINE.map((r) => ({ ...r })),
          meals: [],
          weightLog: [],
          waterLog: {},
          extrasLog: [],
          mealDone: {},
        }),
    }),
    {
      name: 'constancy-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 3,
      migrate: (persisted: any, version) => {
        if (!persisted) return persisted;
        if (version < 2) {
          persisted.routine = persisted.routine?.length ? persisted.routine : DEFAULT_ROUTINE.map((r) => ({ ...r }));
          persisted.meals = persisted.meals ?? [];
          if (persisted.accounts) {
            for (const email of Object.keys(persisted.accounts)) {
              const acc = persisted.accounts[email];
              if (!acc.routine?.length) acc.routine = DEFAULT_ROUTINE.map((r) => ({ ...r }));
              if (!acc.meals) acc.meals = [];
            }
          }
        }
        if (version < 3) {
          persisted.weightLog = persisted.weightLog ?? [];
          persisted.waterLog = persisted.waterLog ?? {};
          persisted.extrasLog = persisted.extrasLog ?? [];
          persisted.mealDone = persisted.mealDone ?? {};
          if (persisted.accounts) {
            for (const email of Object.keys(persisted.accounts)) {
              const acc = persisted.accounts[email];
              acc.weightLog = acc.weightLog ?? [];
              acc.waterLog = acc.waterLog ?? {};
              acc.extrasLog = acc.extrasLog ?? [];
              acc.mealDone = acc.mealDone ?? {};
            }
          }
        }
        return persisted;
      },
    }
  )
);
