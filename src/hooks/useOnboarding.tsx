import { useContext } from 'react';
import { OnboardingContext } from '../contexts/OnboardingContext';

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  return context;
}
