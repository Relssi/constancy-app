import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../../src/theme/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function Icon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View
      style={[
        styles.iconWrap,
        focused && styles.iconWrapFocused,
      ]}
    >
      <Ionicons
        name={name}
        size={20}
        color={focused ? colors.green : colors.textMuted}
      />
    </View>
  );
}

function TabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill as any, styles.bgWrap]}>
      <LinearGradient
        colors={['rgba(7,24,51,0.94)', 'rgba(5,14,31,0.99)'] as const}
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
          backgroundColor: colors.navyDeep,
          paddingTop: 12,
          paddingBottom: 14,
          // sombra fica fora do overflow:hidden — funciona em iOS e Android
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 20,
          ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(18px)' } as any) : {}),
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 4,
          fontFamily: font.numeric,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: ({ focused }) => <Icon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="meals"
        options={{ title: 'Comida', tabBarIcon: ({ focused }) => <Icon name="restaurant" focused={focused} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progresso', tabBarIcon: ({ focused }) => <Icon name="stats-chart" focused={focused} /> }}
      />
      <Tabs.Screen
        name="product"
        options={{ title: 'Cápsula', tabBarIcon: ({ focused }) => <Icon name="medical" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Eu', tabBarIcon: ({ focused }) => <Icon name="person" focused={focused} /> }}
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
  iconWrapFocused: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: colors.green,
    ...(Platform.OS === 'android'
      ? { elevation: 6 }
      : {
          shadowColor: colors.green,
          shadowOpacity: 0.5,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
        }),
  },
  bgWrap: {
    borderRadius: 26,
    overflow: 'hidden',
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
