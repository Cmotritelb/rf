import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 container mx-auto px-4">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-20 pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
              Новое поколение DeFi
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Легкий вход в мир <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 text-glow">
                цифровых финансов
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Безопасное хранение, мгновенные переводы и обмен криптовалют в едином интерфейсе S-Wallet.Ton.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-50 pointer-events-auto"
          >
            <Link href="/airdrops">
              <a className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl flex items-center justify-center cursor-pointer">
                Открыть счет
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Link>
            <Link href="/airdrops">
              <a className="w-full sm:w-auto h-14 px-8 rounded-xl border border-primary/20 text-primary hover:bg-primary/10 flex items-center justify-center cursor-pointer">
                Участвовать в AirDrop
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-primary" />}
              title="Безопасность"
              description="Двухфакторная аутентификация и холодное хранение средств обеспечивают максимальную защиту."
            />
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-primary" />}
              title="Скорость"
              description="Мгновенные транзакции и обмен валют без задержек и скрытых комиссий."
            />
            <FeatureCard 
              icon={<Globe className="w-10 h-10 text-primary" />}
              title="Доступность"
              description="Управляйте активами из любой точки мира через удобное мобильное приложение."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted-foreground text-sm">
            © 2024 S-Wallet.Ton. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-colors group">
      <div className="mb-6 bg-primary/10 w-fit p-3 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
