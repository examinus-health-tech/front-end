import { useEffect, useState } from 'react';
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { ForceUpdateScreen } from '@components/pages/ForceUpdate';
import { checkForceUpdate, VersionInfo } from '@services/versionService';

export function Routes() {
  const { user, isAuthReady } = useAuth();
  const [isCheckingVersion, setIsCheckingVersion] = useState(true);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    checkAppVersion();
  }, []);

  async function checkAppVersion() {
    try {
      const result = await checkForceUpdate();
      setNeedsUpdate(result.needsUpdate);
      setVersionInfo(result.versionInfo);
    } catch (error) {
      console.log('Erro ao verificar versão:', error);
    } finally {
      setIsCheckingVersion(false);
    }
  }

  // Enquanto está verificando autenticação inicial ou versão, mostrar loading
  // Usa isAuthReady para não desmontar rotas durante operações de login
  if (!isAuthReady || isCheckingVersion) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#0CC1AF" />
      </View>
    );
  }

  // Se precisa atualizar, mostrar tela de force update
  if (needsUpdate && versionInfo) {
    return (
      <ForceUpdateScreen
        message={versionInfo.updateMessage}
      />
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
}
