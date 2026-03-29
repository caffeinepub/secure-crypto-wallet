import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import { BackupConfirmScreen } from "./components/BackupConfirmScreen";
import { CreateWalletScreen } from "./components/CreateWalletScreen";
import { ImportWalletScreen } from "./components/ImportWalletScreen";
import { LockScreen } from "./components/LockScreen";
import { MainApp } from "./components/MainApp";
import { SetupScreen } from "./components/SetupScreen";
import { useAutoLock } from "./hooks/useAutoLock";
import {
  useAutoLockTimeout,
  useBiometricsEnabled,
  useSetWalletSetup,
} from "./hooks/useQueries";
import { secureStorage } from "./services/secureStorage";
import { setupWallet } from "./services/walletService";
import type { WalletData } from "./services/walletService";

type Screen = "lock" | "setup" | "create" | "backup" | "import" | "main";

export default function App() {
  const walletExists = secureStorage.walletExists();
  const [screen, setScreen] = useState<Screen>(walletExists ? "lock" : "setup");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [pendingMnemonic, setPendingMnemonic] = useState("");
  const [pendingPin, setPendingPin] = useState("");

  const { data: autoLockTimeout = BigInt(2) } = useAutoLockTimeout();
  const { data: biometricsEnabled = false } = useBiometricsEnabled();
  const setWalletSetup = useSetWalletSetup();

  const handleLock = useCallback(() => {
    setWallet(null);
    setScreen("lock");
  }, []);

  useAutoLock(
    Number(autoLockTimeout),
    handleLock,
    screen === "main" && !!wallet,
  );

  const handleUnlock = (w: WalletData) => {
    setWallet(w);
    setScreen("main");
  };

  const handleCreateContinue = (mnemonic: string, pin: string) => {
    setPendingMnemonic(mnemonic);
    setPendingPin(pin);
    setScreen("backup");
  };

  const handleBackupConfirm = () => {
    const w = setupWallet(pendingMnemonic, pendingPin);
    setWallet(w);
    setWalletSetup.mutate(true);
    setScreen("main");
  };

  const handleImport = (mnemonic: string, pin: string) => {
    const w = setupWallet(mnemonic, pin);
    setWallet(w);
    setWalletSetup.mutate(true);
    setScreen("main");
  };

  const handleReset = () => {
    secureStorage.clearAll();
    setWallet(null);
    setWalletSetup.mutate(false);
    setScreen("setup");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[390px] mx-auto min-h-screen relative">
        {screen === "lock" && (
          <LockScreen
            onUnlock={handleUnlock}
            biometricsEnabled={biometricsEnabled}
          />
        )}
        {screen === "setup" && (
          <SetupScreen
            onCreate={() => setScreen("create")}
            onImport={() => setScreen("import")}
          />
        )}
        {screen === "create" && (
          <CreateWalletScreen
            onBack={() => setScreen("setup")}
            onContinue={handleCreateContinue}
          />
        )}
        {screen === "backup" && (
          <BackupConfirmScreen onConfirm={handleBackupConfirm} />
        )}
        {screen === "import" && (
          <ImportWalletScreen
            onBack={() => setScreen("setup")}
            onImport={handleImport}
          />
        )}
        {screen === "main" && wallet && (
          <MainApp wallet={wallet} onLock={handleLock} onReset={handleReset} />
        )}
      </div>
      <Toaster />
      <footer className="fixed bottom-0 left-0 right-0 text-center text-muted-foreground text-[10px] py-1 pointer-events-none opacity-40">
        &copy; {new Date().getFullYear()}. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline pointer-events-auto"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
