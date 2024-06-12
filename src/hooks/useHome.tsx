import { useContext } from 'react';
import { HomeContext } from '../contexts/HomeContext';

export function useHome() {
  const context = useContext(HomeContext);

  return context;
}
