import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Menu, X, Wallet, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthPage = location === "/login" || location === "/register";
  
  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Wallet className="w-6 h-6 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              S-Wallet.Ton
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Главная
          </Link>
          <Link href="/airdrops" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            AirDrop
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            О нас
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-sm font-medium">
                  Кабинет
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }} 
                variant="outline" 
                size="sm"
                className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25">
                Авторизация
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l-white/10">
              <div className="flex flex-col gap-6 mt-10">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    Главная
                  </div>
                </Link>
                <Link href="/about" onClick={() => setIsOpen(false)}>
                  <div className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    О нас
                  </div>
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <div className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg cursor-pointer text-primary">
                        Личный кабинет
                      </div>
                    </Link>
                    <div 
                      onClick={() => { 
                        logout(); 
                        setIsOpen(false); 
                        window.location.href = "/login";
                      }}
                      className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg cursor-pointer text-destructive"
                    >
                      Выйти
                    </div>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      Войти
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
