import { Fingerprint, ShieldCheck } from "lucide-react";
import { useCallback, useState } from "react";
import { secureStorage } from "../services/secureStorage";
import { unlockWithBiometric, unlockWithPin } from "../services/walletService";
import type { WalletData } from "../services/walletService";
import { PinPad } from "./PinPad";

interface LockScreenProps {
  onUnlock: (wallet: WalletData) => void;
  biometricsEnabled: boolean;
}

export function LockScreen({ onUnlock, biometricsEnabled }: LockScreenProps) {
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handlePin = useCallback(
    (pin: string) => {
      const wallet = unlockWithPin(pin);
      if (wallet) {
        setError("");
        onUnlock(wallet);
      } else {
        setError("Incorrect PIN. Try again.");
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    },
    [onUnlock],
  );

  const handleBiometric = async () => {
    const credId = secureStorage.getBiometricCredentialId();
    if (!credId) return;
    try {
      const credIdBytes = Uint8Array.from(atob(credId), (c) => c.charCodeAt(0));
      await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{ id: credIdBytes, type: "public-key" }],
          userVerification: "required",
          timeout: 60000,
        },
      });
      const wallet = unlockWithBiometric();
      if (wallet) {
        onUnlock(wallet);
      } else {
        setError("Biometric unlock failed.");
      }
    } catch {
      setError("Biometric authentication failed.");
    }
  };

  const hasBiometric =
    biometricsEnabled && !!secureStorage.getBiometricCredentialId();

  return (
    <div
      className="flex flex-col min-h-screen bg-background items-center justify-between py-12 px-6"
      data-ocid="lock.page"
    >
      <div className="flex flex-col items-center gap-3 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glow">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">CryptoVault</h1>
        <p className="text-muted-foreground text-sm">Your secure wallet</p>
      </div>
      <div className="w-full animate-fade-in-up">
        <PinPad
          onComplete={handlePin}
          error={error}
          label="Enter your PIN"
          shake={shake}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        {hasBiometric && (
          <button
            type="button"
            onClick={handleBiometric}
            data-ocid="lock.toggle"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
          >
            <Fingerprint className="w-5 h-5" />
            <span className="text-sm">Use Biometric</span>
          </button>
        )}
        <p className="text-muted-foreground text-xs text-center">
          Enter your 6-digit PIN to unlock
        </p>
      </div>
    </div>
  );
}
