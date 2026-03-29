import { Copy, Share2 } from "lucide-react";
import { motion } from "motion/react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { WalletData } from "../../services/walletService";

type Network = "ETH" | "ICP";

export function ReceiveScreen({ wallet }: { wallet: WalletData }) {
  const [network, setNetwork] = useState<Network>("ETH");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const address = network === "ETH" ? wallet.ethAddress : wallet.icpPrincipal;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, address, {
      width: 220,
      margin: 2,
      color: { dark: "#062013", light: "#1ED07A" },
    });
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: address, title: `My ${network} Address` });
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="flex flex-col gap-5 px-4 py-4 pb-24"
      data-ocid="receive.page"
    >
      <h2 className="text-xl font-bold">Receive</h2>
      <div
        className="flex gap-2 p-1 rounded-full bg-muted"
        data-ocid="receive.toggle"
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-glow">
          <canvas ref={canvasRef} className="rounded-xl" />
        </div>
        <div className="w-full">
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
            Your {network} Address
          </p>
          <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-foreground break-all">
              {address}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              data-ocid="receive.secondary_button"
              className="shrink-0 text-primary"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleShare}
          data-ocid="receive.primary_button"
          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4" /> Share Address
        </button>
      </motion.div>
    </div>
  );
}
