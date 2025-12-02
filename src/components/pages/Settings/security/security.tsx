import { useRef, useState } from 'react';
import { VStack, ScrollView, IScrollViewProps, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';

// hooks
import { useBiometricAuth } from 'src/hooks/useBiometricAuth';
import { useAuth } from 'src/hooks/useAuth';

export function Security() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const { user } = useAuth();
  const {
    isAvailable,
    isEnabled,
    biometricType,
    enableBiometric,
    disableBiometric,
    isLoading: isBiometricLoading,
  } = useBiometricAuth();

  const [isToggling, setIsToggling] = useState(false);

  const handleBiometricToggle = async (value: boolean) => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      if (value) {
        // Habilitar biometria
        if (!user?.email) {
          toast.show({
            title: 'Erro',
            description: 'Login biometrico so esta disponivel para contas com email.',
            placement: 'top',
            bgColor: 'red.500',
          });
          return;
        }

        // Chama a API - vai pedir confirmacao biometrica automaticamente
        const result = await enableBiometric(user.email);

        if (result.success) {
          toast.show({
            title: 'Biometria habilitada!',
            description: `Agora voce pode fazer login usando ${biometricType?.toLowerCase() || 'biometria'}.`,
            placement: 'top',
            bgColor: 'green.500',
          });
        } else {
          // Nao mostra toast se foi cancelado pelo usuario
          if (result.error !== 'Autenticação cancelada') {
            toast.show({
              title: 'Erro',
              description: result.error || 'Nao foi possivel habilitar a biometria.',
              placement: 'top',
              bgColor: 'red.500',
            });
          }
        }
      } else {
        // Desabilitar biometria
        if (!user?.userId) {
          toast.show({
            title: 'Erro',
            description: 'Usuario nao identificado.',
            placement: 'top',
            bgColor: 'red.500',
          });
          return;
        }

        const success = await disableBiometric(user.userId);

        if (success) {
          toast.show({
            title: 'Biometria desabilitada',
            description: 'O login biometrico foi desativado.',
            placement: 'top',
            bgColor: 'green.500',
          });
        }
      }
    } catch (error: any) {
      console.error('❌ [SECURITY] Erro ao configurar biometria:', error);
      toast.show({
        title: 'Erro',
        description: error?.message || 'Falha ao configurar biometria.',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsToggling(false);
    }
  };

  const getBiometricSubtitle = () => {
    if (!isAvailable) {
      return 'Biometria nao disponivel neste dispositivo';
    }
    if (isEnabled) {
      return `Login com ${biometricType?.toLowerCase() || 'biometria'} esta ativo`;
    }
    return `Ative para entrar usando ${biometricType?.toLowerCase() || 'biometria'}`;
  };

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={16} mx={6}>
        <Header title="Seguranca" handleBackTo={() => navigation.navigate('myAccount')} />

        <VStack mt={4} space={3}>
          {/* Card Lembrar Senha - Em Breve */}
          <Card
            title="Lembrar Senha"
            subTitle="Salvar email para preenchimento automatico"
            variant="description"
            action="switch"
            comingSoon
          />

          {/* Card Biometria - Usando componente Card padronizado */}
          <Card
            title={`Entrar com ${biometricType || 'Biometria'}`}
            subTitle={getBiometricSubtitle()}
            variant="description"
            action="switch"
            switchValue={isEnabled}
            onSwitchChange={handleBiometricToggle}
            disabled={!isAvailable || isBiometricLoading || isToggling}
          />

          <Card
            title="Google Authenticator"
            subTitle="Em desenvolvimento"
            variant="description"
            action="switch"
            comingSoon
          />

          <Card
            title="Meus Dispositivos"
            subTitle="Gerencie seus dispositivos conectados"
            variant="description"
            action="value"
            value="1 dispositivo"
            comingSoon
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
