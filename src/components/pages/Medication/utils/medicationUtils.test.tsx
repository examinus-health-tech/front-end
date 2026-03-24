import React from 'react';

// Mock dos ícones
jest.mock('@assets/icons', () => ({
  PillIcon: jest.fn((props: any) => null),
  WaterDropFilledIcon: jest.fn((props: any) => null),
  SyringeIcon: jest.fn((props: any) => null),
  BandAidIcon: jest.fn((props: any) => null),
  PillSquareDoubleIcon: jest.fn((props: any) => null),
  FlaskRoundIcon: jest.fn((props: any) => null),
}));

// Mock do medicationService para ter acesso aos enums
jest.mock('src/services/medicationService', () => ({
  MedicationForm: {
    Comprimido: 1,
    Gotas: 2,
    Injecao: 3,
    Pomada: 4,
    Capsula: 5,
    Xarope: 6,
  },
  MedicationLogStatus: {
    Pending: 0,
    Taken: 1,
    Skipped: 2,
    Missed: 3,
  },
}));

import {
  PillIcon,
  WaterDropFilledIcon,
  SyringeIcon,
  BandAidIcon,
  PillSquareDoubleIcon,
  FlaskRoundIcon,
} from '@assets/icons';

import {
  MedicationIcon,
  getStatusColor,
  getStatusBg,
  getStatusLabel,
  getFormIcon,
} from './medicationUtils';
import { MedicationForm, MedicationLogStatus } from 'src/services/medicationService';

beforeEach(() => {
  jest.clearAllMocks();
});

// Helper: verifica que o React element retornado usa o componente e props corretos
function expectElement(element: React.ReactElement, expectedType: any, expectedProps: Record<string, any>) {
  expect(element.type).toBe(expectedType);
  expect(element.props).toEqual(expect.objectContaining(expectedProps));
}

