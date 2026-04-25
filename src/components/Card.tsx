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

/**
 * Card com sombra. A sombra fica num wrapper externo (sem overflow:hidden)
 * pra não ser cortada — bug clássico do RN. O conteúdo fica num wrapper
 * interno com overflow:hidden pra cortar gradientes nas bordas arredondadas.
 */
export function Card({ children, style, variant = 'dark', padding = 20 }: Props) {
  const sh = variant === 'hero' ? shadow.card : variant === 'plain' ? null : shadow.cardSoft;

  if (variant === 'hero') {
    return (
      <View style={[styles.shadowWrap, sh as any, style]}>
        <View style={[styles.inner, { padding }]}>
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
      </View>
    );
  }

  if (variant === 'light') {
    return (
      <View style={[styles.shadowWrap, sh as any, style]}>
        <View
          style={[
            styles.inner,
            { backgroundColor: '#FFFFFF', borderColor: 'rgba(11,37,69,0.08)', borderWidth: 1, padding },
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  if (variant === 'accent') {
    return (
      <View style={[styles.shadowWrap, sh as any, style]}>
        <View style={[styles.inner, { padding }]}>
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
      </View>
    );
  }

  if (variant === 'plain') {
    return (
      <View style={[styles.shadowWrap, style]}>
        <View style={[styles.inner, { padding }]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.shadowWrap, sh as any, style]}>
      <View style={[styles.inner, { padding }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: radius.lg,
    backgroundColor: 'transparent',
  },
  inner: {
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
