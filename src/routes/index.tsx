import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { useAuth } from '../hooks/useAuth';

export function Routes() {
  const { colors } = useTheme();

  const { user } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[50];

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      {user.userId ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
