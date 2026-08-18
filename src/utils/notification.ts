import { ToastMessage, ToastType } from '../components/ToastNotification';

type NotificationListener = (toast: ToastMessage) => void;
const listeners: Set<NotificationListener> = new Set();

export const subscribeNotification = (listener: NotificationListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const showNotification = (
  title: string,
  message?: string,
  type: ToastType = 'success',
  duration: number = 3500
) => {
  const newToast: ToastMessage = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    title,
    message,
    duration
  };

  listeners.forEach((listener) => listener(newToast));
};
