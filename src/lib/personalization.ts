import { CheckIn, ConstancyLog, Profile, TimeSlot } from '../store/useStore';

export function currentSlot(d = new Date()): TimeSlot {
  const h = d.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'night';
}

export function slotLabel(s: TimeSlot) {
  return s === 'morning' ? 'Manhã' : s === 'afternoon' ? 'Tarde' : 'Noite';
}

export function controlScore(checkIns: CheckIn[], days = 7): number {
  const cutoff = Date.now() - days * 86400000;
  const recent = checkIns.filter((c) => c.ts > cutoff);
  if (!recent.length) return 0;
  const high = recent.filter((c) => c.control === 'high').length;
  const med = recent.filter((c) => c.control === 'medium').length;
  return Math.round(((high + med * 0.5) / recent.length) * 100);
}

export function riskSlots(checkIns: CheckIn[]): TimeSlot[] {
  const buckets: Record<TimeSlot, { loss: number; total: number }> = {
    morning: { loss: 0, total: 0 },
    afternoon: { loss: 0, total: 0 },
    night: { loss: 0, total: 0 },
  };
  checkIns.forEach((c) => {
    buckets[c.slot].total++;
    if (c.control === 'low' || c.hunger >= 4) buckets[c.slot].loss++;
  });
  return (Object.keys(buckets) as TimeSlot[])
    .filter((s) => buckets[s].total > 0 && buckets[s].loss / buckets[s].total > 0.4)
    .sort((a, b) => buckets[b].loss - buckets[a].loss);
}

export function bingeEpisodes(checkIns: CheckIn[], days = 7) {
  const cutoff = Date.now() - days * 86400000;
  return checkIns.filter((c) => c.ts > cutoff && c.control === 'low').length;
}

export function avgHunger(checkIns: CheckIn[], days = 7) {
  const cutoff = Date.now() - days * 86400000;
  const r = checkIns.filter((c) => c.ts > cutoff);
  if (!r.length) return 0;
  return Math.round((r.reduce((s, c) => s + c.hunger, 0) / r.length) * 10) / 10;
}

export function daysActive(checkIns: CheckIn[], days = 7) {
  const cutoff = Date.now() - days * 86400000;
  const set = new Set(
    checkIns.filter((c) => c.ts > cutoff).map((c) => new Date(c.ts).toDateString())
  );
  return set.size;
}

export function constancyAdherence(log: ConstancyLog[], days = 7) {
  const cutoff = Date.now() - days * 86400000;
  const r = log.filter((l) => l.ts > cutoff);
  if (!r.length) return 0;
  return Math.round((r.filter((l) => l.taken).length / r.length) * 100);
}

export function controlCorrelation(checkIns: CheckIn[], log: ConstancyLog[]) {
  const dayOf = (ts: number) => new Date(ts).toDateString();
  const tookDays = new Set(log.filter((l) => l.taken).map((l) => dayOf(l.ts)));
  const score = (cs: CheckIn[]) => {
    if (!cs.length) return null;
    const pts = cs.reduce(
      (s, c) => s + (c.control === 'high' ? 100 : c.control === 'medium' ? 50 : 0),
      0
    );
    return Math.round(pts / cs.length);
  };
  const withC = score(checkIns.filter((c) => tookDays.has(dayOf(c.ts))));
  const withoutC = score(checkIns.filter((c) => !tookDays.has(dayOf(c.ts))));
  return { withC, withoutC };
}

export function nextIntervention(
  profile: Profile,
  checkIns: CheckIn[]
): { title: string; body: string; action: string } {
  const slot = currentSlot();
  const risks = riskSlots(checkIns);
  const isRisk = risks.includes(slot);

  if (isRisk) {
    return {
      title: 'Você costuma perder o controle agora.',
      body: 'Respira 10 segundos antes de decidir. A vontade passa — a decisão fica.',
      action: 'Respirar 10s',
    };
  }
  if (profile.hungerType === 'emotional') {
    return {
      title: 'Essa fome é de agora ou de algo mais?',
      body: 'Nomeia o que tá sentindo. Nomear tira o automatismo.',
      action: 'Responder agora',
    };
  }
  if (slot === 'afternoon') {
    return {
      title: 'Hora da queda da tarde.',
      body: 'Comer um pouco de proteína agora evita a vontade de doce daqui 2h.',
      action: 'Marcar feito',
    };
  }
  return {
    title: 'Como você está agora?',
    body: 'Responder 2 perguntas ajuda o aplicativo a te entender.',
    action: 'Responder agora',
  };
}

export function dailyMicroActions(profile: Profile): string[] {
  const base = [
    'Coma mais proteína no café da manhã',
    'Evite telas enquanto come hoje',
    'Beba água 15min antes da refeição',
    'Caminhe 5 min depois do almoço',
  ];
  if (profile.lossSlot === 'night') base.unshift('Corte doce depois das 20h hoje');
  if (profile.lossSlot === 'afternoon') base.unshift('Proteína no lanche da tarde');
  if (profile.hungerType === 'emotional') base.unshift('Antes de comer, pergunta: é fome ou é outra coisa?');
  return base.slice(0, 2);
}

export function contentForUser(profile: Profile, checkIns: CheckIn[]) {
  const items: { tag: string; title: string; body: string }[] = [];
  const emotional = profile.hungerType === 'emotional';
  const nightLoss = profile.lossSlot === 'night' || riskSlots(checkIns).includes('night');
  const impulsive = avgHunger(checkIns) >= 3.5;

  if (emotional)
    items.push({
      tag: 'ansiedade',
      title: 'Fome emocional não se vence com força',
      body: 'Se vence reconhecendo. Três respirações antes de abrir a geladeira.',
    });
  if (nightLoss)
    items.push({
      tag: 'fome noturna',
      title: 'À noite, o corpo pede descanso — não doce',
      body: 'Chá + luz baixa + tela desligada. O impulso some em 12 minutos.',
    });
  if (impulsive)
    items.push({
      tag: 'impulsividade',
      title: 'O impulso é a pergunta. A resposta é sua.',
      body: 'Entre sentir e agir existem 90 segundos. Use-os.',
    });
  if (!items.length)
    items.push({
      tag: 'constância',
      title: 'Constância é escolha diária',
      body: 'Não perfeita. Apenas repetida. Essa é a vantagem.',
    });
  return items;
}
