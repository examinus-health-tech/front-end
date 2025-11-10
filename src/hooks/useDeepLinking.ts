import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function useDeepLinking() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useEffect(() => {
    // Lidar com deep link quando o app está aberto
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Lidar com deep link quando o app é aberto a partir de um link
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    };

    getInitialURL();

    return () => {
      subscription.remove();
    };
  }, []);

  function handleDeepLink(event: { url: string }) {
    console.log('🔗 [Deep Link] URL recebida:', event.url);

    const data = Linking.parse(event.url);
    console.log('📊 [Deep Link] Dados parseados:', JSON.stringify(data, null, 2));

    const { hostname, path, queryParams } = data;

    // Exemplos de rotas que você pode implementar:
    // examinus://upload - Abre a tela de upload
    // examinus://exam?id=123 - Abre um exame específico
    // examinus://homepage - Abre a homepage
    // https://examinus.app/app/upload - Universal Link para upload

    // Navegação baseada no path/hostname
    if (hostname === 'upload' || path === 'upload') {
      console.log('➡️ [Deep Link] Navegando para upload');
      navigation.navigate('upload');
    } else if (hostname === 'exam' || path === 'exam') {
      console.log('➡️ [Deep Link] Navegando para exam');
      navigation.navigate('exam');
    } else if (hostname === 'homepage' || path === 'homepage' || path === '') {
      console.log('➡️ [Deep Link] Navegando para homepage');
      navigation.navigate('homepage');
    } else if (hostname === 'examList' || path === 'examList' || path === 'exams') {
      console.log('➡️ [Deep Link] Navegando para examList');
      navigation.navigate('examList');
    } else if (hostname === 'healthWallet' || path === 'healthWallet' || path === 'wallet') {
      console.log('➡️ [Deep Link] Navegando para healthWallet');
      navigation.navigate('healthWallet');
    } else if (hostname === 'myAccount' || path === 'myAccount' || path === 'account') {
      console.log('➡️ [Deep Link] Navegando para myAccount');
      navigation.navigate('myAccount');
    } else {
      console.log('⚠️ [Deep Link] Rota não reconhecida, navegando para homepage');
      navigation.navigate('homepage');
    }
  }

  return { handleDeepLink };
}
