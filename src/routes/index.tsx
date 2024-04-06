import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { AuthContextProvider } from '../contexts/AuthContest';
import { useAuth } from '../hooks/useAuth';

export function Routes() {
  const { colors } = useTheme();

  const { user } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[50];

  return (
    <NavigationContainer theme={theme}>
      <AuthContextProvider>
        <AuthRoutes />
        {/* <AppRoutes /> */}
      </AuthContextProvider>
    </NavigationContainer>
  );
}
