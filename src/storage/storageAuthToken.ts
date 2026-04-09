import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE } from '@storage/storageConfig';

type StorageAuthTokenProps = {
  token: string;
};

export async function storageAuthToken({ token }: StorageAuthTokenProps) {
  await SecureStore.setItemAsync(AUTH_STORAGE, JSON.stringify({ token }));
  // Limpar do AsyncStorage (keys antiga e nova)
  await AsyncStorage.removeItem(AUTH_STORAGE).catch(() => {});
  await AsyncStorage.removeItem('@examinus:auth-token').catch(() => {});
}

export async function storageAuthTokenGet() {
  try {
    let response = await SecureStore.getItemAsync(AUTH_STORAGE);

    // Migração: se não encontrou no SecureStore, tentar AsyncStorage (key nova e antiga)
    if (!response) {
      response = await AsyncStorage.getItem(AUTH_STORAGE);
      if (!response) {
        response = await AsyncStorage.getItem('@examinus:auth-token');
      }
      if (response) {
        // Migrar para SecureStore
        await SecureStore.setItemAsync(AUTH_STORAGE, response);
        await AsyncStorage.removeItem(AUTH_STORAGE).catch(() => {});
        await AsyncStorage.removeItem('@examinus:auth-token').catch(() => {});
      }
    }

    if (!response) {
      return { token: undefined };
    }

    const { token }: StorageAuthTokenProps = JSON.parse(response);
    return { token };
  } catch (error) {
    if (__DEV__) console.error('Error parsing auth token from storage:', error);
    await SecureStore.deleteItemAsync(AUTH_STORAGE).catch(() => {});
    await AsyncStorage.removeItem(AUTH_STORAGE).catch(() => {});
    return { token: undefined };
  }
}

export async function storageAuthTokenRemove() {
  await SecureStore.deleteItemAsync(AUTH_STORAGE).catch(() => {});
  await AsyncStorage.removeItem(AUTH_STORAGE).catch(() => {});
}
