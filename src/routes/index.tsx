import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export function Routes() {
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[50];

  return (
    <NavigationContainer theme={theme}>
      <AuthRoutes />
      {/* <AppRoutes /> */}
    </NavigationContainer>
  );
}
