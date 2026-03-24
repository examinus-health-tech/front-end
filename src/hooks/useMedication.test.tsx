import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useMedication } from './useMedication';
import { MedicationContext } from '../contexts/MedicationContext';

describe('useMedication', () => {
  const mockRefreshDashboard = jest.fn();
  const mockRefreshMedications = jest.fn();
  const mockRefreshTodayLogs = jest.fn();
  const mockLoadAdherence = jest.fn();
  const mockAddMedication = jest.fn();
  const mockEditMedication = jest.fn();
  const mockRemoveMedication = jest.fn();
  const mockRegisterDose = jest.fn();
  const mockClearMedicationData = jest.fn();

  const mockContextValue = {
    dashboard: {
      totalActive: 5,
      todayProgress: { taken: 3, total: 5 },
      adherenceRate: 85,
    },
    medications: [
      { id: 'med-1', name: 'Medicamento A', dosage: '500mg', frequency: 'daily' },
      { id: 'med-2', name: 'Medicamento B', dosage: '200mg', frequency: 'twice_daily' },
    ],
    todayLogs: [
      { id: 'log-1', medicationId: 'med-1', status: 'taken', timestamp: '2026-03-20T08:00:00Z' },
    ],
    adherence: { month: 3, year: 2026, rate: 90 },
    isLoading: false,
    refreshDashboard: mockRefreshDashboard,
    refreshMedications: mockRefreshMedications,
    refreshTodayLogs: mockRefreshTodayLogs,
    loadAdherence: mockLoadAdherence,
    addMedication: mockAddMedication,
    editMedication: mockEditMedication,
    removeMedication: mockRemoveMedication,
    registerDose: mockRegisterDose,
    clearMedicationData: mockClearMedicationData,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MedicationContext.Provider value={mockContextValue as any}>
      {children}
    </MedicationContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do MedicationContextProvider', () => {
    it('deve retornar o contexto de medicamentos', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar dados do dashboard', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(result.current?.dashboard).toEqual({
        totalActive: 5,
        todayProgress: { taken: 3, total: 5 },
        adherenceRate: 85,
      });
    });

    it('deve retornar lista de medicamentos', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(result.current?.medications).toHaveLength(2);
      expect(result.current?.medications[0].name).toBe('Medicamento A');
    });

    it('deve retornar logs de hoje', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(result.current?.todayLogs).toHaveLength(1);
      expect(result.current?.todayLogs[0].status).toBe('taken');
    });

    it('deve retornar dados de aderencia', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(result.current?.adherence).toEqual({ month: 3, year: 2026, rate: 90 });
    });

    it('deve retornar estado de carregamento', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(result.current?.isLoading).toBe(false);
    });

    it('deve retornar funcao refreshDashboard', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.refreshDashboard).toBe('function');
    });

    it('deve retornar funcao refreshMedications', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.refreshMedications).toBe('function');
    });

    it('deve retornar funcao refreshTodayLogs', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.refreshTodayLogs).toBe('function');
    });

    it('deve retornar funcao loadAdherence', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.loadAdherence).toBe('function');
    });

    it('deve retornar funcao addMedication', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.addMedication).toBe('function');
    });

    it('deve retornar funcao editMedication', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.editMedication).toBe('function');
    });

    it('deve retornar funcao removeMedication', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.removeMedication).toBe('function');
    });

    it('deve retornar funcao registerDose', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.registerDose).toBe('function');
    });

    it('deve retornar funcao clearMedicationData', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      expect(typeof result.current?.clearMedicationData).toBe('function');
    });

    it('deve chamar refreshDashboard corretamente', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      result.current?.refreshDashboard();

      expect(mockRefreshDashboard).toHaveBeenCalledTimes(1);
    });

    it('deve chamar addMedication com dados corretos', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      const medicationData = { name: 'Novo Med', dosage: '100mg' };
      result.current?.addMedication(medicationData as any);

      expect(mockAddMedication).toHaveBeenCalledWith(medicationData);
    });

    it('deve chamar registerDose com dados corretos', () => {
      const { result } = renderHook(() => useMedication(), { wrapper });

      const doseData = { medicationId: 'med-1', status: 'taken' };
      result.current?.registerDose(doseData as any);

      expect(mockRegisterDose).toHaveBeenCalledWith(doseData);
    });
  });

  describe('quando usado fora do MedicationContextProvider', () => {
    it('deve retornar contexto vazio sem lancar erro', () => {
      // useMedication nao lanca erro quando fora do provider, retorna contexto vazio
      const { result } = renderHook(() => useMedication());

      // O contexto padrao e um objeto vazio ({} as MedicationContextDataProps)
      expect(result.current).toBeDefined();
    });
  });

  describe('com diferentes estados de contexto', () => {
    it('deve retornar dashboard null quando nao ha dados', () => {
      const emptyContext = {
        ...mockContextValue,
        dashboard: null,
        medications: [],
        todayLogs: [],
        adherence: null,
      };

      const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
        <MedicationContext.Provider value={emptyContext as any}>
          {children}
        </MedicationContext.Provider>
      );

      const { result } = renderHook(() => useMedication(), { wrapper: emptyWrapper });

      expect(result.current?.dashboard).toBeNull();
      expect(result.current?.medications).toEqual([]);
      expect(result.current?.todayLogs).toEqual([]);
      expect(result.current?.adherence).toBeNull();
    });

    it('deve retornar isLoading true durante carregamento', () => {
      const loadingContext = {
        ...mockContextValue,
        isLoading: true,
      };

      const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <MedicationContext.Provider value={loadingContext as any}>
          {children}
        </MedicationContext.Provider>
      );

      const { result } = renderHook(() => useMedication(), { wrapper: loadingWrapper });

      expect(result.current?.isLoading).toBe(true);
    });
  });
});
