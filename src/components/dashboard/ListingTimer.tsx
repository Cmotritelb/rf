import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { addDays } from "date-fns";

export function ListingTimer() {
  // Target date: March 7, 2026
  const [targetDate] = useState(() => new Date("2026-03-07T00:00:00"));
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Card className="bg-primary/5 border-primary/20 mb-12 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
      <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Листинг S-Token</h3>
            <p className="text-muted-foreground text-sm">До официального выхода на биржи осталось:</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          {[
            { label: "Дней", value: timeLeft.days },
            { label: "Часов", value: timeLeft.hours },
            { label: "Минут", value: timeLeft.minutes },
            { label: "Секунд", value: timeLeft.seconds }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-background/80 backdrop-blur border border-primary/20 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-primary shadow-lg shadow-primary/10">
                {String(item.value).padStart(2, '0')}
              </div>
              <span className="text-[10px] uppercase tracking-wider mt-2 font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
