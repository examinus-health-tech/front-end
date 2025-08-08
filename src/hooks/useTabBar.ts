import { useContext } from 'react';
import { TabBarContext } from '@contexts/TabBarContext';

export function useTabBar() {
  const context = useContext(TabBarContext);
  
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarContextProvider');
  }

  return context;
}