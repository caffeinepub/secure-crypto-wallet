import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type Filter = "All" | "ETH" | "ICP" | "ERC-20";
type TxStatus = "Confirmed" | "Pending" | "Failed";
type TxType = "Sent" | "Received";
interface Transaction {
  id: string;
  type: TxType;
  network: "ETH" | "ICP" | "ERC-20";
  token: string;
  amount: string;
  date: string;
  status: TxStatus;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "Received",
    network: "ETH",
    token: "ETH",
    amount: "+0.5 ETH",
    date: "Mar 28, 2026",
    status: "Confirmed",
  },
  {
    id: "2",
    type: "Sent",
    network: "ETH",
    token: "ETH",
    amount: "-0.12 ETH",
    date: "Mar 27, 2026",
    status: "Confirmed",
  },
  {
    id: "3",
    type: "Received",
    network: "ICP",
    token: "ICP",
    amount: "+50 ICP",
    date: "Mar 26, 2026",
    status: "Confirmed",
  },
  {
    id: "4",
    type: "Sent",
    network: "ERC-20",
    token: "USDC",
    amount: "-200 USDC",
    date: "Mar 25, 2026",
    status: "Confirmed",
  },
  {
    id: "5",
    type: "Received",
    network: "ERC-20",
    token: "USDT",
    amount: "+500 USDT",
    date: "Mar 24, 2026",
    status: "Confirmed",
  },
  {
    id: "6",
    type: "Sent",
    network: "ICP",
    token: "ICP",
    amount: "-25 ICP",
    date: "Mar 23, 2026",
    status: "Pending",
  },
  {
    id: "7",
    type: "Received",
    network: "ETH",
    token: "ETH",
    amount: "+0.08 ETH",
    date: "Mar 22, 2026",
    status: "Confirmed",
  },
  {
    id: "8",
    type: "Sent",
    network: "ERC-20",
    token: "DAI",
    amount: "-100 DAI",
    date: "Mar 21, 2026",
    status: "Failed",
  },
  {
    id: "9",
    type: "Received",
    network: "ICP",
    token: "ICP",
    amount: "+100 ICP",
    date: "Mar 20, 2026",
    status: "Confirmed",
  },
  {
    id: "10",
    type: "Sent",
    network: "ETH",
    token: "ETH",
    amount: "-0.05 ETH",
    date: "Mar 19, 2026",
    status: "Confirmed",
  },
];

const STATUS_COLORS: Record<TxStatus, string> = {
  Confirmed: "bg-primary/20 text-primary border-primary/30",
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Failed: "bg-destructive/20 text-destructive border-destructive/30",
};

export function HistoryScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", "ETH", "ICP", "ERC-20"];
  const filtered =
    filter === "All"
      ? TRANSACTIONS
      : TRANSACTIONS.filter((t) => t.network === filter);

  return (
    <div
      className="flex flex-col gap-4 px-4 py-4 pb-24"
      data-ocid="history.page"
    >
      <h2 className="text-xl font-bold">Transaction History</h2>
      <div className="flex gap-2 overflow-x-auto pb-1" data-ocid="history.tab">
        {filters.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div
            className="text-center text-muted-foreground py-12"
            data-ocid="history.empty_state"
          >
            No transactions found
          </div>
        )}
        {filtered.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
            data-ocid={`history.item.${i + 1}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "Received" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}
              >
                {tx.type === "Received" ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {tx.type} {tx.token}
                </p>
                <p className="text-muted-foreground text-xs">{tx.date}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p
                className={`text-sm font-semibold ${tx.type === "Received" ? "text-primary" : "text-destructive"}`}
              >
                {tx.amount}
              </p>
              <Badge
                className={`text-xs border px-2 py-0 ${STATUS_COLORS[tx.status]}`}
              >
                {tx.status}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
