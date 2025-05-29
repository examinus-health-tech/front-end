export type UserDTO = {
  email: string;
  userId: string;
};

interface AuthenticationResultProps {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
  idToken: string;
}
