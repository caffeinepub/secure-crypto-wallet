import { Input } from "@/components/ui/input";
import { useQRScanner } from "@/qr-code/useQRScanner";
import { AlertTriangle, ScanLine, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { WalletData } from "../../services/walletService";

type Network = "ETH" | "ICP";

export function SendScreen({ wallet: _wallet }: { wallet: WalletData }) {
  const [network, setNetwork] = useState<Network>("ETH");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    qrResults,
    isScanning,
    startScanning,
    stopScanning,
    videoRef,
    canvasRef,
    error: camError,
    isSupported,
  } = useQRScanner({
    facingMode: "environment",
    scanInterval: 200,
    maxResults: 1,
  });

  useEffect(() => {
    if (qrResults.length > 0 && showScanner) {
      setRecipient(qrResults[0].data);
      stopScanning().then(() => setShowScanner(false));
    }
  }, [qrResults, showScanner, stopScanning]);

  const handleOpenScanner = async () => {
    setShowScanner(true);
    await startScanning();
  };
  const handleCloseScanner = async () => {
    await stopScanning();
    setShowScanner(false);
  };
  const handleConfirmSend = () => {
    setShowConfirm(false);
    setRecipient("");
    setAmount("");
    toast.success("Transaction submitted (demo — no real funds sent)");
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-4 pb-24" data-ocid="send.page">
      <h2 className="text-xl font-bold">Send</h2>
      <div
        className="flex gap-2 p-1 rounded-full bg-muted"
        data-ocid="send.toggle"
      >
        {(["ETH", "ICP"] as Network[]).map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setNetwork(n)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${network === n ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wider">
          Recipient Address
        </p>
        <div className="flex gap-2">
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={network === "ETH" ? "0x..." : "xxxxx-xxxxx-..."}
            data-ocid="send.input"
            className="bg-card border-border font-mono text-sm flex-1"
          />
          {isSupported !== false && (
            <button
              type="button"
              onClick={handleOpenScanner}
              data-ocid="send.secondary_button"
              className="px-3 rounded-xl bg-card border border-border text-primary hover:border-primary/40 transition-all"
            >
              <ScanLine className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs uppercase tracking-wider">
          Amount
        </p>
        <div className="relative">
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            type="number"
            min="0"
            data-ocid="send.search_input"
            className="bg-card border-border pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {network}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (recipient && amount) setShowConfirm(true);
        }}
        disabled={!recipient || !amount}
        data-ocid="send.primary_button"
        className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-40 disabled:shadow-none transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        <Send className="w-4 h-4" /> Send {network}
      </button>

      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-6"
            data-ocid="send.modal"
          >
            <div className="w-full max-w-[340px] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Scan QR Code</h3>
                <button
                  type="button"
                  onClick={handleCloseScanner}
                  data-ocid="send.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {camError ? (
                <div
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  data-ocid="send.error_state"
                >
                  {camError.message}
                </div>
              ) : (
                <div
                  className="relative rounded-2xl overflow-hidden bg-black"
                  style={{ aspectRatio: "1" }}
                >
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {isScanning && (
                    <div className="absolute inset-4 border-2 border-primary/60 rounded-xl pointer-events-none shadow-glow" />
                  )}
                </div>
              )}
              <p className="text-muted-foreground text-sm text-center">
                Point camera at a wallet address QR code
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 flex items-end justify-center"
            data-ocid="send.dialog"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-[390px] bg-card border border-border rounded-t-3xl p-6 pb-10 flex flex-col gap-5"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-lg">Confirm Transaction</h3>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-muted">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Network</span>
                  <span className="text-sm font-medium">{network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">To</span>
                  <span className="text-sm font-mono">
                    {recipient.slice(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Amount</span>
                  <span className="text-sm font-semibold text-primary">
                    {amount} {network}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a demo — no real funds will be sent.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  data-ocid="send.cancel_button"
                  className="flex-1 py-3 rounded-full bg-muted text-muted-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  data-ocid="send.confirm_button"
                  className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
                >
                  Confirm Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
