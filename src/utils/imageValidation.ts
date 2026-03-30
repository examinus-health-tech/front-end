import * as FileSystem from 'expo-file-system';

const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;
const MAX_FILE_SIZE_MB = 10;
const MIN_BRIGHTNESS = 40;
const MAX_BRIGHTNESS = 220;
const BRIGHTNESS_SAMPLE_SIZE = 1000;

type ValidationResult = {
  valid: boolean;
  message: string;
};

type PhotoValidation = {
  isValid: boolean;
  errors: string[];
};

type PhotoData = {
  uri: string;
  base64?: string;
  width: number;
  height: number;
};

export function validateImageDimensions(width: number, height: number): ValidationResult {
  const minW = Math.min(width, height);
  const maxW = Math.max(width, height);

  if (maxW < MIN_WIDTH || minW < MIN_HEIGHT) {
    return {
      valid: false,
      message: `Resolução muito baixa (${width}x${height}). Mínimo: ${MIN_WIDTH}x${MIN_HEIGHT}px.`,
    };
  }

  return { valid: true, message: '' };
}

export async function validateImageFileSize(uri: string): Promise<ValidationResult> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });

    if (!fileInfo.exists) {
      return { valid: false, message: 'Arquivo da foto não encontrado.' };
    }

    const sizeInMB = (fileInfo.size || 0) / (1024 * 1024);

    if (sizeInMB > MAX_FILE_SIZE_MB) {
      return {
        valid: false,
        message: `Arquivo muito grande (${sizeInMB.toFixed(1)}MB). Máximo: ${MAX_FILE_SIZE_MB}MB.`,
      };
    }

    return { valid: true, message: '' };
  } catch {
    return { valid: true, message: '' };
  }
}

export function validateImageBrightness(base64: string): ValidationResult {
  try {
    const raw = atob(base64.substring(0, BRIGHTNESS_SAMPLE_SIZE * 4));
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }

    let totalBrightness = 0;
    let pixelCount = 0;

    for (let i = 0; i + 2 < bytes.length; i += 3) {
      const r = bytes[i];
      const g = bytes[i + 1];
      const b = bytes[i + 2];
      totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
      pixelCount++;
    }

    if (pixelCount === 0) {
      return { valid: true, message: '' };
    }

    const avgBrightness = totalBrightness / pixelCount;

    if (avgBrightness < MIN_BRIGHTNESS) {
      return {
        valid: false,
        message: 'Foto muito escura. Tente em um ambiente com mais luz.',
      };
    }

    if (avgBrightness > MAX_BRIGHTNESS) {
      return {
        valid: false,
        message: 'Foto muito clara ou com reflexo. Evite luz direta sobre o exame.',
      };
    }

    return { valid: true, message: '' };
  } catch {
    return { valid: true, message: '' };
  }
}

export async function validateExamPhoto(photo: PhotoData): Promise<PhotoValidation> {
  const errors: string[] = [];

  const dimensionResult = validateImageDimensions(photo.width, photo.height);
  if (!dimensionResult.valid) {
    errors.push(dimensionResult.message);
  }

  const sizeResult = await validateImageFileSize(photo.uri);
  if (!sizeResult.valid) {
    errors.push(sizeResult.message);
  }

  if (photo.base64) {
    const brightnessResult = validateImageBrightness(photo.base64);
    if (!brightnessResult.valid) {
      errors.push(brightnessResult.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
