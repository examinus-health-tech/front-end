import { ReactNode, createContext } from 'react';
import { UserDTO } from 'src/dtos/userDTO';

export type AuthContextDataProps = {
  user: UserDTO;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({});

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          id: '1',
          name: 'Oseas',
          email: 'test@test.com',
          avatar: 'ose.png',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
