import { StatusBar, Text } from 'react-native';
import { useFonts } from '@expo-google-fonts/roboto';
import { Center, NativeBaseProvider } from 'native-base';

import { THEME } from './src/theme';
import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    PoligonBlack: require('./src/assets/fonts/Poligon-Regular.ttf'),
    PoligonBold: require('./src/assets/fonts/Poligon-Bold.ttf'),
    PoligonExtraBold: require('./src/assets/fonts/Poligon-ExtraBold.ttf'),
    PoligonSemiBold: require('./src/assets/fonts/Poligon-SemiBold.ttf'),
    PoligonMedium: require('./src/assets/fonts/Poligon-Medium.ttf'),
    PoligonRegular: require('./src/assets/fonts/Poligon-Regular.ttf'),
    PoligonLight: require('./src/assets/fonts/Poligon-Light.ttf'),
    PoligonThin: require('./src/assets/fonts/Poligon-Thin.ttf'),
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? (
        <Routes />
      ) : (
        <Center pt={24} alignItems="center">
          <Text>Loading</Text>
        </Center>
      )}
    </NativeBaseProvider>
  );
}
