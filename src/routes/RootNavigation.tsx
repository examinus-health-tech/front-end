import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as (name: string, params?: object) => void)(name, params);
  } else {
    console.warn('Navigation não está pronto ainda. Tentativa de navegar para:', name);
  }
}

export function isNavigationReady() {
  return navigationRef.isReady();
}