describe('MedicationIcon', () => {
  it('deve renderizar PillIcon para Comprimido', () => {
    const result = MedicationIcon({ form: MedicationForm.Comprimido });
    expectElement(result, PillIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve renderizar WaterDropFilledIcon para Gotas', () => {
    const result = MedicationIcon({ form: MedicationForm.Gotas });
    expectElement(result, WaterDropFilledIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve renderizar SyringeIcon para Injecao', () => {
    const result = MedicationIcon({ form: MedicationForm.Injecao });
    expectElement(result, SyringeIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve renderizar BandAidIcon para Pomada', () => {
    const result = MedicationIcon({ form: MedicationForm.Pomada });
    expectElement(result, BandAidIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve renderizar PillSquareDoubleIcon para Capsula', () => {
    const result = MedicationIcon({ form: MedicationForm.Capsula });
    expectElement(result, PillSquareDoubleIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve renderizar FlaskRoundIcon para Xarope', () => {
    const result = MedicationIcon({ form: MedicationForm.Xarope });
    expectElement(result, FlaskRoundIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve renderizar PillIcon como default para forma desconhecida', () => {
    const result = MedicationIcon({ form: 999 as MedicationForm });
    expectElement(result, PillIcon, { size: '24', color: '#0CC1AF' });
  });

  it('deve aceitar tamanho customizado', () => {
    const result = MedicationIcon({ form: MedicationForm.Comprimido, size: '32' });
    expectElement(result, PillIcon, { size: '32', color: '#0CC1AF' });
  });

  it('deve aceitar cor customizada', () => {
    const result = MedicationIcon({ form: MedicationForm.Comprimido, color: '#FF0000' });
    expectElement(result, PillIcon, { size: '24', color: '#FF0000' });
  });

  it('deve aceitar tamanho e cor customizados', () => {
    const result = MedicationIcon({
      form: MedicationForm.Gotas,
      size: '48',
      color: '#333333',
    });
    expectElement(result, WaterDropFilledIcon, { size: '48', color: '#333333' });
  });
});

describe('getStatusColor', () => {
  it('deve retornar verde (#10B981) para status Taken', () => {
    expect(getStatusColor(MedicationLogStatus.Taken)).toBe('#10B981');
  });

  it('deve retornar amarelo (#F59E0B) para status Skipped', () => {
    expect(getStatusColor(MedicationLogStatus.Skipped)).toBe('#F59E0B');
  });

  it('deve retornar vermelho (#EF4444) para status Missed', () => {
    expect(getStatusColor(MedicationLogStatus.Missed)).toBe('#EF4444');
  });

  it('deve retornar cinza (#9CA3AF) para status Pending', () => {
    expect(getStatusColor(MedicationLogStatus.Pending)).toBe('#9CA3AF');
  });

  it('deve retornar cinza (#9CA3AF) para status desconhecido (default)', () => {
    expect(getStatusColor(99 as MedicationLogStatus)).toBe('#9CA3AF');
  });
});

describe('getStatusBg', () => {
  it('deve retornar fundo verde claro (#ECFDF5) para status Taken', () => {
    expect(getStatusBg(MedicationLogStatus.Taken)).toBe('#ECFDF5');
  });

  it('deve retornar fundo amarelo claro (#FFFBEB) para status Skipped', () => {
    expect(getStatusBg(MedicationLogStatus.Skipped)).toBe('#FFFBEB');
  });

  it('deve retornar fundo vermelho claro (#FEF2F2) para status Missed', () => {
    expect(getStatusBg(MedicationLogStatus.Missed)).toBe('#FEF2F2');
  });

  it('deve retornar fundo cinza claro (#F9FAFB) para status Pending', () => {
    expect(getStatusBg(MedicationLogStatus.Pending)).toBe('#F9FAFB');
  });

  it('deve retornar fundo cinza claro (#F9FAFB) para status desconhecido (default)', () => {
    expect(getStatusBg(99 as MedicationLogStatus)).toBe('#F9FAFB');
  });
});

describe('getStatusLabel', () => {
  it('deve retornar "Tomou" para status Taken', () => {
    expect(getStatusLabel(MedicationLogStatus.Taken)).toBe('Tomou');
  });

  it('deve retornar "Pulou" para status Skipped', () => {
    expect(getStatusLabel(MedicationLogStatus.Skipped)).toBe('Pulou');
  });

  it('deve retornar "Perdeu" para status Missed', () => {
    expect(getStatusLabel(MedicationLogStatus.Missed)).toBe('Perdeu');
  });

  it('deve retornar "Pendente" para status Pending', () => {
    expect(getStatusLabel(MedicationLogStatus.Pending)).toBe('Pendente');
  });

  it('deve retornar "Pendente" para status desconhecido (default)', () => {
    expect(getStatusLabel(99 as MedicationLogStatus)).toBe('Pendente');
  });
});

describe('getFormIcon', () => {
  it('deve retornar PillIcon para Comprimido', () => {
    const result = getFormIcon(MedicationForm.Comprimido, '#000');
    expectElement(result, PillIcon, { size: '18', color: '#000' });
  });

  it('deve retornar WaterDropFilledIcon para Gotas', () => {
    const result = getFormIcon(MedicationForm.Gotas, '#FFF');
    expectElement(result, WaterDropFilledIcon, { size: '18', color: '#FFF' });
  });

  it('deve retornar SyringeIcon para Injecao', () => {
    const result = getFormIcon(MedicationForm.Injecao, '#123');
    expectElement(result, SyringeIcon, { size: '18', color: '#123' });
  });

  it('deve retornar BandAidIcon para Pomada', () => {
    const result = getFormIcon(MedicationForm.Pomada, '#456');
    expectElement(result, BandAidIcon, { size: '18', color: '#456' });
  });

  it('deve retornar PillSquareDoubleIcon para Capsula', () => {
    const result = getFormIcon(MedicationForm.Capsula, '#789');
    expectElement(result, PillSquareDoubleIcon, { size: '18', color: '#789' });
  });

  it('deve retornar FlaskRoundIcon para Xarope', () => {
    const result = getFormIcon(MedicationForm.Xarope, '#ABC');
    expectElement(result, FlaskRoundIcon, { size: '18', color: '#ABC' });
  });

  it('deve retornar PillIcon como default para forma desconhecida', () => {
    const result = getFormIcon(999 as MedicationForm, '#DEF');
    expectElement(result, PillIcon, { size: '18', color: '#DEF' });
  });

  it('deve aceitar tamanho customizado', () => {
    const result = getFormIcon(MedicationForm.Comprimido, '#000', '32');
    expectElement(result, PillIcon, { size: '32', color: '#000' });
  });

  it('deve usar tamanho padrão "18" quando não fornecido', () => {
    const result = getFormIcon(MedicationForm.Gotas, '#FFF');
    expectElement(result, WaterDropFilledIcon, { size: '18', color: '#FFF' });
  });
});
