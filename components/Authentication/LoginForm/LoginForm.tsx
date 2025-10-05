"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAlerts } from "@/contexts/AlertContext";
import { loginUser as loginService } from "@/services/serviceUser";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export function LoginForm() {
  const router = useRouter();
  const { loginUser: alertsLoginUser } = useAlerts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos");
        setIsLoading(false);
        return;
      }

  const res = await loginService({ email, senha: password });

  // Expecting { access_token, token_type, usuario }
  const token = (res as any)?.data?.access_token;
      if (token) {
        // Save token for API calls
        localStorage.setItem('token', token);
        // set a cookie so middleware can read it (not HttpOnly)
        document.cookie = `access_token=${token}; path=/; samesite=lax`;


        // Optionally call alerts flow from context if available
        try {
          const userLocation = { latitude: -23.5505, longitude: -46.6333, city: 'São Paulo', state: 'SP', country: 'Brasil' };
          const healthConditions: string[] = [];
          if (alertsLoginUser) await alertsLoginUser(userLocation, healthConditions);
        } catch (e) {
          // ignore if alerts context not available
        }

        router.push('/dashboard');
      } else {
        setIsErrorDialogOpen(true);
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      // Show modal with incorrect credentials message
      setIsErrorDialogOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <Card
      className="w-full shadow-xl border border-border/50 bg-card/95 backdrop-blur-sm rounded-xl"
      data-preserve-width
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl">Entrar</CardTitle>
        <CardDescription className="text-sm">
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isErrorDialogOpen && (
            <AlertDialog open={isErrorDialogOpen} onOpenChange={(open) => setIsErrorDialogOpen(open)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Erro ao entrar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsErrorDialogOpen(false)}>Fechar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <br />
        <CardFooter className="flex flex-col gap-3 sm:gap-4">
          <Button
            type="submit"
            className="w-full text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Não tem uma conta?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
