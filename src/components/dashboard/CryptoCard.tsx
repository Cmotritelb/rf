import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CryptoCardProps {
  name: string;
  symbol: string;
  price: string;
  change: number;
  balance: string;
  iconUrl: string; // Or use an Icon component
  color: string;
}

export function CryptoCard({ name, symbol, price, change, balance, iconUrl, color }: CryptoCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="bg-card border-white/5 p-5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300 group overflow-hidden relative">
      {/* Background Glow */}
      <div 
        className="absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
             {/* Using simple text fallback for icons if image fails, ideal to use react-icons */}
            <span role="img" aria-label={name}>{iconUrl}</span> 
          </div>
          <div>
            <h3 className="font-bold">{name}</h3>
            <span className="text-xs text-muted-foreground">{symbol}</span>
          </div>
        </div>
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{balance} {symbol}</p>
        <p className="text-sm text-muted-foreground">≈ {price}</p>
      </div>
    </Card>
  );
}
