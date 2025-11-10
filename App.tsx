import { StatusBar, BackHandler, LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import { NativeBaseProvider } from 'native-base';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';

// Desabilitar warnings e erros na tela (apenas em desenvolvimento)
if (__DEV__) {
  LogBox.ignoreAllLogs(true);
  console.disableYellowBox = true;
}

// Polyfill for BackHandler.removeEventListener (deprecated in RN 0.79)
if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = (eventType: string, listener: () => boolean) => {
    const subscription = BackHandler.addEventListener(eventType, listener);
    return subscription?.remove();
  };
}

import { THEME } from './src/theme';
import { Routes } from '@routes/index';
import { AuthProvider } from '@contexts/AuthContext';
import { OnboardingContextProvider } from '@contexts/OnboardingContext';
import { UploadContextProvider } from '@contexts/UploadContext';
import { HomeContextProvider } from '@contexts/HomeContext';
import { Splash } from '@components/pages/Splash/splash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ExamContextProvider } from '@contexts/ExamContext';
import ErrorBoundary from '@components/ErrorBoundary';

export default function App() {
  const [ready, setReady] = useState(false);
  const [splashVideoFinish, setSplashVideoFinish] = useState<boolean>(false);
  const [additionalFontsLoaded, setAdditionalFontsLoaded] = useState<boolean>(false);

  // Load essential fonts first
  const [fontsLoaded] = useFonts({
    PoligonRegular: require('@assets/fonts/Poligon-Regular.ttf'),
    PoligonBold: require('@assets/fonts/Poligon-Bold.ttf'),
    PoligonMedium: require('@assets/fonts/Poligon-Medium.ttf'),
  });

  // Check for updates and handle app readiness
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (__DEV__) {
          console.log('🔧 [EAS Update] Modo desenvolvimento - updates desabilitados');
          if (!cancelled) setReady(true);
          return;
        }

        // Log runtime info detalhado
        const runtimeVersion = Updates.runtimeVersion;
        const channel = Updates.channel;
        const updateId = Updates.updateId;
        const createdAt = Updates.createdAt;

        console.log('📱 [EAS Update] Informações do app:');
        console.log('   - Runtime Version:', runtimeVersion);
        console.log('   - Channel:', channel);
        console.log('   - Update ID atual:', updateId);
        console.log('   - Criado em:', createdAt);

        console.log('🔍 [EAS Update] Verificando atualizações...');
        const update = await Updates.checkForUpdateAsync();

        console.log('📊 [EAS Update] Resultado da verificação:');
        console.log('   - Update disponível:', update.isAvailable);

        if (update.manifest) {
          console.log('   - Manifest recebido:', JSON.stringify(update.manifest).substring(0, 200) + '...');
        }

        if (update.isAvailable) {
          console.log('✅ [EAS Update] Atualização disponível! Baixando...');

          const fetchResult = await Updates.fetchUpdateAsync();

          console.log('✅ [EAS Update] Download completo!');
          console.log('   - É novo:', fetchResult.isNew);

          if (fetchResult.manifest) {
            console.log('   - Manifest baixado:', JSON.stringify(fetchResult.manifest).substring(0, 200) + '...');
          }

          if (fetchResult.isNew) {
            console.log('🔄 [EAS Update] Reiniciando app para aplicar update...');
            await Updates.reloadAsync();
            return;
          } else {
            console.log('ℹ️ [EAS Update] Update já estava baixado anteriormente');
          }
        } else {
          console.log('ℹ️ [EAS Update] Nenhuma atualização disponível - app está atualizado');
        }
      } catch (e: any) {
        console.error('❌ [EAS Update] Erro ao verificar updates:');
        console.error('   - Mensagem:', e?.message || 'Erro desconhecido');
        console.error('   - Código:', e?.code || 'N/A');

        if (e?.stack) {
          console.error('   - Stack:', e.stack.substring(0, 300));
        }

        // Continuar inicialização mesmo com erro
        console.log('⚠️ [EAS Update] Continuando inicialização do app apesar do erro');
      } finally {
        if (!cancelled) {
          console.log('✅ [EAS Update] Finalizando verificação - setando ready=true');
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load additional fonts after app is ready
  useEffect(() => {
    if (fontsLoaded) {
      Font.loadAsync({
        PoligonBlack: require('@assets/fonts/Poligon-Regular.ttf'),
        PoligonExtraBold: require('@assets/fonts/Poligon-ExtraBold.ttf'),
        PoligonSemiBold: require('@assets/fonts/Poligon-SemiBold.ttf'),
        PoligonLight: require('@assets/fonts/Poligon-Light.ttf'),
        PoligonThin: require('@assets/fonts/Poligon-Thin.ttf'),
      }).then(() => {
        setAdditionalFontsLoaded(true);
      });
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVideoFinish(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Hide splash screen when ready and fonts are loaded
  useEffect(() => {
    if (ready && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [ready, fontsLoaded]);

  if (!ready || !fontsLoaded) {
    return;
  }

  return (
    <ErrorBoundary>
      <NativeBaseProvider theme={THEME}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <AuthProvider>
          <OnboardingContextProvider>
            <UploadContextProvider>
              <ExamContextProvider>
                <GestureHandlerRootView>
                  <BottomSheetModalProvider>
                    <HomeContextProvider>
                      {additionalFontsLoaded && splashVideoFinish ? <Routes /> : <Splash />}
                    </HomeContextProvider>
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </ExamContextProvider>
            </UploadContextProvider>
          </OnboardingContextProvider>
        </AuthProvider>
      </NativeBaseProvider>
    </ErrorBoundary>
  );
}
