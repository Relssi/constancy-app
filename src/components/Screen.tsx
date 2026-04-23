import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  light?: boolean;
  style?: ViewStyle;
  noPadBottom?: boolean;
};

export function Screen({ children, scroll = true, light, style, noPadBottom }: Props) {
  const bg = light ? colors.cream : colors.navy;
  const Wrap = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      {!light && (
        <>
          <LinearGradient
            colors={['rgba(34,197,94,0.09)', 'transparent']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.3, y: 0.5 }}
            style={styles.glow1}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['rgba(19,49,92,0.7)', 'transparent']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 1, y: 1 }}
            style={styles.glow2}
            pointerEvents="none"
          />
        </>
      )}
      <Wrap
        contentContainerStyle={scroll ? [styles.content, noPadBottom && { paddingBottom: 20 }, style] : undefined}
        style={!scroll ? [styles.content, style] : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Wrap>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 110,
    gap: 18,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
  glow1: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 380,
    height: 380,
    borderRadius: 200,
  },
  glow2: {
    position: 'absolute',
    top: 200,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
});
