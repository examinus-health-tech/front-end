import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserDTO } from 'src/dtos/userDTO';
import { USER_STORAGE } from '@storage/storageConfig';

export async function storageUserSave(user: UserDTO) {
  await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify(user));
  // Limpar do AsyncStorage (keys antiga e nova)
  await AsyncStorage.removeItem(USER_STORAGE).catch(() => {});
  await AsyncStorage.removeItem('@examinus:user').catch(() => {});
}

export async function storageUserRemove() {
  await SecureStore.deleteItemAsync(USER_STORAGE).catch(() => {});
  await AsyncStorage.removeItem(USER_STORAGE).catch(() => {});
}

export async function storageUserGet() {
  try {
    let storage = await SecureStore.getItemAsync(USER_STORAGE);

    // Migração: se não encontrou no SecureStore, tentar AsyncStorage (key nova e antiga)
    if (!storage) {
      storage = await AsyncStorage.getItem(USER_STORAGE);
      if (!storage) {
        storage = await AsyncStorage.getItem('@examinus:user');
      }
      if (storage) {
        // Migrar para SecureStore
        await SecureStore.setItemAsync(USER_STORAGE, storage);
        await AsyncStorage.removeItem(USER_STORAGE).catch(() => {});
        await AsyncStorage.removeItem('@examinus:user').catch(() => {});
      }
    }

    if (!storage) {
      return {} as UserDTO;
    }

    const user: UserDTO = JSON.parse(storage);
    return user;
  } catch (error) {
    if (__DEV__) console.error('Error parsing user from storage:', error);
    await SecureStore.deleteItemAsync(USER_STORAGE).catch(() => {});
    await AsyncStorage.removeItem(USER_STORAGE).catch(() => {});
    return {} as UserDTO;
  }
}
