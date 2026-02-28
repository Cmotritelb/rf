import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SeedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  index: number;
}

export function SeedInput({ index, className, ...props }: SeedInputProps) {
  return (
    <div className="relative group">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none">
        {index + 1}.
      </span>
      <Input
        className={cn(
          "pl-8 bg-black/20 border-white/10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}
