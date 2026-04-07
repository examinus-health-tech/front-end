/**
 * Testes unitários para medicationUtils
 * Foco: helpers de status retornam valores corretos para cada estado
 */

import { MedicationLogStatus } from 'src/services/medicationService';
import { getStatusColor, getStatusBg, getStatusLabel } from './medicationUtils';

describe('medicationUtils', () => {
  describe('getStatusColor', () => {
    it('deve retornar verde para Taken', () => {
      expect(getStatusColor(MedicationLogStatus.Taken)).toBe('#10B981');
    });

    it('deve retornar amarelo para Skipped', () => {
      expect(getStatusColor(MedicationLogStatus.Skipped)).toBe('#F59E0B');
    });

    it('deve retornar vermelho para Missed', () => {
      expect(getStatusColor(MedicationLogStatus.Missed)).toBe('#EF4444');
    });

    it('deve retornar cinza para Pending', () => {
      expect(getStatusColor(MedicationLogStatus.Pending)).toBe('#9CA3AF');
    });

    it('deve retornar cinza para valor desconhecido', () => {
      expect(getStatusColor(99 as MedicationLogStatus)).toBe('#9CA3AF');
    });
  });

  describe('getStatusBg', () => {
    it('deve retornar background correto para cada status', () => {
      expect(getStatusBg(MedicationLogStatus.Taken)).toBe('#ECFDF5');
      expect(getStatusBg(MedicationLogStatus.Skipped)).toBe('#FFFBEB');
      expect(getStatusBg(MedicationLogStatus.Missed)).toBe('#FEF2F2');
      expect(getStatusBg(MedicationLogStatus.Pending)).toBe('#F9FAFB');
    });
  });

  describe('getStatusLabel', () => {
    it('deve retornar "Tomou" para Taken', () => {
      expect(getStatusLabel(MedicationLogStatus.Taken)).toBe('Tomou');
    });

    it('deve retornar "Pulou" para Skipped', () => {
      expect(getStatusLabel(MedicationLogStatus.Skipped)).toBe('Pulou');
    });

    it('deve retornar "Perdeu" para Missed', () => {
      expect(getStatusLabel(MedicationLogStatus.Missed)).toBe('Perdeu');
    });

    it('deve retornar "Pendente" para Pending', () => {
      expect(getStatusLabel(MedicationLogStatus.Pending)).toBe('Pendente');
    });

    it('deve retornar "Pendente" para valor desconhecido', () => {
      expect(getStatusLabel(99 as MedicationLogStatus)).toBe('Pendente');
    });
  });
});
