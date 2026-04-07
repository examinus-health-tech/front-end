import { Platform } from 'react-native';
import {
  MedicationDTO,
  MedicationFrequencyType,
  MedicationFormLabels,
} from './medicationService';

// Lazy-load expo-notifications to avoid crash when native module isn't built yet
let Notifications: typeof import('expo-notifications') | null = null;

try {
  Notifications = require('expo-notifications');

  // Configure notification handler (shows notification when app is foreground)
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const data = notification.request.content.data;
      // Only handle medication notifications (not OneSignal)
      if (data?.type === 'medication_reminder') {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      }
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    },
  });
} catch (e) {
  if (__DEV__) console.warn('[MedicationNotifications] expo-notifications native module not available. Notifications disabled until next native build.');
}

function isAvailable(): boolean {
  return Notifications != null;
}

/**
 * Request notification permission from the user.
 * Returns true if permission was granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isAvailable()) return false;

  const { status: existingStatus } = await Notifications!.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications!.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Set up the Android notification channel for medication reminders.
 */
export async function setupNotificationChannel(): Promise<void> {
  if (!isAvailable()) return;

  if (Platform.OS === 'android') {
    await Notifications!.setNotificationChannelAsync('medication-reminders', {
      name: 'Lembretes de Medicamentos',
      importance: Notifications!.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0CC1AF',
      sound: 'default',
    });
  }
}

/**
 * Add a listener for notification response (tap). Returns a subscription or null.
 */
export function addNotificationResponseListener(
  callback: (response: any) => void
): { remove: () => void } | null {
  if (!isAvailable()) return null;
  return Notifications!.addNotificationResponseReceivedListener(callback);
}

/**
 * Gera os horários efetivos para um medicamento.
 * Para IntervalHours, expande a partir do primeiro horário com o intervalo.
 */
function getEffectiveTimes(med: MedicationDTO): string[] {
  if (
    med.frequencyType !== MedicationFrequencyType.IntervalHours ||
    !med.intervalHours ||
    med.intervalHours <= 0 ||
    med.scheduleTimes.length === 0
  ) {
    return med.scheduleTimes;
  }

  const [h, m] = med.scheduleTimes[0].split(':').map(Number);
  const times: string[] = [];
  let totalMinutes = h * 60 + m;
  const intervalMinutes = med.intervalHours * 60;

  while (totalMinutes < 24 * 60) {
    const hh = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const mm = (totalMinutes % 60).toString().padStart(2, '0');
    times.push(`${hh}:${mm}`);
    totalMinutes += intervalMinutes;
  }

  return times;
}

/**
 * Build the notification identifier for a specific medication + time slot.
 */
function buildIdentifier(medicationId: string, time: string): string {
  return `med_${medicationId}_${time.replace(':', '')}`;
}

/**
 * Schedule all notifications for a single medication.
 * Cancels existing notifications for this medication first.
 */
export async function scheduleMedicationNotifications(med: MedicationDTO): Promise<void> {
  if (!isAvailable()) return;

  // Cancel existing notifications for this medication first
  await cancelMedicationNotifications(med.id);

  if (!med.isActive) return;

  const formLabel = MedicationFormLabels[med.form] || '';

  // Gera os horários efetivos (para IntervalHours, expande a partir do primeiro horário)
  const effectiveTimes = getEffectiveTimes(med);

  for (const time of effectiveTimes) {
    const [hours, minutes] = time.split(':').map(Number);
    const identifier = buildIdentifier(med.id, time);

    const notificationContent = {
      title: `Hora de tomar ${med.name}`,
      body: `${med.dosage} - ${formLabel}${med.instructions ? `\n${med.instructions}` : ''}`,
      data: {
        type: 'medication_reminder',
        medicationId: med.id,
        scheduledTime: time,
      },
      sound: 'default' as const,
      ...(Platform.OS === 'android' && { channelId: 'medication-reminders' }),
    };

    if (med.frequencyType === MedicationFrequencyType.Daily || med.frequencyType === MedicationFrequencyType.IntervalHours) {
      await Notifications!.scheduleNotificationAsync({
        identifier,
        content: notificationContent,
        trigger: {
          type: Notifications!.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
      });
    } else if (med.frequencyType === MedicationFrequencyType.SpecificDays && med.frequencyDays) {
      for (const dayOfWeek of med.frequencyDays) {
        const weekday = dayOfWeek + 1; // 0=Sun..6=Sat → 1=Sun..7=Sat
        const dayIdentifier = `${identifier}_d${dayOfWeek}`;

        await Notifications!.scheduleNotificationAsync({
          identifier: dayIdentifier,
          content: notificationContent,
          trigger: {
            type: Notifications!.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: hours,
            minute: minutes,
          },
        });
      }
    }
  }
}

/**
 * Cancel all scheduled notifications for a specific medication.
 */
export async function cancelMedicationNotifications(medicationId: string): Promise<void> {
  if (!isAvailable()) return;

  const prefix = `med_${medicationId}_`;
  const scheduled = await Notifications!.getAllScheduledNotificationsAsync();

  const toCancel = scheduled.filter(n => n.identifier.startsWith(prefix));
  for (const notification of toCancel) {
    await Notifications!.cancelScheduledNotificationAsync(notification.identifier);
  }
}

/**
 * Reschedule all medication notifications.
 * Call on app start to keep notifications in sync.
 */
export async function rescheduleAllMedicationNotifications(
  medications: MedicationDTO[]
): Promise<void> {
  if (!isAvailable()) return;

  const scheduled = await Notifications!.getAllScheduledNotificationsAsync();
  const medNotifications = scheduled.filter(n => n.identifier.startsWith('med_'));
  for (const notification of medNotifications) {
    await Notifications!.cancelScheduledNotificationAsync(notification.identifier);
  }

  const activeMeds = medications.filter(m => m.isActive);
  for (const med of activeMeds) {
    await scheduleMedicationNotifications(med);
  }
}
