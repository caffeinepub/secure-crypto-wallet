import CryptoJS from "crypto-js";

export function deriveKey(pin: string, salt: string): string {
  return CryptoJS.SHA256(pin + salt).toString(CryptoJS.enc.Hex);
}

export function encrypt(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decrypt(ciphertext: string, key: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
}

export function hashPin(pin: string, salt: string): string {
  return CryptoJS.SHA256(pin + salt).toString(CryptoJS.enc.Hex);
}

export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}
