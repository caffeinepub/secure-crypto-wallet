import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    getAutoLockTimeout(): Promise<bigint>;
    getBiometricsEnabled(): Promise<boolean>;
    hasWallet(): Promise<boolean>;
    setAutoLockTimeout(timeoutMinutes: bigint): Promise<void>;
    setBiometricsEnabled(enabled: boolean): Promise<void>;
    setWalletSetup(hasWallet: boolean): Promise<void>;
}
