import { Platform } from 'react-native';

export function isAppleAuthAvailable() {
  return Platform.OS === 'ios';
}

export function getAppleConfig() {
  if (!isAppleAuthAvailable()) {
    return null;
  }

  return {
    requestedScopes: ['fullName', 'email'],
  };
}