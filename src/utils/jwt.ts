export type JwtPayload = { [key: string]: any };

function base64UrlToBase64(input: string): string {
  let b64 = (input || '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad === 2) b64 += '==';
  else if (pad === 3) b64 += '=';
  else if (pad !== 0) b64 += '===';
  return b64;
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function base64DecodeToBytes(b64: string): Uint8Array {
  // Remove any whitespace
  b64 = (b64 || '').replace(/\s/g, '');

  const output: number[] = [];
  let buffer = 0;
  let bitsCollected = 0;

  for (let i = 0; i < b64.length; i++) {
    const ch = b64.charAt(i);
    if (ch === '=') {
      // Padding; end of input
      break;
    }
    const code = BASE64_CHARS.indexOf(ch);
    if (code < 0) {
      // Ignore non-base64 characters
      continue;
    }

    buffer = (buffer << 6) | code;
    bitsCollected += 6;

    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      const byte = (buffer >>> bitsCollected) & 0xff;
      output.push(byte);
    }
  }

  return new Uint8Array(output);
}

function bytesToAscii(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payloadB64 = base64UrlToBase64(parts[1]);
    const bytes = base64DecodeToBytes(payloadB64);
    const jsonStr = bytesToAscii(bytes);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function getAppleClaims(identityToken: string): { email?: string; appleUserId?: string } {
  const claims = decodeJwtPayload(identityToken);
  return {
    email: claims?.email,
    appleUserId: claims?.sub || claims?.user_id || claims?.uid,
  };
}
