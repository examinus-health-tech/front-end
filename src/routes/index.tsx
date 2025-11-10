import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { linking } from '../config/linking';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { useAuth } from '../hooks/useAuth';

export function Routes() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[50];

  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        console.log('✅ [Navigation] Navigation ready');
      }}
    >
      {user ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
