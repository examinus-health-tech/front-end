import { useRef, useState, useEffect, useCallback } from 'react';
import { VStack, Text, ScrollView, IScrollViewProps, View, StatusBar } from 'native-base';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';
import { useCustomToast } from 'src/hooks/useCustomToast';
import { useHome } from 'src/hooks/useHome';

// services
import { isFitnessEnabled, setFitnessEnabled } from '@services/fitnessService';

// icons
import { BarbellIcon, CompassTargetIcon } from '@assets/icons';

const DISABLE_FITNESS_TOGGLE = false;

export function Preferences() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { showSuccess, showError } = useCustomToast();
  const { refreshFitnessData } = useHome();

  // Estado do toggle de fitness
  const [fitnessTrackerEnabled, setFitnessTrackerEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar preferência ao montar o componente
  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      setIsLoading(true);
      const enabled = await isFitnessEnabled();
      setFitnessTrackerEnabled(enabled);
      if (__DEV__) console.log('[PREFERENCES] Fitness tracker habilitado:', enabled);
    } catch (error) {
      if (__DEV__) console.error('[PREFERENCES] Erro ao carregar preferências:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handler para toggle do fitness
  const handleFitnessToggle = useCallback(async (value: boolean) => {
    try {
      setFitnessTrackerEnabled(value);
      await setFitnessEnabled(value);

      // Atualiza o contexto global para refletir a mudança imediatamente
      await refreshFitnessData();

      showSuccess({
        title: 'Salvo',
        description: value
          ? 'Rastreador Fitness habilitado.'
          : 'Rastreador Fitness desabilitado.',
        duration: 1500,
      });

      if (__DEV__) console.log('[PREFERENCES] Fitness tracker alterado para:', value);
    } catch (error) {
      if (__DEV__) console.error('[PREFERENCES] Erro ao salvar preferência de fitness:', error);
      // Reverter o estado em caso de erro
      setFitnessTrackerEnabled(!value);
      showError({
        title: 'Erro',
        description: 'Não foi possível salvar a preferência.',
      });
    }
  }, [showSuccess, showError, refreshFitnessData]);

  return (
    <View testID="screen-preferences" flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <VStack pt={16} mx={6}>
        <Header title="Preferências" handleBackTo={() => navigation.goBack()} />
      </VStack>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mb={20}>
          <VStack>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
              Rastreamento de Saúde
            </Text>

            <VStack mt={4} space={3}>
              <Card
                title="Rastreador Fitness"
                subTitle={DISABLE_FITNESS_TOGGLE
                  ? "Temporariamente indisponível. Em breve estará de volta!"
                  : "Acompanhe seus passos, calorias, sono e hidratação diariamente"}
                variant="description"
                action="switch"
                icon={<BarbellIcon color="#3D4966" size="24" />}
                switchValue={DISABLE_FITNESS_TOGGLE ? false : fitnessTrackerEnabled}
                onSwitchChange={DISABLE_FITNESS_TOGGLE ? () => {} : handleFitnessToggle}
                disabled={isLoading || DISABLE_FITNESS_TOGGLE}
              />
              <Card
                title="Metas Inteligentes"
                subTitle="Configure suas metas de hidratação, calorias e passos baseadas no seu perfil"
                variant="description"
                action="chevron"
                icon={<CompassTargetIcon color="#3D4966" size="24" />}
                goTo={() => navigation.navigate('smartGoals')}
              />
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </View>
  );
}
