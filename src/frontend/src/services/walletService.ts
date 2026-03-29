import * as bip39 from "bip39";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import {
  decrypt,
  deriveKey,
  encrypt,
  generateSalt,
  hashPin,
} from "./encryption";
import { secureStorage } from "./secureStorage";

export interface WalletData {
  mnemonic: string;
  ethPrivateKey: string;
  ethAddress: string;
  icpPrincipal: string;
}

function deriveMockIcpPrincipal(mnemonic: string): string {
  const hash = CryptoJS.SHA256(mnemonic).toString(CryptoJS.enc.Hex);
  const chars = hash.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const groups: string[] = [];
  for (let i = 0; i < 5; i++) {
    groups.push(chars.slice(i * 5, i * 5 + 5));
  }
  return groups.join("-");
}

export function generateMnemonic(): string {
  return bip39.generateMnemonic(128);
}

export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic.trim().toLowerCase());
}

export function deriveWallet(mnemonic: string): WalletData {
  const hdNode = ethers.HDNodeWallet.fromMnemonic(
    ethers.Mnemonic.fromPhrase(mnemonic),
  );
  const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");
  return {
    mnemonic,
    ethPrivateKey: wallet.privateKey,
    ethAddress: wallet.address,
    icpPrincipal: deriveMockIcpPrincipal(mnemonic),
  };
}

export function setupWallet(mnemonic: string, pin: string): WalletData {
  const salt = generateSalt();
  const pinHash = hashPin(pin, salt);
  const key = deriveKey(pin, salt);
  const walletData = deriveWallet(mnemonic);
  const encrypted = encrypt(JSON.stringify(walletData), key);
  secureStorage.saveSalt(salt);
  secureStorage.savePinHash(pinHash);
  secureStorage.saveWalletData(encrypted);
  const biometricBackup = encrypt(
    pin,
    CryptoJS.SHA256("biometric_backup_key").toString(),
  );
  secureStorage.saveBiometricPinBackup(biometricBackup);
  return walletData;
}

export function unlockWithPin(pin: string): WalletData | null {
  const salt = secureStorage.getSalt();
  const storedHash = secureStorage.getPinHash();
  const encryptedData = secureStorage.getWalletData();
  if (!salt || !storedHash || !encryptedData) return null;
  const inputHash = hashPin(pin, salt);
  if (inputHash !== storedHash) return null;
  const key = deriveKey(pin, salt);
  const json = decrypt(encryptedData, key);
  if (!json) return null;
  try {
    return JSON.parse(json) as WalletData;
  } catch {
    return null;
  }
}

export function unlockWithBiometric(): WalletData | null {
  const backup = secureStorage.getBiometricPinBackup();
  if (!backup) return null;
  const pin = decrypt(
    backup,
    CryptoJS.SHA256("biometric_backup_key").toString(),
  );
  if (!pin) return null;
  return unlockWithPin(pin);
}

export function changePin(currentPin: string, newPin: string): boolean {
  const walletData = unlockWithPin(currentPin);
  if (!walletData) return false;
  const salt = generateSalt();
  const newHash = hashPin(newPin, salt);
  const newKey = deriveKey(newPin, salt);
  const encrypted = encrypt(JSON.stringify(walletData), newKey);
  secureStorage.saveSalt(salt);
  secureStorage.savePinHash(newHash);
  secureStorage.saveWalletData(encrypted);
  const biometricBackup = encrypt(
    newPin,
    CryptoJS.SHA256("biometric_backup_key").toString(),
  );
  secureStorage.saveBiometricPinBackup(biometricBackup);
  return true;
}
