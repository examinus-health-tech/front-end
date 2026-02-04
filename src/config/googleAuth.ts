import { Platform } from 'react-native';

// Configurações do Google OAuth para Produção
// IMPORTANTE: Para resolver DEVELOPER_ERROR no Android:
// 1. Acesse o Google Cloud Console: https://console.cloud.google.com
// 2. Vá em APIs & Services > Credentials
// 3. Verifique se o Client ID Android tem o package name correto: com.examinus.app
// 4. Adicione o SHA-1 fingerprint do build de release (EAS Build ou Play Store)
//    - Para obter: eas credentials ou keytool -list -v -keystore <your-keystore>
// 5. O SHA-1 de debug é diferente do de release - configure ambos se necessário
export const GOOGLE_CLIENT_ID = {
  // Client IDs específicos por plataforma (PRODUÇÃO)
  // iOS: Bundle ID = com.examinus.app
  ios: '477011438187-7gnqtm50ep300onpk68e1099tj0rse3v.apps.googleusercontent.com',

  // Android: Package name = com.examinus.app
  // NOTA: Este Client ID precisa ter o SHA-1 fingerprint configurado no Google Cloud Console
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
