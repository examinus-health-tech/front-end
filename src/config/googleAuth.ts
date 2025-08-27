import { Platform } from 'react-native';

// Configurações do Google OAuth para Produção
export const GOOGLE_CLIENT_ID = {
  // Client IDs específicos por plataforma (PRODUÇÃO)
  // iOS: Bundle ID = org.name.examinusmobile
  ios: '477011438187-7gnqtm50ep300onpk68e1099tj0rse3v.apps.googleusercontent.com',

  // Android: Package name = com.ozzyfernan.examinusmobile
  android: '477011438187-4k19b9oi2ridi11nt2vrfia31otft5qv.apps.googleusercontent.com',

  // Web: Para ambiente web/Expo Go
  web: '477011438187-ni0kabtle52am9ri4ub0ftacbvtt9uer.apps.googleusercontent.com',
};

// Função para obter o client ID correto baseado na plataforma
export function getGoogleClientId() {
  // Para GoogleSignin, sempre usar o web client ID
  const clientId = GOOGLE_CLIENT_ID.web;

  // Verificar se o Client ID está configurado
  if (clientId.startsWith('YOUR_')) {
    console.warn('⚠️ Google Client ID não configurado para:', Platform.OS);
    return null;
  }

  console.log('🔧 Google Client ID:', {
    platform: Platform.OS,
    clientIdPrefix: clientId.substring(0, 20) + '...'
  });

  return clientId;
}

// Função para obter o iOS client ID
export function getGoogleIOSClientId() {
  return GOOGLE_CLIENT_ID.ios;
}

// Verificar se o Google OAuth está configurado
export function isGoogleAuthConfigured() {
  const clientId = getGoogleClientId();
  return clientId !== null;
}
