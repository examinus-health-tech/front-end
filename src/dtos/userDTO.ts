export type UserDTO = {
  email: string;
  message: string;
  ImageUserUrl: string;
  AuthenticationResult: AuthenticationResultProps;
};

interface AuthenticationResultProps {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
  idToken: string;
}
