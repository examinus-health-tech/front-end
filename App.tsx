import { StatusBar, BackHandler } from 'react-native';
import { useFonts } from 'expo-font';
import { NativeBaseProvider } from 'native-base';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';
import { OneSignal, LogLevel } from 'react-native-onesignal';

OneSignal.initialize('c101b9a0-32fe-43ad-8a87-820c766b136e');
OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.Notifications.requestPermission(true);

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

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/services/navigationService';

export default function App() {
  const [ready, setReady] = useState(false);
  const [splashVideoFinish, setSplashVideoFinish] = useState<boolean>(false);
  const [additionalFontsLoaded, setAdditionalFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const onClick = (event: any) => {
      const data = event?.notification?.additionalData;

      console.log('Notification clicked:', JSON.stringify(event, null, 2));

      if (!data) return;

      if (navigationRef.isReady()) {
        navigationRef.navigate('notifications', {
          notificationId: data?.notificationId,
          type: data?.type,
        });
      } else {
        console.log('Navigation not ready yet, cannot navigate.');
      }
    };

    OneSignal.Notifications.addEventListener('click', onClick);

    // cleanup pra não acumular listeners em dev
    return () => {
      OneSignal.Notifications.removeEventListener('click', onClick);
    };
  }, []);

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
          if (!cancelled) setReady(true);
          return;
        }
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          return;
        }
      } catch (e) {
        console.warn('Update check failed:', e);
      } finally {
        if (!cancelled) setReady(true);
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
    <>
      <NavigationContainer ref={navigationRef}>
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
      </NavigationContainer>
    </>
  );
}
