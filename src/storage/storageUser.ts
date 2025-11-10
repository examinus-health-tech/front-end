import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserDTO } from 'src/dtos/userDTO';
import { USER_STORAGE } from '@storage/storageConfig';

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}

export async function storageUserGet() {
  try {
    const storage = await AsyncStorage.getItem(USER_STORAGE);

    if (!storage) {
      return {} as UserDTO;
    }

    const user: UserDTO = JSON.parse(storage);
    return user;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    await AsyncStorage.removeItem(USER_STORAGE);
    return {} as UserDTO;
  }
}
