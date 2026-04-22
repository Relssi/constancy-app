import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'dark' | 'light' | 'accent';
};

export function Card({ children, style, variant = 'dark' }: Props) {
  const bg =
    variant === 'light'
      ? { backgroundColor: '#FFFFFF', borderColor: 'rgba(11,37,69,0.08)' }
      : variant === 'accent'
      ? { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)' }
      : { backgroundColor: colors.navyCard, borderColor: colors.navyBorder };
  return <View style={[styles.card, bg, shadow.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
  },
});
