import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/tokens';

function Icon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return (
    <View
      style={[
        styles.iconWrap,
        focused && { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: colors.green },
      ]}
    >
      <Text style={{ color: focused ? colors.green : colors.textMuted, fontSize: 16 }}>{glyph}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navyDeep,
          borderTopColor: colors.navyBorder,
          height: 72,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'INÍCIO',
          tabBarIcon: ({ focused }) => <Icon glyph="⌂" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'PROGRESSO',
          tabBarIcon: ({ focused }) => <Icon glyph="◐" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: 'PRODUTO',
          tabBarIcon: ({ focused }) => <Icon glyph="●" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PERFIL',
          tabBarIcon: ({ focused }) => <Icon glyph="◉" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
