import { useEffect, useState } from 'react';
import { Modal, VStack, Text, HStack, Box, ScrollView, Pressable } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@components/atoms';
import Constants from 'expo-constants';

const LAST_SEEN_VERSION_KEY = '@examinus:lastSeenVersion';

// Configuração das novidades por versão
// Adicione aqui as novidades de cada versão
const WHATS_NEW_CONTENT: Record<string, { title: string; features: { icon: string; title: string; description: string }[] }> = {
  '1.2.12': {
    title: 'Novidades da versão 1.2.12',
    features: [
      {
        icon: '🏃',
        title: 'Rastreador Fitness',
        description: 'Acompanhe seus passos, calorias, sono e frequência cardíaca diretamente do Apple Health.',
      },
      {
        icon: '📊',
        title: 'Análise do Dia',
        description: 'Veja insights personalizados sobre sua saúde com base nos seus dados diários.',
      },
      {
        icon: '💚',
        title: 'Health Connect',
        description: 'Integração completa com o Apple Health para sincronização automática dos seus dados.',
      },
      {
        icon: '✨',
        title: 'Melhorias Gerais',
        description: 'Correções de bugs e melhorias de performance para uma experiência mais fluida.',
      },
    ],
  },
};

interface Props {
  children: React.ReactNode;
}

export function WhatsNewModal({ children }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>('');

  useEffect(() => {
    checkVersion();
  }, []);

  async function checkVersion() {
    try {
      const appVersion = Constants.expoConfig?.version || '1.0.0';
      setCurrentVersion(appVersion);

      const lastSeenVersion = await AsyncStorage.getItem(LAST_SEEN_VERSION_KEY);

      // Se nunca viu nenhuma versão ou se a versão é diferente da atual
      // E se existe conteúdo de novidades para essa versão
      if (lastSeenVersion !== appVersion && WHATS_NEW_CONTENT[appVersion]) {
        setIsVisible(true);
      }
    } catch (error) {
      console.log('Erro ao verificar versão:', error);
    }
  }

  async function handleClose() {
    try {
      await AsyncStorage.setItem(LAST_SEEN_VERSION_KEY, currentVersion);
      setIsVisible(false);
    } catch (error) {
      console.log('Erro ao salvar versão:', error);
      setIsVisible(false);
    }
  }

  const content = WHATS_NEW_CONTENT[currentVersion];

  return (
    <>
      {children}

      <Modal isOpen={isVisible} onClose={handleClose} size="xl">
        <Modal.Content bg="white" borderRadius={24} mx={4} maxHeight="85%">
          <Modal.Body p={0}>
            <VStack>
              {/* Header */}
              <Box bg="ciano.300" px={6} py={8} borderTopRadius={24}>
                <VStack alignItems="center" space={2}>
                  <Text fontSize={40}>🎉</Text>
                  <Text fontSize={24} fontWeight={700} color="white" textAlign="center">
                    App Atualizado!
                  </Text>
                  <Text fontSize={14} fontWeight={500} color="white" opacity={0.9} textAlign="center">
                    Versão {currentVersion}
                  </Text>
                </VStack>
              </Box>

              {/* Content */}
              <ScrollView px={6} py={6} showsVerticalScrollIndicator={false}>
                <VStack space={4}>
                  <Text fontSize={18} fontWeight={700} color="gray.800">
                    {content?.title || 'Novidades'}
                  </Text>

                  {content?.features.map((feature, index) => (
                    <HStack key={index} space={4} alignItems="flex-start">
                      <Box
                        bg="ciano.50"
                        p={3}
                        borderRadius={12}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize={24}>{feature.icon}</Text>
                      </Box>
                      <VStack flex={1} space={1}>
                        <Text fontSize={16} fontWeight={600} color="gray.800">
                          {feature.title}
                        </Text>
                        <Text fontSize={14} fontWeight={400} color="gray.500" lineHeight={20}>
                          {feature.description}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </ScrollView>

              {/* Footer */}
              <Box px={6} pb={6} pt={2}>
                <Button
                  w="100%"
                  variant="primary"
                  size="lg"
                  title="Entendi!"
                  onPress={handleClose}
                />
              </Box>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
}
