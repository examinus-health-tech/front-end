import { ReactNode, createContext, useEffect, useState } from 'react';

import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser';
import { storageAuthToken, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken';
import { UserDTO } from 'src/dtos/userDTO';
import { api } from 'src/services/api';

type UserDataProps = {
  name: string;
  lastname: string;
  phone: string;
  birthdate: string;
  gender: string;
  weight: number;
  height: number;
  occupation: string;
};

export type AuthContextDataProps = {
  user: UserDTO;
  emailTemp: string;
  userData: UserDataProps;
  getUserData: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, confirm_password: string) => Promise<void>;
  confirmationCode: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
  isLoadingUserData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [emailTemp, setEmailTemp] = useState<string>('');
  const [userData, setUserData] = useState<UserDataProps>({} as UserDataProps);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(false);

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState<boolean>(false);

  setTimeout(() => {
    storageUserRemove();
  }, 1000);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(userId: string, name: string, token: string) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave({ email: name, userId });
      await storageAuthToken({ token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function forgotPassword(email: string) {
    try {
      const response = await api.post('password-reset', {
        email,
      });
      setEmailTemp(email);

      const data = response.data.data;
      console.log('!@# 🚀 ~ forgotPassword ~ data:', data);
    } catch (error) {
      console.log('!@# 🚀 ~ forgotPassword ~ error:', error);
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function confirmationCode(email: string, code: string) {
    try {
      const response = await api.post('password-reset/verify', {
        email,
        code,
      });

      const data = response.data.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function resendConfirmationCode(email: string) {
    try {
      const response = await api.post('password-reset/password-confirm-reset', {
        fullName: name,
        email,
        password,
        confirmationPassword: confirm_password,
      });

      const data = response.data.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    api.defaults.headers.common['Content-Type'] = 'application/json';

    try {
      const response = await api.post('authentication', {
        userName: email,
        password,
      });

      const data = response.data.data;

      console.log('!@#', data);

      if (data.userId && data.name && data.token) {
        const { userId, name, token } = data;

        await storageUserAndTokenSave(userId, name, token);
        userAndTokenUpdate({ email: name, userId }, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signUp(name: string, email: string, password: string, confirm_password: string) {
    api.defaults.headers.common['Content-Type'] = 'application/json';

    try {
      const response = await api.post('users', {
        fullName: name,
        email,
        password,
        confirmationPassword: confirm_password,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);

      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function getUserData() {
    setIsLoadingUserData(true);

    try {
      const response = await api.get('/user/list', { headers: { email: user?.email } });

      const data = response.data.data;

      if (data.detail) {
        setUserData(data.detail);
        setIsLoadingUserData(false);
      }
    } catch (error) {
      setIsLoadingUserData(false);
      throw error;
    } finally {
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  // useEffect(() => {
  //   const subscribe = api.registerInterceptTokenManager(signOut);

  //   return () => {
  //     subscribe;
  //   };
  // }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        emailTemp,
        signIn,
        signUp,
        signOut,
        confirmationCode,
        resendConfirmationCode,
        forgotPassword,
        isLoadingUserStorageData,
        getUserData,
        userData,
        isLoadingUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
