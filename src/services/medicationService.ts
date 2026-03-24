import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

// Trocar para false quando backend estiver pronto
const USE_MOCK = true;

// Storage keys
export const MEDICATION_CACHE_KEY = '@examinus:medication_dashboard';
const MOCK_MEDS_KEY = '@examinus:mock_medications';
const MOCK_LOGS_KEY = '@examinus:mock_medication_logs';

// Enums
export enum MedicationForm {
  Comprimido = 1,
  Gotas = 2,
  Injecao = 3,
  Pomada = 4,
  Capsula = 5,
  Xarope = 6,
}

export enum MedicationFrequencyType {
  Daily = 1,
  SpecificDays = 2,
}

export enum MedicationLogStatus {
  Pending = 0,
  Taken = 1,
  Skipped = 2,
  Missed = 3,
}

// Form labels for display
export const MedicationFormLabels: Record<MedicationForm, string> = {
  [MedicationForm.Comprimido]: 'Comprimido',
  [MedicationForm.Gotas]: 'Gotas',
  [MedicationForm.Injecao]: 'Injeção',
  [MedicationForm.Pomada]: 'Pomada',
  [MedicationForm.Capsula]: 'Cápsula',
  [MedicationForm.Xarope]: 'Xarope',
};

// Mapeamento de ícones por forma — usado nos componentes com ícones SVG do Examinus
// Os componentes importam os ícones diretamente de @assets/icons
// Este mapeamento identifica qual ícone usar para cada forma
export const MedicationFormIconNames: Record<MedicationForm, string> = {
  [MedicationForm.Comprimido]: 'pill',
  [MedicationForm.Gotas]: 'waterDropFilled',
  [MedicationForm.Injecao]: 'syringe',
  [MedicationForm.Pomada]: 'bandAid',
  [MedicationForm.Capsula]: 'pillSquareDouble',
  [MedicationForm.Xarope]: 'flaskRound',
};

// DTOs
export interface MedicationDTO {
  id: string;
  name: string;
  dosage: string;
  form: MedicationForm;
  formDescription?: string;
  frequencyType: MedicationFrequencyType;
  frequencyDays?: number[];
  scheduleTimes: string[];
  instructions?: string;
  totalQuantity?: number;
  remainingQuantity?: number;
  refillAlertThreshold?: number;
  needsRefill: boolean;
  isActive: boolean;
  createdDate: string;
}

export interface MedicationLogDTO {
  id: string;
  medicationId: string;
  medicationName: string;
  medicationDosage: string;
  medicationForm: MedicationForm;
  medicationFormDescription?: string;
  scheduledTime: string;
  actionTime?: string;
  status: MedicationLogStatus;
}

export interface MedicationDashboardDTO {
  activeMedications: MedicationDTO[];
  todayLogs: MedicationLogDTO[];
  needRefill: MedicationDTO[];
  todayAdherencePercent: number;
}

export interface MedicationAdherenceDTO {
  dailyAdherence: Record<string, number>;
  monthlyAverage: number;
  byMedication: MedicationAdherenceByMedDTO[];
}

export interface MedicationAdherenceByMedDTO {
  medicationId: string;
  medicationName: string;
  adherencePercent: number;
  totalDoses: number;
  takenDoses: number;
}

export interface MedicationRequestDTO {
  name: string;
  dosage: string;
  form: MedicationForm;
  frequencyType: MedicationFrequencyType;
  frequencyDays?: number[];
  scheduleTimes: string[];
  instructions?: string;
  totalQuantity?: number;
  refillAlertThreshold?: number;
}

export interface MedicationLogRequestDTO {
  medicationId: string;
  scheduledTime: string;
  status: MedicationLogStatus;
}

// ============================================================
// MOCK: Helpers para persistir dados localmente
// ============================================================

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

