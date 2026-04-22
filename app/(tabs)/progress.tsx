import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Calendar } from '../../src/components/Calendar';
import { Bars } from '../../src/components/Bars';
import { useStore } from '../../src/store/useStore';
import {
  currentStreak,
  bestStreak,
  monthRate,
  monthDays,
  weekBars,
  monthName,
} from '../../src/lib/streak';
import { colors, font } from '../../src/theme/tokens';

export default function ProgressScreen() {
  const { constancyLog } = useStore();
  const streak = currentStreak(constancyLog);
  const best = bestStreak(constancyLog);
  const rate = monthRate(constancyLog);
  const days = monthDays(constancyLog);
  const bars = weekBars(constancyLog);

  const insight =
    streak >= 6
      ? `Você manteve a rotina em ${streak} de 7 dias — mesmo nos dias pesados. Isso é o CONSTANCY funcionando.`
      : streak >= 3
      ? `${streak} dias seguidos. O hábito tá virando padrão — não decisão.`
      : 'Registre os próximos dias. Precisamos de 3+ pra começar a ver seu padrão real.';

  return (
    <Screen>
      <Text style={styles.eyebrow}>MARÇO · DADOS REAIS</Text>
      <Text style={styles.title}>Seu progresso</Text>
      <Text style={styles.sub}>{cap(monthName())}</Text>

      <Card>
        <Calendar days={days} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="SEQUÊNCIA ATUAL" value={streak} unit="d" />
        <Stat label="TAXA DO MÊS" value={rate} unit="%" />
        <Stat label="RECORDE" value={best} unit="d" />
      </View>

      <Card variant="accent">
        <Text style={styles.insightLabel}>✦ INSIGHT DA SEMANA</Text>
        <Text style={styles.insight}>{insight}</Text>
      </Card>

      <View>
        <Text style={styles.sectionLabel}>CONSISTÊNCIA POR DIA</Text>
        <Card>
          <Bars data={bars} />
        </Card>
      </View>

      <Text style={styles.quote}>
        "Constância é uma escolha diária. E escolhas diárias precisam de suporte."
      </Text>
    </Screen>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <Card style={{ flex: 1, alignItems: 'flex-start' }}>
      <Text style={styles.statVal}>
        {value}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.green, fontSize: 10, letterSpacing: 2, fontWeight: '800' },
  title: {
    color: colors.textLight,
    fontSize: 32,
    fontFamily: font.serif,
    fontStyle: 'italic',
    marginTop: 6,
  },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 2, marginBottom: 8 },
  statVal: { color: colors.textLight, fontSize: 32, fontWeight: '900' },
  statUnit: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 4,
  },
  insightLabel: { color: colors.green, fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  insight: {
    color: colors.textLight,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    fontFamily: font.serif,
    fontStyle: 'italic',
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  quote: {
    color: colors.textMuted,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});
