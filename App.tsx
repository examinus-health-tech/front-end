import { ActivityIndicator, StatusBar, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Center, Flex, NativeBaseProvider } from 'native-base';

import { THEME } from './src/theme';
import { Routes } from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';
import { OnboardingContextProvider } from '@contexts/OnboardingContext';
import { UploadContextProvider } from '@contexts/UploadContext';
import { HomeContextProvider } from '@contexts/HomeContext';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PoligonBlack: require('@assets/fonts/Poligon-Regular.ttf'),
    PoligonBold: require('@assets/fonts/Poligon-Bold.ttf'),
    PoligonExtraBold: require('@assets/fonts/Poligon-ExtraBold.ttf'),
    PoligonSemiBold: require('@assets/fonts/Poligon-SemiBold.ttf'),
    PoligonMedium: require('@assets/fonts/Poligon-Medium.ttf'),
    PoligonRegular: require('@assets/fonts/Poligon-Regular.ttf'),
    PoligonLight: require('@assets/fonts/Poligon-Light.ttf'),
    PoligonThin: require('@assets/fonts/Poligon-Thin.ttf'),
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AuthContextProvider>
        <OnboardingContextProvider>
          <UploadContextProvider>
            <HomeContextProvider>
              {fontsLoaded ? (
                <Routes />
              ) : (
                <Flex align="center" justify="center" h="100%">
                  <ActivityIndicator size="large" color="#00B39D" />
                </Flex>
              )}
            </HomeContextProvider>
          </UploadContextProvider>
        </OnboardingContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
