import React from 'react';
import { RefreshControl, RefreshControlProps, Platform } from 'react-native';

interface CustomRefreshControlProps extends Omit<RefreshControlProps, 'refreshing' | 'onRefresh'> {
  refreshing: boolean;
  onRefresh: () => void;
}

/**
 * RefreshControl customizado e discreto para pull-to-refresh
 * Usa cores sutis e configurações otimizadas para uma experiência mais elegante
 */
export function CustomRefreshControl({ refreshing, onRefresh, ...rest }: CustomRefreshControlProps) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      // Cores discretas mas visíveis
      tintColor="#718096" // Cinza médio para iOS
      colors={['#718096']} // Cinza médio para Android
      progressBackgroundColor="#FFFFFF"
      {...rest}
    />
  );
}
