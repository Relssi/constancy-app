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
    { hour: 10, minute: 0, body: 'Bom dia. Como está sua vontade de comer agora?' },
    { hour: 15, minute: 30, body: 'É a hora difícil do dia. Respire fundo antes de decidir.' },
    { hour: 20, minute: 30, body: 'Antes de comer algo doce, experimente um copo de água ou um chá.' },
  ];
  for (const t of times) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Constancy', body: t.body },
      trigger: { hour: t.hour, minute: t.minute, repeats: true },
    });
  }
}
