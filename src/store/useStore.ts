import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TimeSlot = 'morning' | 'afternoon' | 'night';
export type HungerType = 'emotional' | 'physical' | 'mixed';
export type Goal = 'lose_weight' | 'appetite' | 'discipline';

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

export type Profile = {
  onboarded: boolean;
  tutorialSeen: boolean;
  lossSlot?: TimeSlot;
  hungerType?: HungerType;
  goal?: Goal;
  name?: string;
  bottleSize: number;
  bottleStartedAt: number;
};

export type Auth = { email: string; name: string } | null;

type UserBucket = {
  passwordHash: string;
  profile: Profile;
  checkIns: CheckIn[];
  constancyLog: ConstancyLog[];
  routineDone: Record<string, string[]>;
  failedToday: boolean;
};

export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: 'capsule', label: 'Tomar cápsulas', detail: '2 cápsulas com água', time: '07:23' },
  { id: 'breakfast', label: 'Café da manhã', detail: 'Seguiu o plano', time: '08:10' },
  { id: 'lunch', label: 'Almoço', detail: 'Confirmar ao comer', time: '12:00' },
  { id: 'dinner', label: 'Jantar', detail: 'Confirmar ao comer', time: '19:00' },
];

const DEFAULT_PROFILE: Profile = {
  onboarded: false,
  tutorialSeen: false,
  bottleSize: 60,
  bottleStartedAt: Date.now(),
};

type State = {
  auth: Auth;
  accounts: Record<string, UserBucket>;
  profile: Profile;
  checkIns: CheckIn[];
  constancyLog: ConstancyLog[];
  routineDone: Record<string, string[]>;
  failedToday: boolean;
  signUp: (email: string, name: string, password: string) => { ok: boolean; error?: string };
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  setProfile: (p: Partial<Profile>) => void;
  finishOnboarding: () => void;
  finishTutorial: () => void;
  addCheckIn: (c: Omit<CheckIn, 'id' | 'ts'>) => void;
  logConstancy: (taken: boolean) => void;
  toggleRoutine: (id: string) => void;
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
        const bucket: UserBucket = {
          passwordHash: hashPw(password),
          profile: { ...DEFAULT_PROFILE, name, bottleStartedAt: Date.now() },
          checkIns: [],
          constancyLog: [],
          routineDone: {},
          failedToday: false,
        };
        set({
          accounts: { ...s.accounts, [email]: bucket },
          auth: { email, name },
          profile: bucket.profile,
          checkIns: [],
          constancyLog: [],
          routineDone: {},
          failedToday: false,
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
          };
          set({
            accounts: { ...s.accounts, [email]: bucket },
            auth: null,
            profile: { ...DEFAULT_PROFILE },
            checkIns: [],
            constancyLog: [],
            routineDone: {},
            failedToday: false,
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
            { ...c, id: Math.random().toString(36).slice(2), ts: Date.now() },
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
      markFail: () => set({ failedToday: true }),
      clearFail: () => set({ failedToday: false }),
      reset: () =>
        set({
          profile: { ...DEFAULT_PROFILE, name: get().auth?.name, bottleStartedAt: Date.now() },
          checkIns: [],
          constancyLog: [],
          routineDone: {},
          failedToday: false,
        }),
    }),
    {
      name: 'constancy-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
