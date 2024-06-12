import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE } from '@storage/storageConfig';

type StorageAuthTokenProps = {
  token: string;
  refreshToken: string;
  idToken: string;
};

export async function storageAuthToken({
  token,
  refreshToken,
  idToken,
}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_STORAGE,
    JSON.stringify({ token, refreshToken, idToken })
  );
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(AUTH_STORAGE);

  const { token, refreshToken, idToken }: StorageAuthTokenProps = response
    ? JSON.parse(response)
    : {};

  return { token, refreshToken, idToken };
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE);
}
