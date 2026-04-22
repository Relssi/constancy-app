# Constancy App

App iOS + Android + Web (one codebase) seguindo o branding CONSTANCY by FOCULAB.

## Stack
- Expo 51 + Expo Router (file-based routing)
- React Native + React Native Web (roda no browser)
- Zustand + AsyncStorage (persistência cross-platform)
- Expo Notifications (intervenção em tempo real em mobile)

## Como rodar

```bash
cd "C:\Users\Joao Witor\Desktop\APP"
npm install

# Web (browser — mais rápido pra testar)
npm run web

# iOS (requer Mac ou Expo Go)
npm run ios

# Android
npm run android
```

Em dispositivo real: abra o Expo Go e escaneie o QR que aparece após `npm start`.

## Estrutura

```
app/                         → rotas (Expo Router)
  _layout.tsx                → guard de onboarding + tema dark
  index.tsx                  → Home (loop central: input→intervenção→resultado)
  onboarding/                → 3 perguntas (slot, hunger, goal)
  check-in.tsx               → 2 sliders (fome 1-5, controle baixo/médio/alto)
  intervention.tsx           → respiração guiada 3 ciclos
  reset.tsx                  → "ok, próxima refeição = novo começo"
  progress.tsx               → dashboard psicológico (controle %, compulsões, correlação)
  content.tsx                → conteúdo cirúrgico baseado no padrão
src/
  theme/tokens.ts            → cores, tipografia (navy/green/cream do site)
  components/                → Button, Card, Heading, Pill, Screen
  store/useStore.ts          → estado global persistido
  lib/personalization.ts     → engine: riskSlots, controlScore, correlação,
                               nextIntervention, dailyMicroActions, contentForUser
  lib/notifications.ts       → agendamento baseado no lossSlot do perfil
```

## Mapa requisitos → implementação

| Requisito do brief | Onde |
|---|---|
| 1. Onboarding inteligente (3 perguntas) | `app/onboarding/*` |
| 2. Check-ins ultra simples 2-3x/dia | `app/check-in.tsx` + notificações |
| 3. Intervenção em tempo real | `nextIntervention()` + `scheduleCheckInReminders()` |
| 4. Plano de ação diário (1-2 ações) | `dailyMicroActions()` no Home |
| 5. Dashboard psicológico (não peso) | `app/progress.tsx` |
| 6. Integração Constancy (tomou hoje + correlação) | Card Constancy no Home + `controlCorrelation()` |
| 7. Sistema de reset (sem punição) | `app/reset.tsx` + flag `failedToday` |
| 8. Conteúdo cirúrgico | `contentForUser()` filtra por padrão |
| 10. Loop de retenção diário | Home fecha input→intervenção→plano→progresso→Constancy |

## Branding

Tokens em `src/theme/tokens.ts`:
- Navy `#0B2545`, Navy Deep `#071833`
- Green `#22C55E` (accent principal)
- Cream `#F5F0E8` (seções claras)
- Serif italic (Georgia fallback — trocar por Playfair Display quando importar fontes)
- Sans bold uppercase pros headlines

Voz: "Continue o que você começou. Não com força de vontade. Com constância."
Tom: suporte, não julgamento. Sem promessa de milagre.
