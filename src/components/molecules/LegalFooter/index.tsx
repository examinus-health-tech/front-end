import { Text } from 'native-base';
import { Linking } from 'react-native';

export function LegalFooter() {
  return (
    <Text fontSize={12} color="gray.400" fontWeight={400} letterSpacing={-0.14} flex={1} textAlign="center">
      Ao continuar, você concorda com a nossa{' '}
      <Text
        style={{ color: '#007AFF' }}
        onPress={() => Linking.openURL('https://examinus-politica-privacidade.vercel.app/privacy-policy')}
      >
        Política de Privacidade
      </Text>
    </Text>
  );
}