async function getMockMeds(): Promise<MedicationDTO[]> {
  try {
    const raw = await AsyncStorage.getItem(MOCK_MEDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

async function saveMockMeds(meds: MedicationDTO[]): Promise<void> {
  await AsyncStorage.setItem(MOCK_MEDS_KEY, JSON.stringify(meds));
}

async function getMockLogs(): Promise<MedicationLogDTO[]> {
  try {
    const raw = await AsyncStorage.getItem(MOCK_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

async function saveMockLogs(logs: MedicationLogDTO[]): Promise<void> {
  await AsyncStorage.setItem(MOCK_LOGS_KEY, JSON.stringify(logs));
}

/** Seed initial mock data if storage is empty */
async function ensureSeedData(): Promise<void> {
  const existing = await getMockMeds();
  if (existing.length > 0) return;

  const now = new Date();
  const seedMeds: MedicationDTO[] = [
    {
      id: uuid(),
      name: 'Losartana',
      dosage: '50mg',
      form: MedicationForm.Comprimido,
      formDescription: 'Comprimido',
      frequencyType: MedicationFrequencyType.Daily,
      scheduleTimes: ['08:00', '20:00'],
      instructions: 'Tomar com agua, de preferencia no mesmo horario.',
      totalQuantity: 60,
      remainingQuantity: 8,
      refillAlertThreshold: 10,
      needsRefill: true,
      isActive: true,
      createdDate: new Date(now.getTime() - 30 * 86400000).toISOString(),
    },
    {
      id: uuid(),
      name: 'Vitamina D',
      dosage: '2000 UI',
      form: MedicationForm.Capsula,
      formDescription: 'Cápsula',
      frequencyType: MedicationFrequencyType.Daily,
      scheduleTimes: ['12:00'],
      instructions: 'Tomar apos o almoco.',
      totalQuantity: 30,
      remainingQuantity: 22,
      refillAlertThreshold: 5,
      needsRefill: false,
      isActive: true,
      createdDate: new Date(now.getTime() - 15 * 86400000).toISOString(),
    },
    {
      id: uuid(),
      name: 'Dipirona',
      dosage: '20 gotas',
      form: MedicationForm.Gotas,
      formDescription: 'Gotas',
      frequencyType: MedicationFrequencyType.SpecificDays,
      frequencyDays: [1, 3, 5], // Seg, Qua, Sex
      scheduleTimes: ['09:00'],
      instructions: 'Apenas se houver dor. Nao ultrapassar 4x ao dia.',
      totalQuantity: undefined,
      remainingQuantity: undefined,
      refillAlertThreshold: undefined,
      needsRefill: false,
      isActive: true,
      createdDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
    },
  ];

  await saveMockMeds(seedMeds);
  if (__DEV__) console.log('[MEDICATION_MOCK] Seed data criado com', seedMeds.length, 'medicamentos');
}

/** Build today's logs from active meds + persisted logs */
async function buildTodayLogs(): Promise<MedicationLogDTO[]> {
  const meds = await getMockMeds();
  const allLogs = await getMockLogs();
  const today = todayStr();
  const todayDow = new Date().getDay();
  const now = new Date();
  const result: MedicationLogDTO[] = [];

  for (const med of meds) {
    if (!med.isActive) continue;

    // Check if scheduled today
    if (med.frequencyType === MedicationFrequencyType.SpecificDays) {
      if (!med.frequencyDays?.includes(todayDow)) continue;
    }

    for (const time of med.scheduleTimes) {
      const scheduledTime = `${today}T${time}:00.000Z`;

      // Check if a log already exists for this slot
      const existing = allLogs.find(
        l => l.medicationId === med.id && l.scheduledTime === scheduledTime
      );

      if (existing) {
        result.push(existing);
      } else {
        // Auto-determine status: missed if >30min past
        const [h, m] = time.split(':').map(Number);
        const scheduled = new Date(now);
        scheduled.setHours(h, m, 0, 0);
        const diffMin = (now.getTime() - scheduled.getTime()) / 60000;

        result.push({
          id: '',
          medicationId: med.id,
          medicationName: med.name,
          medicationDosage: med.dosage,
          medicationForm: med.form,
          medicationFormDescription: MedicationFormLabels[med.form],
          scheduledTime,
          actionTime: undefined,
          status: diffMin > 30 ? MedicationLogStatus.Missed : MedicationLogStatus.Pending,
        });
      }
    }
  }

  return result.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
}

function buildAdherenceMock(month: number, year: number, meds: MedicationDTO[]): MedicationAdherenceDTO {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const dailyAdherence: Record<string, number> = {};

  // Generate random-ish but realistic adherence for past days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (date > today) break;

    const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    // Weighted random: mostly 80-100, sometimes lower
    const rand = Math.random();
    if (rand > 0.85) {
      dailyAdherence[key] = Math.round(30 + Math.random() * 30); // 30-60%
    } else if (rand > 0.7) {
      dailyAdherence[key] = Math.round(60 + Math.random() * 20); // 60-80%
    } else {
      dailyAdherence[key] = Math.round(80 + Math.random() * 20); // 80-100%
    }
  }

  const values = Object.values(dailyAdherence);
  const monthlyAverage = values.length > 0
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10
    : 0;

  const byMedication: MedicationAdherenceByMedDTO[] = meds.filter(m => m.isActive).map(med => {
    const total = daysInMonth * med.scheduleTimes.length;
    const percent = 60 + Math.random() * 35;
    const taken = Math.round((percent / 100) * total);
    return {
      medicationId: med.id,
      medicationName: med.name,
      adherencePercent: Math.round(percent * 10) / 10,
      totalDoses: total,
      takenDoses: taken,
    };
  });

  return { dailyAdherence, monthlyAverage, byMedication };
}

// ============================================================
// API / Mock functions
// ============================================================

export async function getMedicationDashboard(): Promise<MedicationDashboardDTO | null> {
  if (USE_MOCK) {
    await ensureSeedData();
    const meds = (await getMockMeds()).filter(m => m.isActive);
    const todayLogs = await buildTodayLogs();
    const needRefill = meds.filter(m => m.needsRefill);
    const total = todayLogs.length;
    const taken = todayLogs.filter(l => l.status === MedicationLogStatus.Taken).length;
    const adherence = total > 0 ? Math.round((taken / total) * 1000) / 10 : 0;

    return {
      activeMedications: meds,
      todayLogs,
      needRefill,
      todayAdherencePercent: adherence,
    };
  }

  try {
    const response = await api.get<{ success: boolean; data: MedicationDashboardDTO }>('medication/dashboard');
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    if (__DEV__) console.error('[MEDICATION] Erro ao buscar dashboard:', error);
    return null;
  }
}

export async function getActiveMedications(): Promise<MedicationDTO[]> {
  if (USE_MOCK) {
    await ensureSeedData();
    return (await getMockMeds()).filter(m => m.isActive);
  }

  try {
    const response = await api.get<{ success: boolean; data: MedicationDTO[] }>('medication');
    return response.data.data;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao buscar medicamentos:', error);
    return [];
  }
}

export async function createMedication(data: MedicationRequestDTO): Promise<MedicationDTO> {
  if (USE_MOCK) {
    const meds = await getMockMeds();
    const newMed: MedicationDTO = {
      id: uuid(),
      name: data.name,
      dosage: data.dosage,
      form: data.form,
      formDescription: MedicationFormLabels[data.form],
      frequencyType: data.frequencyType,
      frequencyDays: data.frequencyDays,
      scheduleTimes: data.scheduleTimes,
      instructions: data.instructions,
      totalQuantity: data.totalQuantity,
      remainingQuantity: data.totalQuantity,
      refillAlertThreshold: data.refillAlertThreshold,
      needsRefill: false,
      isActive: true,
      createdDate: new Date().toISOString(),
    };
    meds.push(newMed);
    await saveMockMeds(meds);
    if (__DEV__) console.log('[MEDICATION_MOCK] Medicamento criado:', newMed.name);
    return newMed;
  }

  try {
    const response = await api.post<{ success: boolean; data: MedicationDTO }>('medication', data);
    return response.data.data;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao criar medicamento:', error);
    throw error;
  }
}

export async function updateMedication(id: string, data: MedicationRequestDTO): Promise<MedicationDTO> {
  if (USE_MOCK) {
    const meds = await getMockMeds();
    const index = meds.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Medicamento nao encontrado');

    meds[index] = {
      ...meds[index],
      name: data.name,
      dosage: data.dosage,
      form: data.form,
      formDescription: MedicationFormLabels[data.form],
      frequencyType: data.frequencyType,
      frequencyDays: data.frequencyDays,
      scheduleTimes: data.scheduleTimes,
      instructions: data.instructions,
      totalQuantity: data.totalQuantity,
      refillAlertThreshold: data.refillAlertThreshold,
    };
    await saveMockMeds(meds);
    if (__DEV__) console.log('[MEDICATION_MOCK] Medicamento atualizado:', meds[index].name);
    return meds[index];
  }

  try {
    const response = await api.put<{ success: boolean; data: MedicationDTO }>(`medication/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao atualizar medicamento:', error);
    throw error;
  }
}

export async function deactivateMedication(id: string): Promise<boolean> {
  if (USE_MOCK) {
    const meds = await getMockMeds();
    const med = meds.find(m => m.id === id);
    if (!med) return false;
    med.isActive = false;
    await saveMockMeds(meds);
    if (__DEV__) console.log('[MEDICATION_MOCK] Medicamento desativado:', med.name);
    return true;
  }

  try {
    await api.delete(`medication/${id}`);
    return true;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao desativar medicamento:', error);
    return false;
  }
}

export async function logDose(data: MedicationLogRequestDTO): Promise<MedicationLogDTO | null> {
  if (USE_MOCK) {
    const meds = await getMockMeds();
    const allLogs = await getMockLogs();
    const med = meds.find(m => m.id === data.medicationId);
    if (!med) return null;

    // Remove existing log for this slot if any
    const filtered = allLogs.filter(
      l => !(l.medicationId === data.medicationId && l.scheduledTime === data.scheduledTime)
    );

    const log: MedicationLogDTO = {
      id: uuid(),
      medicationId: data.medicationId,
      medicationName: med.name,
      medicationDosage: med.dosage,
      medicationForm: med.form,
      medicationFormDescription: MedicationFormLabels[med.form],
      scheduledTime: data.scheduledTime,
      actionTime: new Date().toISOString(),
      status: data.status,
    };

    filtered.push(log);
    await saveMockLogs(filtered);

    // Decrement remaining if taken
    if (data.status === MedicationLogStatus.Taken && med.remainingQuantity != null && med.remainingQuantity > 0) {
      med.remainingQuantity--;
      med.needsRefill = med.refillAlertThreshold != null
        ? med.remainingQuantity <= med.refillAlertThreshold
        : false;
      await saveMockMeds(meds);
    }

    if (__DEV__) console.log('[MEDICATION_MOCK] Dose registrada:', med.name, '->', data.status === MedicationLogStatus.Taken ? 'Tomou' : 'Pulou');
    return log;
  }

  try {
    const response = await api.post<{ success: boolean; data: MedicationLogDTO }>('medication/log', data);
    return response.data.data;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao registrar dose:', error);
    return null;
  }
}

export async function getTodayLogs(): Promise<MedicationLogDTO[]> {
  if (USE_MOCK) {
    await ensureSeedData();
    return buildTodayLogs();
  }

  try {
    const response = await api.get<{ success: boolean; data: MedicationLogDTO[] }>('medication/log/today');
    return response.data.data;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao buscar logs do dia:', error);
    return [];
  }
}

/** DEV ONLY: Reset all mock data (meds + logs) so seed re-creates */
export async function resetMockData(): Promise<void> {
  await AsyncStorage.multiRemove([MOCK_MEDS_KEY, MOCK_LOGS_KEY]);
  if (__DEV__) console.log('[MEDICATION_MOCK] Dados resetados');
}

export async function getAdherence(month: number, year: number): Promise<MedicationAdherenceDTO | null> {
  if (USE_MOCK) {
    await ensureSeedData();
    const meds = await getMockMeds();
    return buildAdherenceMock(month, year, meds);
  }

  try {
    const response = await api.get<{ success: boolean; data: MedicationAdherenceDTO }>(
      `medication/adherence?month=${month}&year=${year}`
    );
    return response.data.data;
  } catch (error: any) {
    if (__DEV__) console.error('[MEDICATION] Erro ao buscar aderencia:', error);
    return null;
  }
}
