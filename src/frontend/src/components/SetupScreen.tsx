import { Download, PlusCircle, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface SetupScreenProps {
  onCreate: () => void;
  onImport: () => void;
}

export function SetupScreen({ onCreate, onImport }: SetupScreenProps) {
  return (
    <div
      className="flex flex-col min-h-screen bg-background px-6 py-12"
      data-ocid="setup.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 mb-12"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glow-lg">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">CryptoVault</h1>
        <p className="text-muted-foreground text-sm text-center">
          Secure, non-custodial wallet for ETH, ERC-20 &amp; ICP
        </p>
      </motion.div>
      <div className="flex flex-col gap-4">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onCreate}
          data-ocid="setup.primary_button"
          className="w-full p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <PlusCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Create New Wallet
              </h2>
              <p className="text-muted-foreground text-sm">
                Generate a new seed phrase
              </p>
            </div>
          </div>
        </motion.button>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onImport}
          data-ocid="setup.secondary_button"
          className="w-full p-6 rounded-2xl bg-card border border-border hover:border-secondary/40 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:bg-secondary/20 transition-all">
              <Download className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Import Existing Wallet
              </h2>
              <p className="text-muted-foreground text-sm">
                Use your seed phrase
              </p>
            </div>
          </div>
        </motion.button>
      </div>
      <p className="text-muted-foreground text-xs text-center mt-8">
        Your keys are encrypted and stored locally. We never see your funds.
      </p>
    </div>
  );
}
