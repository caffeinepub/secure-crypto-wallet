import { Copy, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { WalletData } from "../../services/walletService";

const ETH_PRICE = 3750;
const ICP_PRICE = 3;
const ERC20_TOKENS = [
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: 1200,
    price: 1,
    colorClass: "bg-blue-500",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: 850,
    price: 1,
    colorClass: "bg-emerald-400",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    balance: 320,
    price: 1,
    colorClass: "bg-yellow-500",
  },
];
const ETH_BALANCE = 1.2847;
const ICP_BALANCE = 342.5;

function truncateAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function CopyBtn({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
      }}
      className="ml-1 text-muted-foreground hover:text-primary transition-colors shrink-0"
    >
      <Copy className="w-3.5 h-3.5" />
    </button>
  );
}

export function Dashboard({ wallet }: { wallet: WalletData }) {
  const ethUsd = ETH_BALANCE * ETH_PRICE;
  const icpUsd = ICP_BALANCE * ICP_PRICE;
  const erc20Usd = ERC20_TOKENS.reduce((s, t) => s + t.balance * t.price, 0);
  const total = ethUsd + icpUsd + erc20Usd;

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-card border border-border"
        data-ocid="wallet.card"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            Total Portfolio
          </span>
        </div>
        <p className="text-4xl font-bold">
          $
          {total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-primary text-sm mt-1">
          ↑ 12.4% <span className="text-muted-foreground">this week</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl bg-card border border-border"
        data-ocid="wallet.item.1"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">Ξ</span>
            </div>
            <div>
              <p className="font-semibold">Ethereum</p>
              <p className="text-muted-foreground text-xs">ETH</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{ETH_BALANCE} ETH</p>
            <p className="text-muted-foreground text-xs">
              ${ethUsd.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 pt-3 border-t border-border">
          <span className="text-muted-foreground text-xs">
            {truncateAddr(wallet.ethAddress)}
          </span>
          <CopyBtn text={wallet.ethAddress} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-card border border-border"
        data-ocid="wallet.item.2"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <span className="text-purple-400 font-bold text-xs">ICP</span>
            </div>
            <div>
              <p className="font-semibold">Internet Computer</p>
              <p className="text-muted-foreground text-xs">ICP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{ICP_BALANCE} ICP</p>
            <p className="text-muted-foreground text-xs">
              ${icpUsd.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 pt-3 border-t border-border">
          <span className="text-muted-foreground text-xs font-mono">
            {wallet.icpPrincipal}
          </span>
          <CopyBtn text={wallet.icpPrincipal} />
        </div>
      </motion.div>

      <div>
        <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-3">
          ERC-20 Tokens
        </h3>
        <div className="flex flex-col gap-2">
          {ERC20_TOKENS.map((token, i) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              data-ocid={`wallet.item.${i + 3}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${token.colorClass}/20`}
                >
                  <span className="text-xs font-bold text-foreground">
                    {token.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{token.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {token.balance.toLocaleString()} {token.symbol}
                </p>
                <p className="text-muted-foreground text-xs">
                  ${(token.balance * token.price).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
