const KEYS = {
  WALLET_DATA: "wallet_data",
  PIN_HASH: "pin_hash",
  SALT: "salt",
  BIOMETRIC_CREDENTIAL_ID: "biometric_credential_id",
  WALLET_EXISTS: "wallet_exists",
  BIOMETRIC_PIN_BACKUP: "biometric_pin_backup",
} as const;

export const secureStorage = {
  saveWalletData(encryptedData: string): void {
    localStorage.setItem(KEYS.WALLET_DATA, encryptedData);
    localStorage.setItem(KEYS.WALLET_EXISTS, "true");
  },
  getWalletData(): string | null {
    return localStorage.getItem(KEYS.WALLET_DATA);
  },
  walletExists(): boolean {
    return localStorage.getItem(KEYS.WALLET_EXISTS) === "true";
  },
  savePinHash(hash: string): void {
    localStorage.setItem(KEYS.PIN_HASH, hash);
  },
  getPinHash(): string | null {
    return localStorage.getItem(KEYS.PIN_HASH);
  },
  saveSalt(salt: string): void {
    localStorage.setItem(KEYS.SALT, salt);
  },
  getSalt(): string | null {
    return localStorage.getItem(KEYS.SALT);
  },
  saveBiometricCredentialId(id: string): void {
    localStorage.setItem(KEYS.BIOMETRIC_CREDENTIAL_ID, id);
  },
  getBiometricCredentialId(): string | null {
    return localStorage.getItem(KEYS.BIOMETRIC_CREDENTIAL_ID);
  },
  saveBiometricPinBackup(encrypted: string): void {
    localStorage.setItem(KEYS.BIOMETRIC_PIN_BACKUP, encrypted);
  },
  getBiometricPinBackup(): string | null {
    return localStorage.getItem(KEYS.BIOMETRIC_PIN_BACKUP);
  },
  clearAll(): void {
    for (const k of Object.values(KEYS)) {
      localStorage.removeItem(k);
    }
  },
};
