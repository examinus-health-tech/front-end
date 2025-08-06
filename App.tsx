import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { NativeBaseProvider } from 'native-base';
import { useState } from 'react';

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
  const [fontsLoaded] = useFonts({
    PoligonBlack: require('@assets/fonts/Poligon-Regular.ttf'),
    PoligonBold: require('@assets/fonts/Poligon-Bold.ttf'),
    PoligonExtraBold: require('@assets/fonts/Poligon-ExtraBold.ttf'),
    PoligonSemiBold: require('@assets/fonts/Poligon-SemiBold.ttf'),
    PoligonMedium: require('@assets/fonts/Poligon-Medium.ttf'),
    PoligonRegular: require('@assets/fonts/Poligon-Regular.ttf'),
    PoligonLight: require('@assets/fonts/Poligon-Light.ttf'),
    PoligonThin: require('@assets/fonts/Poligon-Thin.ttf'),
  });

  setTimeout(() => {
    setSplashVideoFinish(true);
  }, 6000);

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
