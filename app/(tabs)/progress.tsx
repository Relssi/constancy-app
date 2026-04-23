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
      ? `Você manteve a rotina em ${streak} dos últimos 7 dias. Isso é ótimo. Continue.`
      : streak >= 3
      ? `${streak} dias seguidos. Você tá pegando o ritmo.`
      : 'Marque os próximos dias. Em 3 dias eu já consigo te mostrar como você tá indo.';

  return (
    <Screen>
      <View>
        <Eyebrow text={cap(monthName())} />
        <Text style={styles.title}>Seu progresso</Text>
        <Text style={styles.sub}>Veja como você tá indo este mês.</Text>
      </View>

      <View>
        <Text style={styles.helpCaption}>
          Os dias em verde são os que você tomou a cápsula. Os brancos você pulou.
        </Text>
        <View style={{ marginTop: 12 }}>
          <Card padding={22}>
            <Calendar days={days} />
          </Card>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Dias seguidos" value={streak} unit="" highlight />
        <Stat label="Do mês" value={rate} unit="%" />
        <Stat label="Seu recorde" value={best} unit="" />
      </View>

      <Card variant="accent">
        <View style={styles.insightHead}>
          <Text style={styles.insightSpark}>✦</Text>
          <Text style={styles.insightLabel}>OBSERVAÇÃO DA SEMANA</Text>
        </View>
        <Text style={styles.insight}>{insight}</Text>
      </Card>

      <View>
        <Eyebrow text="Dias em que você tomou" />
        <View style={{ marginTop: 12 }}>
          <Card>
            <Bars data={bars} />
          </Card>
        </View>
      </View>

      <View style={styles.quoteWrap}>
        <View style={styles.quoteLine} />
        <Text style={styles.quote}>
          "Manter é uma escolha diária.{'\n'}E escolhas diárias precisam de cuidado."
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
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  title: {
    color: colors.textLight,
    fontSize: 40,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  sub: { color: colors.textMuted, fontSize: 16, marginTop: 8, lineHeight: 24 },
  helpCaption: { color: colors.textMuted, fontSize: 14, fontStyle: 'italic', lineHeight: 22 },
  statVal: { color: colors.textLight, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  statUnit: { color: colors.textMuted, fontSize: 14, fontWeight: '800', marginLeft: 2 },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  insightHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightSpark: { color: colors.green, fontSize: 16 },
  insightLabel: { color: colors.green, fontSize: 12, letterSpacing: 2, fontWeight: '800' },
  insight: {
    color: colors.textLight,
    fontSize: 18,
    lineHeight: 28,
    marginTop: 14,
    fontFamily: font.serif,
    fontStyle: 'italic',
  },
  quoteWrap: { alignItems: 'center', marginTop: 8, gap: 12 },
  quoteLine: { width: 30, height: 1.5, backgroundColor: colors.green },
  quote: {
    color: colors.textMuted,
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
});
