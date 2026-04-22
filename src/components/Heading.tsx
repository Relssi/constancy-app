import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, font } from '../theme/tokens';

type Props = {
  eyebrow?: string;
  serif: string;
  sans?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  style?: TextStyle;
};

export function Heading({ eyebrow, serif, sans, align = 'left', dark }: Props) {
  const text = dark ? colors.textDark : colors.textLight;
  return (
    <>
      {eyebrow ? (
        <Text style={[styles.eyebrow, { textAlign: align }]}>— {eyebrow.toUpperCase()}</Text>
      ) : null}
      <Text style={[styles.serif, { color: text, textAlign: align }]}>{serif}</Text>
      {sans ? (
        <Text style={[styles.sans, { color: colors.green, textAlign: align }]}>{sans.toUpperCase()}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.green,
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  serif: {
    fontFamily: font.serif,
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 40,
  },
  sans: {
    fontFamily: font.sans,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginTop: 2,
  },
});
