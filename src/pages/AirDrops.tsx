import { ListingTimer } from "@/components/dashboard/ListingTimer";
import { useUser } from "@/hooks/use-auth";
import { useWallets } from "@/hooks/use-wallets";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ExternalLink, Loader2 } from "lucide-react";

export default function AirDrops() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: wallets, isLoading: walletsLoading } = useWallets();
  const [, setLocation] = useLocation();

  // Состояние заданий
  const [tasks, setTasks] = useState({ 
    tg1: false, 
    tg2: false, 
    p1: false, 
    p2: false, 
    p3: false, 
    p4: false 
  });
  const [participated, setParticipated] = useState(false);

  // Проверка: выполнены ли все задания
  const allTasksDone = tasks.tg1 && tasks.tg2 && tasks.p1 && tasks.p2 && tasks.p3 && tasks.p4;

  // Статичный таймер на 3 дня
  const [airdropTimeLeft, setAirdropTimeLeft] = useState(3 * 24 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setAirdropTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (userLoading || walletsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Активные AirDrops</h1>
          <p className="text-muted-foreground text-lg">Выполняйте задания и получайте токены на свой кошелек</p>
        </div>

        <ListingTimer />

        {/* Задания */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Задания</h2>
          <div className="grid gap-4">
            {/* Telegram 1 */}
            <Card className="bg-card/50 border-white/5">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${tasks.tg1 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                    {tasks.tg1 ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-semibold">Подписаться на Telegram 1</p>
                    <p className="text-sm text-muted-foreground">Основной канал S-Wallet.Ton</p>
                  </div>
                </div>
                <Button 
                  onClick={() => { window.open("https://t.me/founder", "_blank"); setTasks(prev => ({ ...prev, tg1: true })); }}
                  variant={tasks.tg1 ? "ghost" : "outline"}
                >
                  {tasks.tg1 ? "Выполнено" : "Выполнить"}
                </Button>
              </CardContent>
            </Card>

            {/* Telegram 2 */}
            <Card className="bg-card/50 border-white/5">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${tasks.tg2 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                    {tasks.tg2 ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-semibold">Подписаться на Telegram 2</p>
                    <p className="text-sm text-muted-foreground">Новости экосистемы</p>
                  </div>
                </div>
                <Button 
                  onClick={() => { window.open("https://t.me/Cryptoz", "_blank"); setTasks(prev => ({ ...prev, tg2: true })); }}
                  variant={tasks.tg2 ? "ghost" : "outline"}
                >
                  {tasks.tg2 ? "Выполнено" : "Выполнить"}
                </Button>
              </CardContent>
            </Card>

            {/* Партнеры */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'p1', name: 'Партнер 1', url: 'https://t.me/CryptoAirdropsHuntersOfficial' },
                { id: 'p2', name: 'Партнер 2', url: 'https://t.me/cryptoairway' },
                { id: 'p3', name: 'Партнер 3', url: 'https://t.me/toncryptans' },
                { id: 'p4', name: 'Партнер 4', url: 'https://t.me/TONcryptoNFT' },
              ].map((partner) => (
                <Card key={partner.id} className="bg-card/50 border-white/5">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${tasks[partner.id as keyof typeof tasks] ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                        {tasks[partner.id as keyof typeof tasks] ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <p className="font-semibold">{partner.name}</p>
                    </div>
                    <Button 
                      onClick={() => { window.open(partner.url, "_blank"); setTasks(prev => ({ ...prev, [partner.id]: true })); }}
                      variant={tasks[partner.id as keyof typeof tasks] ? "ghost" : "outline"}
                    >
                      {tasks[partner.id as keyof typeof tasks] ? "Выполнено" : "Перейти"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Карточка AirDrop */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Доступные AirDrops</h2>
          <div className="grid md:grid-cols-1 gap-6">
            <AirDropCard 
              name="S-Wallet Token (SWP)" 
              amount="250 SWP" 
              initialTime={airdropTimeLeft} 
              disabled={!allTasksDone || participated}
              onParticipate={() => setParticipated(true)} // Баланс больше не проверяется
              participated={participated}
            />
          </div>
        </section>

        {/* Поле для TON кошелька */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Оставить свой TON кошелек</h2>
          <Card className="bg-card/50 border-white/5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Введите адрес вашего TON кошелька для получения наград</p>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Введите TON адрес"
                    className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                  <Button className="bg-primary text-primary-foreground">Сохранить</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function AirDropCard({ name, amount, initialTime, disabled, onParticipate, participated }: any) {
  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}д : ${h}ч : ${m}м : ${s}с`;
  };

  return (
    <Card className="bg-card border-white/5 overflow-hidden hover:border-primary/30 transition-colors">
      <CardHeader className="bg-primary/5 p-6">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-primary font-bold text-lg">{amount}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Осталось:</span>
          <span className="font-mono font-bold text-primary">{formatTime(initialTime)}</span>
        </div>
        <Button 
          className="w-full bg-primary text-primary-foreground" 
          disabled={disabled}
          onClick={onParticipate}
        >
          {participated ? "Вы участвуете" : "Участвовать"}
        </Button>
      </CardContent>
    </Card>
  );
}