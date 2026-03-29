import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface BackupConfirmScreenProps {
  onConfirm: () => void;
}

export function BackupConfirmScreen({ onConfirm }: BackupConfirmScreenProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="flex flex-col min-h-screen bg-background px-6 py-12 justify-between"
      data-ocid="backup.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-destructive/10 border border-destructive/30">
          <TriangleAlert className="w-12 h-12 text-destructive" />
          <h2 className="text-xl font-bold text-center">Backup Warning</h2>
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            If you lose your seed phrase, you lose your funds permanently.
            <span className="text-destructive font-semibold">
              {" "}
              There is no recovery.
            </span>
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Write it down on paper
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Store in a safe, secure
              location
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Never share with anyone
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span> Never store digitally or
              in the cloud
            </li>
          </ul>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
          <Checkbox
            id="backup-confirm"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            data-ocid="backup.checkbox"
            className="mt-0.5"
          />
          <Label
            htmlFor="backup-confirm"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I have safely saved my seed phrase in a secure location and
            understand I cannot recover my wallet without it.
          </Label>
        </div>
      </motion.div>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: checked ? 1 : 0.4 }}
        onClick={() => checked && onConfirm()}
        disabled={!checked}
        data-ocid="backup.confirm_button"
        className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-[0.98]"
      >
        Continue to Wallet
      </motion.button>
    </div>
  );
}
