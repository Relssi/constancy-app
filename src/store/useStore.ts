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

export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: 'capsule', label: 'Tomar cápsulas', detail: '2 cápsulas com água', time: '07:23' },
  { id: 'breakfast', label: 'Café da manhã', detail: 'Seguiu o plano', time: '08:10' },
  { id: 'lunch', label: 'Almoço', detail: 'Confirmar ao comer', time: '12:00' },
  { id: 'dinner', label: 'Jantar', detail: 'Confirmar ao comer', time: '19:00' },
];

type State = {
  profile: Profile;
  checkIns: CheckIn[];
  constancyLog: ConstancyLog[];
  routineDone: Record<string, string[]>;
  failedToday: boolean;
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

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: { onboarded: false, tutorialSeen: false, bottleSize: 60, bottleStartedAt: Date.now() },
      checkIns: [],
      constancyLog: [],
      routineDone: {},
      failedToday: false,
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
          profile: { onboarded: false, tutorialSeen: false, bottleSize: 60, bottleStartedAt: Date.now() },
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
