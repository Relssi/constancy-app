import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, gradients } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'dark' | 'light' | 'accent' | 'hero' | 'plain';
  padding?: number;
};

export function Card({ children, style, variant = 'dark', padding = 20 }: Props) {
  if (variant === 'hero') {
    return (
      <View style={[styles.base, shadow.card, { padding }, style]}>
        <LinearGradient
          colors={gradients.streak}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill as any}
        />
        <LinearGradient
          colors={gradients.streakAccent}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill as any}
        />
        <View style={[styles.heroBorder]} />
        <View style={{ zIndex: 2 }}>{children}</View>
      </View>
    );
  }

  if (variant === 'light') {
    return (
      <View
        style={[
          styles.base,
          { backgroundColor: '#FFFFFF', borderColor: 'rgba(11,37,69,0.08)', padding },
          shadow.cardSoft,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  if (variant === 'accent') {
    return (
      <View style={[styles.base, shadow.cardSoft, { padding }, style]}>
        <LinearGradient
          colors={['rgba(34,197,94,0.14)', 'rgba(34,197,94,0.04)'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill as any}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(34,197,94,0.28)' },
          ]}
        />
        <View style={{ zIndex: 2 }}>{children}</View>
      </View>
    );
  }

  if (variant === 'plain') {
    return <View style={[styles.base, { padding }, style]}>{children}</View>;
  }

  return (
    <View style={[styles.base, shadow.cardSoft, { padding }, style]}>
      <LinearGradient
        colors={gradients.darkCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill as any}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.navyBorder },
        ]}
      />
      <View style={{ zIndex: 2 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(14px)' } as any) : {}),
  },
  heroBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.22)',
  },
});
