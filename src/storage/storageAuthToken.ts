import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE } from '@storage/storageConfig';

type StorageAuthTokenProps = {
  token: string;
};

export async function storageAuthToken({ token }: StorageAuthTokenProps) {
  await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({ token }));
}

export async function storageAuthTokenGet() {
  try {
    const response = await AsyncStorage.getItem(AUTH_STORAGE);

    if (!response) {
      return { token: undefined };
    }

    const { token }: StorageAuthTokenProps = JSON.parse(response);
    return { token };
  } catch (error) {
    console.error('Error parsing auth token from storage:', error);
    await AsyncStorage.removeItem(AUTH_STORAGE);
    return { token: undefined };
  }
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE);
}
