import { History, QrCode, Send, Settings, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { WalletData } from "../services/walletService";
import { Dashboard } from "./wallet/Dashboard";
import { HistoryScreen } from "./wallet/HistoryScreen";
import { ReceiveScreen } from "./wallet/ReceiveScreen";
import { SendScreen } from "./wallet/SendScreen";
import { SettingsScreen } from "./wallet/SettingsScreen";

type Tab = "wallet" | "send" | "receive" | "history" | "settings";
const TABS: { id: Tab; label: string; icon: typeof Wallet }[] = [
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "send", label: "Send", icon: Send },
  { id: "receive", label: "Receive", icon: QrCode },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

interface MainAppProps {
  wallet: WalletData;
  onLock: () => void;
  onReset: () => void;
}

export function MainApp({ wallet, onLock: _onLock, onReset }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("wallet");

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-base">CryptoVault</span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "wallet" && <Dashboard wallet={wallet} />}
            {activeTab === "send" && <SendScreen wallet={wallet} />}
            {activeTab === "receive" && <ReceiveScreen wallet={wallet} />}
            {activeTab === "history" && <HistoryScreen />}
            {activeTab === "settings" && (
              <SettingsScreen wallet={wallet} onReset={onReset} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav
        className="shrink-0 flex items-center bg-card border-t border-border"
        data-ocid="wallet.panel"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-ocid="wallet.tab"
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon
                className={`w-5 h-5 transition-all ${active ? "drop-shadow-[0_0_6px_rgba(30,208,122,0.6)]" : ""}`}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
