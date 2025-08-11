import { StatusBar, BackHandler } from 'react-native';
import { useFonts } from 'expo-font';
import { NativeBaseProvider } from 'native-base';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

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

export default function App() {
  const [splashVideoFinish, setSplashVideoFinish] = useState<boolean>(false);
  const [additionalFontsLoaded, setAdditionalFontsLoaded] = useState<boolean>(false);
  
  // Load essential fonts first
  const [fontsLoaded] = useFonts({
    PoligonRegular: require('@assets/fonts/Poligon-Regular.ttf'),
    PoligonBold: require('@assets/fonts/Poligon-Bold.ttf'),
    PoligonMedium: require('@assets/fonts/Poligon-Medium.ttf'),
  });

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

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <AuthProvider>
        <OnboardingContextProvider>
          <UploadContextProvider>
            <ExamContextProvider>
              <GestureHandlerRootView>
                <BottomSheetModalProvider>
                  <HomeContextProvider>
                    {fontsLoaded && splashVideoFinish ? (
                      <Routes />
                    ) : (
                      <Splash />
                      // <Image source={SplashImg} alt="Vector" resizeMode="cover" height="100%" />
                      // <Flex align="center" justify="center" h="100%" bgColor="white">
                      //   <ActivityIndicator size="large" color="#00B39D" />
                      //   {/* <Image source={Vector} style={{ width: 80, height: 80 }} alt="Vector" /> */}
                      // </Flex>
                    )}
                  </HomeContextProvider>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </ExamContextProvider>
          </UploadContextProvider>
        </OnboardingContextProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
