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
  userData: UserDataProps;
  getUserData: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, confirm_rules: boolean) => Promise<void>;
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
  const [userData, setUserData] = useState<UserDataProps>({} as UserDataProps);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(false);

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState<boolean>(false);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refreshToken: string, idToken: string) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthToken({ token, refreshToken, idToken });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function forgotPassword(email: string) {
    try {
      api.defaults.headers.common['Authorization'] = 'Bearer tC4eivUAg3dEfhbYTTdpyIXWtC5xf78u';

      const response = await api.post('/user/auth/forgot-password', {
        email,
      });

      const data = response.data.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      api.defaults.headers.common['Authorization'] = 'Bearer tC4eivUAg3dEfhbYTTdpyIXWtC5xf78u';

      const response = await api.post('/user/auth/start-sign', {
        email,
        password,
      });

      const data = response.data.data;

      if (
        data.email &&
        data.AuthenticationResult?.AccessToken &&
        data.AuthenticationResult?.RefreshToken &&
        data.AuthenticationResult?.IdToken
      ) {
        const { AccessToken, RefreshToken, IdToken } = data.AuthenticationResult;

        await storageUserAndTokenSave(data, AccessToken, RefreshToken, IdToken);
        userAndTokenUpdate(data, AccessToken);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signUp(email: string, password: string, confirm_rules: boolean) {
    try {
      await api.post('/user/auth/sign-up', {
        name: 'temp',
        email,
        password,
        confirm_rules,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  // 200
  //   {
  //     "data": {
  //         "email": "hmnonato1@uol.com.br",
  //         "message": "Usuário criado com sucesso. Utilize o código enviado por e-mail para confirmar o acesso.",
  //         "code": 200
  //     }
  // }

  // {
  //   "error": {
  //       "code": 403,
  //       "type": "/errors/bad-request",
  //       "message": "Já existe um cadastro com esse e-mail (hmnonato@uol.com.br)."
  //   }
  // }

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
      const response = await api.get('/user/list', { headers: { email: user.email } });

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

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe;
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
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
