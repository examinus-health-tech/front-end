import { Linking, Text } from 'react-native';

export function LegalFooter() {
  return (
    <Text
      style={{
        fontSize: 12,
        textAlign: 'center',
        color: '#121212',
        marginTop: 12,
        paddingHorizontal: 20,
      }}
    >
      Ao continuar, você concorda com a nossa{' '}
      <Text
        style={{ color: '#007AFF' }}
        onPress={() => Linking.openURL('https://examinus-politica-privacidade.vercel.app/privacy-policy')}
      >
        Política de Privacidade
      </Text>
      .
    </Text>
  );
}
