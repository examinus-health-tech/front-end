import { useContext } from 'react';
import { MedicationContext } from '../contexts/MedicationContext';

export function useMedication() {
  const context = useContext(MedicationContext);

  return context;
}
