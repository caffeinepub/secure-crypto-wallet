import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
  Clock,
  Download,
  Fingerprint,
  Key,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAutoLockTimeout,
  useBiometricsEnabled,
  useSetAutoLockTimeout,
  useSetBiometricsEnabled,
} from "../../hooks/useQueries";
import { secureStorage } from "../../services/secureStorage";
import { changePin, unlockWithPin } from "../../services/walletService";
import type { WalletData } from "../../services/walletService";
import { PinPad } from "../PinPad";

type PinStep = "current" | "new" | "confirm";
interface SettingsScreenProps {
  wallet: WalletData;
  onReset: () => void;
}

export function SettingsScreen({ wallet, onReset }: SettingsScreenProps) {
  const { data: biometricsEnabled = false } = useBiometricsEnabled();
  const { data: autoLockTimeout = BigInt(2) } = useAutoLockTimeout();
  const setBiometrics = useSetBiometricsEnabled();
  const setAutoLock = useSetAutoLockTimeout();

  const [showPinChange, setShowPinChange] = useState(false);
  const [pinStep, setPinStep] = useState<PinStep>("current");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [showBackup, setShowBackup] = useState(false);
  const [backupError, setBackupError] = useState("");
  const [revealedMnemonic, setRevealedMnemonic] = useState("");

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const cred = (await navigator.credentials.create({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: "CryptoVault", id: window.location.hostname },
            user: {
              id: new Uint8Array(16),
              name: "wallet",
              displayName: "CryptoVault User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: { userVerification: "required" },
            timeout: 60000,
          },
        })) as PublicKeyCredential;
        const id = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
        secureStorage.saveBiometricCredentialId(id);
        await setBiometrics.mutateAsync(true);
        toast.success("Biometric authentication enabled");
      } catch {
        toast.error("Biometric setup failed");
      }
    } else {
      secureStorage.saveBiometricCredentialId("");
      await setBiometrics.mutateAsync(false);
      toast.success("Biometric disabled");
    }
  };

  const handlePinCurrent = (pin: string) => {
    if (!unlockWithPin(pin)) {
      setPinError("Incorrect PIN");
      return;
    }
    setCurrentPin(pin);
    setPinError("");
    setPinStep("new");
  };
  const handlePinNew = (pin: string) => {
    setNewPin(pin);
    setPinStep("confirm");
  };
  const handlePinConfirm = (pin: string) => {
    if (pin !== newPin) {
      setPinError("PINs don't match");
      setPinStep("new");
      return;
    }
    if (changePin(currentPin, pin)) {
      toast.success("PIN changed successfully");
      setShowPinChange(false);
      setPinStep("current");
      setCurrentPin("");
      setNewPin("");
    } else {
      toast.error("Failed to change PIN");
    }
  };
  const handleBackupPin = (pin: string) => {
    const w = unlockWithPin(pin);
    if (!w) {
      setBackupError("Incorrect PIN");
      return;
    }
    setRevealedMnemonic(wallet.mnemonic);
    setBackupError("");
  };

  return (
    <div
      className="flex flex-col gap-5 px-4 py-4 pb-24"
      data-ocid="settings.page"
    >
      <h2 className="text-xl font-bold">Settings</h2>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wider px-1">
          Security
        </p>
        <button
          type="button"
          onClick={() => {
            setShowPinChange(true);
            setPinStep("current");
          }}
          data-ocid="settings.button"
          className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Change PIN</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-5 h-5 text-secondary" />
            <div>
              <Label className="text-sm font-medium">Biometric Auth</Label>
              <p className="text-muted-foreground text-xs">
                Fingerprint / Face ID
              </p>
            </div>
          </div>
          <Switch
            checked={biometricsEnabled}
            onCheckedChange={handleBiometricToggle}
            data-ocid="settings.switch"
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm font-medium">Auto-lock Timer</p>
              <p className="text-muted-foreground text-xs">
                Lock after inactivity
              </p>
            </div>
          </div>
          <Select
            value={autoLockTimeout.toString()}
            onValueChange={(v) => setAutoLock.mutate(BigInt(v))}
          >
            <SelectTrigger
              className="w-24 bg-muted border-border"
              data-ocid="settings.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="1">1 min</SelectItem>
              <SelectItem value="2">2 min</SelectItem>
              <SelectItem value="5">5 min</SelectItem>
              <SelectItem value="10">10 min</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wider px-1">
          Backup &amp; Recovery
        </p>
        <button
          type="button"
          onClick={() => {
            setShowBackup(true);
            setRevealedMnemonic("");
            setBackupError("");
          }}
          data-ocid="settings.secondary_button"
          className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Backup Seed Phrase</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wider px-1">
          Wallet Info
        </p>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Security Status</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Encryption</span>
              <span className="text-primary text-xs font-medium">
                AES-256 ✓
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">ETH Address</span>
              <span className="text-xs font-mono">
                {wallet.ethAddress.slice(0, 10)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">
                ICP Principal
              </span>
              <span className="text-xs font-mono">{wallet.icpPrincipal}</span>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            data-ocid="settings.delete_button"
            className="w-full py-4 rounded-xl border border-destructive/30 text-destructive text-sm font-medium flex items-center justify-center gap-2 hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Reset Wallet
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="bg-card border-border max-w-[340px]"
          data-ocid="settings.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Wallet?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete your wallet from this device. Make
              sure you have your seed phrase backed up.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-muted border-border"
              data-ocid="settings.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onReset}
              className="bg-destructive text-destructive-foreground"
              data-ocid="settings.confirm_button"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {showPinChange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col px-6 py-12"
            data-ocid="settings.sheet"
          >
            <button
              type="button"
              onClick={() => setShowPinChange(false)}
              className="flex items-center gap-2 text-muted-foreground mb-8"
            >
              ← Back
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Change PIN</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {pinStep === "current"
                  ? "Enter your current PIN"
                  : pinStep === "new"
                    ? "Enter your new PIN"
                    : "Confirm your new PIN"}
              </p>
            </div>
            <PinPad
              key={pinStep}
              onComplete={
                pinStep === "current"
                  ? handlePinCurrent
                  : pinStep === "new"
                    ? handlePinNew
                    : handlePinConfirm
              }
              error={pinError}
              label={
                pinStep === "current"
                  ? "Current PIN"
                  : pinStep === "new"
                    ? "New PIN"
                    : "Confirm new PIN"
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col px-6 py-12"
            data-ocid="settings.panel"
          >
            <button
              type="button"
              onClick={() => setShowBackup(false)}
              className="flex items-center gap-2 text-muted-foreground mb-8"
            >
              ← Back
            </button>
            <h3 className="text-2xl font-bold mb-2">Backup Seed Phrase</h3>
            {!revealedMnemonic ? (
              <>
                <p className="text-muted-foreground text-sm mb-6">
                  Enter your PIN to reveal your seed phrase
                </p>
                <PinPad
                  onComplete={handleBackupPin}
                  error={backupError}
                  label="Enter PIN to reveal"
                />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
                  <p className="text-destructive text-xs">
                    ⚠️ Never share your seed phrase. Anyone with it can access
                    your funds.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {revealedMnemonic.split(" ").map((word) => (
                    <div
                      key={word}
                      className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2"
                    >
                      <span className="text-foreground text-sm font-medium">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
