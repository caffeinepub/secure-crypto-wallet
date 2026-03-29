import { Delete } from "lucide-react";
import { useCallback, useState } from "react";

interface PinPadProps {
  onComplete: (pin: string) => void;
  error?: string;
  label?: string;
  shake?: boolean;
}

const DOT_KEYS = ["d0", "d1", "d2", "d3", "d4", "d5"];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "empty", "0", "del"];

export function PinPad({
  onComplete,
  error,
  label = "Enter PIN",
  shake,
}: PinPadProps) {
  const [pin, setPin] = useState("");

  const handleKey = useCallback(
    (val: string) => {
      if (val === "del") {
        setPin((p) => p.slice(0, -1));
        return;
      }
      const next = pin + val;
      setPin(next);
      if (next.length === 6) {
        onComplete(next);
        setPin("");
      }
    },
    [pin, onComplete],
  );

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-muted-foreground text-sm tracking-widest uppercase">
        {label}
      </p>
      <div className={`flex gap-4 ${shake ? "animate-shake" : ""}`}>
        {DOT_KEYS.map((dk, i) => (
          <div
            key={dk}
            className={`w-4 h-4 rounded-full transition-all duration-150 ${
              i < pin.length
                ? "bg-primary shadow-glow scale-110"
                : "bg-muted border border-border"
            }`}
          />
        ))}
      </div>
      {error && (
        <p
          className="text-destructive text-sm text-center"
          data-ocid="lock.error_state"
        >
          {error}
        </p>
      )}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {KEYS.map((k) => {
          if (k === "empty") return <div key="empty" />;
          return (
            <button
              type="button"
              key={k}
              onClick={() => handleKey(k)}
              className={`h-16 rounded-2xl text-xl font-semibold transition-all active:scale-95 ${
                k === "del"
                  ? "bg-muted text-muted-foreground flex items-center justify-center"
                  : "bg-card border border-border text-foreground hover:bg-muted hover:border-primary/40"
              }`}
            >
              {k === "del" ? <Delete className="w-5 h-5" /> : k}
            </button>
          );
        })}
      </div>
    </div>
  );
}
