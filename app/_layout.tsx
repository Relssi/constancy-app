import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from '../src/store/useStore';
import { colors } from '../src/theme/tokens';

export default function RootLayout() {
  const auth = useStore((s) => s.auth);
  const onboarded = useStore((s) => s.profile.onboarded);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuth = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    if (!auth) {
      if (!inAuth) router.replace('/auth');
      return;
    }
    if (!onboarded) {
      if (!inOnboarding) router.replace('/onboarding');
      return;
    }
    if (inAuth || inOnboarding) router.replace('/');
  }, [auth, onboarded, segments]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.navy },
          animation: 'fade',
        }}
      />
    </SafeAreaProvider>
  );
}
