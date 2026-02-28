import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 border-white/10">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">Страница не найдена</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          
          <div className="mt-8">
            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
