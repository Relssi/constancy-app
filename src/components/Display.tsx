import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors, font } from '../theme/tokens';

type Props = {
  serif: string;
  sans?: string;
  align?: 'left' | 'center';
  size?: 'md' | 'lg' | 'xl';
};

export function Display({ serif, sans, align = 'left', size = 'lg' }: Props) {
  const sizeMap = { md: 28, lg: 36, xl: 48 } as const;
  const fs = sizeMap[size];
  return (
    <View>
      <Text style={[styles.serif, { fontSize: fs, lineHeight: fs * 1.05, textAlign: align }]}>
        {serif}
      </Text>
      {sans ? (
        <Text
          style={[
            styles.sans,
            { fontSize: fs, lineHeight: fs * 1.05, textAlign: align },
          ]}
        >
          {sans.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  serif: {
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.textLight,
    letterSpacing: -0.3,
  },
  sans: {
    fontFamily: font.sans,
    fontWeight: '900',
    color: colors.green,
    letterSpacing: -1,
    marginTop: 2,
  },
});
