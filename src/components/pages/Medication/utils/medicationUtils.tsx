import React from 'react';
import {
  PillIcon,
  WaterDropFilledIcon,
  SyringeIcon,
  BandAidIcon,
  PillSquareDoubleIcon,
  FlaskRoundIcon,
} from '@assets/icons';
import {
  MedicationForm,
  MedicationLogStatus,
} from 'src/services/medicationService';

// ---- Icon component ----

export function MedicationIcon({
  form,
  size = '24',
  color = '#0CC1AF',
}: {
  form: MedicationForm;
  size?: string;
  color?: string;
}) {
  switch (form) {
    case MedicationForm.Comprimido: return <PillIcon size={size} color={color} />;
    case MedicationForm.Gotas: return <WaterDropFilledIcon size={size} color={color} />;
    case MedicationForm.Injecao: return <SyringeIcon size={size} color={color} />;
    case MedicationForm.Pomada: return <BandAidIcon size={size} color={color} />;
    case MedicationForm.Capsula: return <PillSquareDoubleIcon size={size} color={color} />;
    case MedicationForm.Xarope: return <FlaskRoundIcon size={size} color={color} />;
    default: return <PillIcon size={size} color={color} />;
  }
}

// ---- Status helpers ----

export function getStatusColor(status: MedicationLogStatus): string {
  switch (status) {
    case MedicationLogStatus.Taken: return '#10B981';
    case MedicationLogStatus.Skipped: return '#F59E0B';
    case MedicationLogStatus.Missed: return '#EF4444';
    case MedicationLogStatus.Pending:
    default: return '#9CA3AF';
  }
}

export function getStatusBg(status: MedicationLogStatus): string {
  switch (status) {
    case MedicationLogStatus.Taken: return '#ECFDF5';
    case MedicationLogStatus.Skipped: return '#FFFBEB';
    case MedicationLogStatus.Missed: return '#FEF2F2';
    case MedicationLogStatus.Pending:
    default: return '#F9FAFB';
  }
}

export function getStatusLabel(status: MedicationLogStatus): string {
  switch (status) {
    case MedicationLogStatus.Taken: return 'Tomou';
    case MedicationLogStatus.Skipped: return 'Pulou';
    case MedicationLogStatus.Missed: return 'Perdeu';
    case MedicationLogStatus.Pending:
    default: return 'Pendente';
  }
}

// ---- Form icon helper (smaller, for chips) ----

export function getFormIcon(form: MedicationForm, color: string, size: string = '18') {
  switch (form) {
    case MedicationForm.Comprimido: return <PillIcon size={size} color={color} />;
    case MedicationForm.Gotas: return <WaterDropFilledIcon size={size} color={color} />;
    case MedicationForm.Injecao: return <SyringeIcon size={size} color={color} />;
    case MedicationForm.Pomada: return <BandAidIcon size={size} color={color} />;
    case MedicationForm.Capsula: return <PillSquareDoubleIcon size={size} color={color} />;
    case MedicationForm.Xarope: return <FlaskRoundIcon size={size} color={color} />;
    default: return <PillIcon size={size} color={color} />;
  }
}
