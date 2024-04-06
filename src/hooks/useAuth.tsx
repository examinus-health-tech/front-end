import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContest';

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
