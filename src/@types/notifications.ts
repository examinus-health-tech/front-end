export type NotificationType = 'DOCTOR_MESSAGE' | 'MONTHLY_INSIGHT' | 'STEPS_GOAL';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  pdfUrl?: string;
  remainingSteps?: number;
  progress?: number;
  createdAt: string;
  read: boolean;
};
