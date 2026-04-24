import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../src/theme/tokens';

function Icon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return (
    <View
      style={[
        styles.iconWrap,
        focused && {
          backgroundColor: 'rgba(34,197,94,0.18)',
          borderColor: colors.green,
          shadowColor: colors.green,
          shadowOpacity: 0.5,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    >
      <Text style={{ color: focused ? colors.green : colors.textMuted, fontSize: 18 }}>{glyph}</Text>
    </View>
  );
}

function TabBarBackground() {
  return (
    <View style={StyleSheet.absoluteFill as any}>
      <LinearGradient
        colors={['rgba(7,24,51,0.88)', 'rgba(5,14,31,0.98)'] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill as any}
      />
      <View style={styles.topHair} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: Platform.OS === 'ios' ? 22 : 14,
          height: 84,
          borderRadius: 26,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.navyBorderHi,
          backgroundColor: 'transparent',
          paddingTop: 12,
          paddingBottom: 14,
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 20,
          overflow: 'hidden',
          ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(18px)' } as any) : {}),
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: ({ focused }) => <Icon glyph="⌂" focused={focused} /> }}
      />
      <Tabs.Screen
        name="meals"
        options={{ title: 'Comida', tabBarIcon: ({ focused }) => <Icon glyph="✱" focused={focused} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progresso', tabBarIcon: ({ focused }) => <Icon glyph="◐" focused={focused} /> }}
      />
      <Tabs.Screen
        name="product"
        options={{ title: 'Cápsula', tabBarIcon: ({ focused }) => <Icon glyph="●" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Eu', tabBarIcon: ({ focused }) => <Icon glyph="◉" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  topHair: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
