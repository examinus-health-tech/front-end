// Configurações do Google OAuth para Produção
export const GOOGLE_CLIENT_ID = {
  // Client IDs específicos por plataforma (PRODUÇÃO)
  // iOS: Bundle ID = org.name.examinusmobile
  ios: '477011438187-7gnqtm50ep300onpk68e1099tj0rse3v.apps.googleusercontent.com',

  // Android: Package name = com.anonymous.examinusmobile
  android: '477011438187-4k19b9oi2ridi11nt2vrfia31otft5qv.apps.googleusercontent.com',

  // Web/Development: Para desenvolvimento com Expo
  web: '477011438187-ni0kabtle52am9ri4ub0ftacbvtt9uer.apps.googleusercontent.com',
};

// Função para obter o client ID correto baseado na plataforma
export function getGoogleClientId() {
  const { Platform } = require('react-native');

  let clientId;
  if (Platform.OS === 'ios') {
    clientId = GOOGLE_CLIENT_ID.ios;
  } else if (Platform.OS === 'android') {
    clientId = GOOGLE_CLIENT_ID.android;
  } else {
    clientId = GOOGLE_CLIENT_ID.web;
  }

  // Verificar se o Client ID está configurado
  if (clientId.startsWith('YOUR_')) {
    console.warn('⚠️ Google Client ID não configurado para a plataforma:', Platform.OS);
    return null;
  }

  return clientId;
}

// Verificar se o Google OAuth está configurado
export function isGoogleAuthConfigured() {
  const clientId = getGoogleClientId();
  return clientId !== null;
}
