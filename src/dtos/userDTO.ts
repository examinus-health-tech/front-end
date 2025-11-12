export type UserDTO = {
  email: string;
  userId: string;
};

/**
 * DTO unificado para atualizar dados do usuário e dados pessoais
 * Endpoint: PUT /user-personal-data
 * Todos os campos são opcionais - envia apenas o que precisa atualizar
 */
export type UserPersonalDataDTO = {
  // Dados básicos do User
  fullName?: string;
  email?: string;

  // Dados pessoais
  gender?: string; // char
  weight?: number; // kg
  height?: number; // cm
  age?: number;
  workoutLevel?: number;
  moodLevel?: string; // char
  eatingHabits?: string; // char
  phone?: string;
  location?: string; // endereço
  profession?: string;
  birthDate?: string; // DateTime - enviar como ISO string
  country?: string;
};

/**
 * DTO unificado de resposta que retorna dados do usuário + dados pessoais
 * Endpoint: GET /user-personal-data
 */
export type UserPersonalDataResponseDTO = {
  // Dados básicos do User
  fullName?: string;
  email?: string;

  // Dados pessoais
  gender?: string;
  weight?: number;
  height?: number;
  age?: number;
  workoutLevel?: number;
  moodLevel?: string;
  eatingHabits?: string;
  phone?: string;
  location?: string;
  profession?: string;
  birthDate?: string;
  country?: string;
};

interface AuthenticationResultProps {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
  idToken: string;
}
