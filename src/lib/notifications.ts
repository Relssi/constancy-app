import { Platform } from 'react-native';

let Notifications: any = null;
if (Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {}
}

export async function requestPermission() {
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleCheckInReminders(slot?: 'morning' | 'afternoon' | 'night') {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const times: { hour: number; minute: number; body: string }[] = [
    { hour: 10, minute: 0, body: 'Check-in da manhã: como tá a fome?' },
    { hour: 15, minute: 30, body: 'Você costuma sentir mais fome agora. Respira 10s antes de decidir.' },
    { hour: 20, minute: 30, body: 'Ontem você perdeu controle nesse horário. Tenta um chá antes do doce.' },
  ];
  for (const t of times) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Constancy', body: t.body },
      trigger: { hour: t.hour, minute: t.minute, repeats: true },
    });
  }
}
