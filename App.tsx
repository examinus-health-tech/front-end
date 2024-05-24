import { StatusBar, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Center, NativeBaseProvider } from 'native-base';

import { THEME } from './src/theme';
import { Routes } from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';
import { OnboardingContextProvider } from '@contexts/OnboardingContext';

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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        <OnboardingContextProvider>
          {fontsLoaded ? (
            <Routes />
          ) : (
            <Center pt={24} alignItems="center">
              <Text>Loading</Text>
            </Center>
          )}
        </OnboardingContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
