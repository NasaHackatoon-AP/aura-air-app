import { LoginForm } from "@/components/Authentication/LoginForm/LoginForm";
import { Cloud, Wind } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Cloud className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <Wind className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Air Aura
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Monitoramento inteligente do clima e qualidade do ar
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
