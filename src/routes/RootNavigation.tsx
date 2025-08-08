import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params);
  } else {
    console.warn('Navigation não está pronto ainda. Tentativa de navegar para:', name);
  }
}

export function isNavigationReady() {
  return navigationRef.isReady();
}
