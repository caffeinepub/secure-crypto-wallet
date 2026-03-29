import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { validateMnemonic } from "../services/walletService";
import { PinPad } from "./PinPad";

interface ImportWalletScreenProps {
  onBack: () => void;
  onImport: (mnemonic: string, pin: string) => void;
}

type Step = "phrase" | "pin" | "confirm";

export function ImportWalletScreen({
  onBack,
  onImport,
}: ImportWalletScreenProps) {
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("phrase");
  const [pin, setPin] = useState("");

  const handleContinue = () => {
    const trimmed = phrase.trim().toLowerCase().replace(/\s+/g, " ");
    if (!validateMnemonic(trimmed)) {
      setError("Invalid seed phrase. Please check your words and try again.");
      return;
    }
    setError("");
    setStep("pin");
  };

  if (step === "pin") {
    return (
      <div
        className="flex flex-col min-h-screen bg-background px-6 py-12"
        data-ocid="import.page"
      >
        <button
          type="button"
          onClick={() => setStep("phrase")}
          className="flex items-center gap-2 text-muted-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Set Your PIN</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Choose a 6-digit PIN to protect your wallet
          </p>
        </div>
        <PinPad
          onComplete={(p) => {
            setPin(p);
            setStep("confirm");
          }}
          label="Choose a 6-digit PIN"
        />
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div
        className="flex flex-col min-h-screen bg-background px-6 py-12"
        data-ocid="import.page"
      >
        <button
          type="button"
          onClick={() => setStep("pin")}
          className="flex items-center gap-2 text-muted-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Confirm PIN</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your PIN again to confirm
          </p>
        </div>
        <PinPad
          onComplete={(confirmPin) => {
            if (confirmPin === pin) {
              onImport(phrase.trim().toLowerCase().replace(/\s+/g, " "), pin);
            } else {
              setStep("pin");
              setPin("");
            }
          }}
          label="Confirm your PIN"
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-background px-6 py-12"
      data-ocid="import.page"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">Import Wallet</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your 12 or 24-word seed phrase
        </p>
      </motion.div>
      <div className="mt-6 flex flex-col gap-4">
        <Textarea
          value={phrase}
          onChange={(e) => {
            setPhrase(e.target.value);
            setError("");
          }}
          placeholder="Enter your seed phrase words separated by spaces..."
          data-ocid="import.textarea"
          className="min-h-32 bg-card border-border text-foreground placeholder:text-muted-foreground resize-none font-mono text-sm"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {error && (
          <p
            className="text-destructive text-sm"
            data-ocid="import.error_state"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!phrase.trim()}
          data-ocid="import.submit_button"
          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-40 disabled:shadow-none transition-all active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
