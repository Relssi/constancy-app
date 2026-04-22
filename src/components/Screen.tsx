import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  light?: boolean;
  style?: ViewStyle;
};

export function Screen({ children, scroll = true, light, style }: Props) {
  const bg = light ? colors.cream : colors.navy;
  const Wrap = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <Wrap
        contentContainerStyle={scroll ? [styles.content, style] : undefined}
        style={!scroll ? [styles.content, style] : undefined}
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
    paddingVertical: 28,
    gap: 20,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
});
