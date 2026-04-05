import { ReactNode, createContext, useState, useCallback } from 'react';
import {
  MedicationDashboardDTO,
  MedicationLogDTO,
  MedicationDTO,
  MedicationAdherenceDTO,
  MedicationRequestDTO,
  MedicationLogRequestDTO,
  MedicationLogStatus,
  getMedicationDashboard,
  getActiveMedications,
  createMedication,
  updateMedication,
  deactivateMedication,
  logDose,
  getTodayLogs,
  getAdherence,
} from 'src/services/medicationService';
import {
  scheduleMedicationNotifications,
  cancelMedicationNotifications,
  rescheduleAllMedicationNotifications,
} from 'src/services/medicationNotificationService';

export type MedicationContextDataProps = {
  // State
  dashboard: MedicationDashboardDTO | null;
  medications: MedicationDTO[];
  todayLogs: MedicationLogDTO[];
  adherence: MedicationAdherenceDTO | null;
  isLoading: boolean;

  // Actions
  refreshDashboard: () => Promise<void>;
  refreshMedications: () => Promise<void>;
  refreshTodayLogs: () => Promise<void>;
  loadAdherence: (month: number, year: number) => Promise<void>;
  addMedication: (data: MedicationRequestDTO) => Promise<MedicationDTO>;
  editMedication: (id: string, data: MedicationRequestDTO) => Promise<MedicationDTO>;
  removeMedication: (id: string) => Promise<boolean>;
  registerDose: (data: MedicationLogRequestDTO) => Promise<MedicationLogDTO | null>;
  clearMedicationData: () => void;
};

type MedicationContextProviderProps = {
  children: ReactNode;
};

export const MedicationContext = createContext<MedicationContextDataProps>(
  {} as MedicationContextDataProps
);

export function MedicationContextProvider({ children }: MedicationContextProviderProps) {
  const [dashboard, setDashboard] = useState<MedicationDashboardDTO | null>(null);
  const [medications, setMedications] = useState<MedicationDTO[]>([]);
  const [todayLogs, setTodayLogs] = useState<MedicationLogDTO[]>([]);
  const [adherence, setAdherence] = useState<MedicationAdherenceDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMedicationDashboard();
      setDashboard(data);
      if (data) {
        setMedications(data.activeMedications);
        setTodayLogs(data.todayLogs);
        // Sync notifications with active medications
        try {
          await rescheduleAllMedicationNotifications(data.activeMedications);
        } catch (e) {
          if (__DEV__) console.warn('[MedicationContext] Erro ao sincronizar notificacoes:', e);
        }
      }
    } catch (error) {
      if (__DEV__) console.error('[MedicationContext] Erro ao buscar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshMedications = useCallback(async () => {
    try {
      const data = await getActiveMedications();
      setMedications(data);
    } catch (error) {
      if (__DEV__) console.error('[MedicationContext] Erro ao buscar medicamentos:', error);
    }
  }, []);

  const refreshTodayLogs = useCallback(async () => {
    try {
      const data = await getTodayLogs();
      setTodayLogs(data);
    } catch (error) {
      if (__DEV__) console.error('[MedicationContext] Erro ao buscar logs do dia:', error);
    }
  }, []);

  const loadAdherence = useCallback(async (month: number, year: number) => {
    try {
      const data = await getAdherence(month, year);
      setAdherence(data);
    } catch (error) {
      if (__DEV__) console.error('[MedicationContext] Erro ao buscar adesao:', error);
    }
  }, []);

  const addMedication = useCallback(async (data: MedicationRequestDTO): Promise<MedicationDTO> => {
    const med = await createMedication(data);
    try {
      await scheduleMedicationNotifications(med);
    } catch (e) {
      if (__DEV__) console.warn('[MedicationContext] Erro ao agendar notificacoes:', e);
    }
    await refreshDashboard();
    return med;
  }, [refreshDashboard]);

  const editMedication = useCallback(async (id: string, data: MedicationRequestDTO): Promise<MedicationDTO> => {
    const med = await updateMedication(id, data);
    try {
      await scheduleMedicationNotifications(med);
    } catch (e) {
      if (__DEV__) console.warn('[MedicationContext] Erro ao reagendar notificacoes:', e);
    }
    await refreshDashboard();
    return med;
  }, [refreshDashboard]);

  const removeMedication = useCallback(async (id: string): Promise<boolean> => {
    const success = await deactivateMedication(id);
    if (success) {
      try {
        await cancelMedicationNotifications(id);
      } catch (e) {
        if (__DEV__) console.warn('[MedicationContext] Erro ao cancelar notificacoes:', e);
      }
      await refreshDashboard();
    }
    return success;
  }, [refreshDashboard]);

  const registerDose = useCallback(async (data: MedicationLogRequestDTO): Promise<MedicationLogDTO | null> => {
    const log = await logDose(data);

    // Optimistically update todayLogs
    setTodayLogs(prev =>
      prev.map(l =>
        l.medicationId === data.medicationId && l.scheduledTime === data.scheduledTime
          ? { ...l, status: data.status, actionTime: new Date().toISOString(), id: log?.id || l.id }
          : l
      )
    );

    // Update remaining quantity in medications list if taken
    if (data.status === MedicationLogStatus.Taken) {
      setMedications(prev =>
        prev.map(m => {
          if (m.id === data.medicationId && m.remainingQuantity != null && m.remainingQuantity > 0) {
            const newRemaining = m.remainingQuantity - 1;
            return {
              ...m,
              remainingQuantity: newRemaining,
              needsRefill: m.refillAlertThreshold != null ? newRemaining <= m.refillAlertThreshold : m.needsRefill,
            };
          }
          return m;
        })
      );
    }

    return log;
  }, []);

  const clearMedicationData = useCallback(() => {
    setDashboard(null);
    setMedications([]);
    setTodayLogs([]);
    setAdherence(null);
  }, []);

  return (
    <MedicationContext.Provider
      value={{
        dashboard,
        medications,
        todayLogs,
        adherence,
        isLoading,
        refreshDashboard,
        refreshMedications,
        refreshTodayLogs,
        loadAdherence,
        addMedication,
        editMedication,
        removeMedication,
        registerDose,
        clearMedicationData,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
}
