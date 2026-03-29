import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { generateMnemonic } from "../services/walletService";
import { PinPad } from "./PinPad";

interface CreateWalletScreenProps {
  onBack: () => void;
  onContinue: (mnemonic: string, pin: string) => void;
}

type Step = "words" | "pin" | "confirm";

export function CreateWalletScreen({
  onBack,
  onContinue,
}: CreateWalletScreenProps) {
  const [mnemonic] = useState(() => generateMnemonic());
  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState<Step>("words");
  const [pin, setPin] = useState("");
  const words = mnemonic.split(" ");

  if (step === "pin") {
    return (
      <div
        className="flex flex-col min-h-screen bg-background px-6 py-12"
        data-ocid="create.page"
      >
        <button
          type="button"
          onClick={() => setStep("words")}
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
        data-ocid="create.page"
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
              onContinue(mnemonic, pin);
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
      data-ocid="create.page"
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
        <h2 className="text-2xl font-bold">Your Seed Phrase</h2>
        <div className="flex items-center gap-2 mt-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <span className="text-destructive text-xs">
            ⚠️ Write these down. You will never see them again.
          </span>
        </div>
      </motion.div>
      <div className="relative mt-6">
        <div
          className={`grid grid-cols-3 gap-2 transition-all duration-300 ${revealed ? "" : "blur-md select-none pointer-events-none"}`}
        >
          {words.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2"
            >
              <span className="text-muted-foreground text-xs w-4">
                {i + 1}.
              </span>
              <span className="text-foreground text-sm font-medium">
                {word}
              </span>
            </motion.div>
          ))}
        </div>
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              data-ocid="create.toggle"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
            >
              <Eye className="w-4 h-4" /> Tap to reveal
            </button>
          </div>
        )}
      </div>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col gap-3"
        >
          <button
            type="button"
            onClick={() => setRevealed(false)}
            className="flex items-center gap-1 text-muted-foreground text-xs self-end"
          >
            <EyeOff className="w-3 h-3" /> Hide
          </button>
          <button
            type="button"
            onClick={() => setStep("pin")}
            data-ocid="create.primary_button"
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-lg transition-all active:scale-[0.98]"
          >
            I’ve Written These Down →
          </button>
        </motion.div>
      )}
    </div>
  );
}
