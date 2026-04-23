import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
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
      <View>
        <Eyebrow text={`${cap(monthName())} · Dados Reais`} />
        <Text style={styles.title}>Seu progresso</Text>
        <Text style={styles.sub}>Sem vaidade. Sem peso. Só o que importa.</Text>
      </View>

      <Card padding={22}>
        <Calendar days={days} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Sequência" value={streak} unit="d" highlight />
        <Stat label="Taxa do mês" value={rate} unit="%" />
        <Stat label="Recorde" value={best} unit="d" />
      </View>

      <Card variant="accent">
        <View style={styles.insightHead}>
          <Text style={styles.insightSpark}>✦</Text>
          <Text style={styles.insightLabel}>INSIGHT DA SEMANA</Text>
        </View>
        <Text style={styles.insight}>{insight}</Text>
      </Card>

      <View>
        <Eyebrow text="Consistência por dia" />
        <View style={{ marginTop: 12 }}>
          <Card>
            <Bars data={bars} />
          </Card>
        </View>
      </View>

      <View style={styles.quoteWrap}>
        <View style={styles.quoteLine} />
        <Text style={styles.quote}>
          "Constância é uma escolha diária.{'\n'}E escolhas diárias precisam de suporte."
        </Text>
      </View>
    </Screen>
  );
}

function Stat({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <Card variant={highlight ? 'accent' : 'dark'} style={{ flex: 1, alignItems: 'flex-start' }} padding={16}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.statVal, highlight && { color: colors.green }]}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </Card>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  title: {
    color: colors.textLight,
    fontSize: 38,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 6, lineHeight: 20 },
  statVal: { color: colors.textLight, fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  statUnit: { color: colors.textMuted, fontSize: 13, fontWeight: '800', marginLeft: 2 },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: '800',
    marginTop: 6,
  },
  insightHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightSpark: { color: colors.green, fontSize: 14 },
  insightLabel: { color: colors.green, fontSize: 11, letterSpacing: 2.5, fontWeight: '800' },
  insight: {
    color: colors.textLight,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    fontFamily: font.serif,
    fontStyle: 'italic',
  },
  quoteWrap: { alignItems: 'center', marginTop: 8, gap: 12 },
  quoteLine: { width: 30, height: 1.5, backgroundColor: colors.green },
  quote: {
    color: colors.textMuted,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
});
