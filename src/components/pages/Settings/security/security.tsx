import { useRef, useState, useEffect } from 'react';
import { VStack, ScrollView, IScrollViewProps } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';

// hooks
import { useBiometricAuth } from 'src/hooks/useBiometricAuth';
import { useAuth } from 'src/hooks/useAuth';
import { useCustomToast } from 'src/hooks/useCustomToast';

export function Security() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { showSuccess, showError } = useCustomToast();

  const { user } = useAuth();
  const {
    isAvailable,
    isEnabled,
    biometricType,
    enableBiometric,
    disableBiometric,
    checkBiometricEnabled,
    isLoading: isBiometricLoading,
  } = useBiometricAuth();

  const [isToggling, setIsToggling] = useState(false);

  // Re-verifica o status da biometria quando o usuário muda
  useEffect(() => {
    if (user?.userId) {
      checkBiometricEnabled(user.userId);
    }
  }, [user?.userId, checkBiometricEnabled]);

  const handleBiometricToggle = async (value: boolean) => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      if (value) {
        // Habilitar biometria
        if (!user?.email) {
          showError({
            title: 'Erro',
            description: 'Login biometrico so esta disponivel para contas com email.',
          });
          return;
        }

        // Chama a API - vai pedir confirmacao biometrica automaticamente
        const result = await enableBiometric(user.email);

        if (result.success) {
          showSuccess({
            title: 'Biometria habilitada!',
            description: `Agora voce pode fazer login usando ${biometricType?.toLowerCase() || 'biometria'}.`,
          });
        } else {
          // Nao mostra toast se foi cancelado pelo usuario
          if (result.error !== 'Autenticação cancelada') {
            showError({
              title: 'Erro',
              description: result.error || 'Nao foi possivel habilitar a biometria.',
            });
          }
        }
      } else {
        // Desabilitar biometria
        if (!user?.userId) {
          showError({
            title: 'Erro',
            description: 'Usuario nao identificado.',
          });
          return;
        }

        const success = await disableBiometric(user.userId);

        if (success) {
          showSuccess({
            title: 'Biometria desabilitada',
            description: 'O login biometrico foi desativado.',
          });
        }
      }
    } catch (error: any) {
      console.error('❌ [SECURITY] Erro ao configurar biometria:', error);
      showError({
        title: 'Erro',
        description: error?.message || 'Falha ao configurar biometria.',
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
        <Header title="Segurança" handleBackTo={() => navigation.navigate('myAccount')} />

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
