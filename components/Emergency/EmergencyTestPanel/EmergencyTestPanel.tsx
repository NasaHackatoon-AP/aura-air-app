"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, Zap, Shield } from "lucide-react";
import { emergencyService } from "@/services/emergencyService";

export function EmergencyTestPanel() {
  const [isMonitoring, setIsMonitoring] = useState(false);

  const testEmergencyAlert = () => {
    emergencyService.createSystemAlert(
      "🚨 TESTE DE EMERGÊNCIA",
      "Este é um teste do sistema de alertas de emergência. Em uma situação real, você receberia notificações sobre desastres naturais e riscos à saúde.",
      "high"
    );
  };

  const testCriticalAlert = () => {
    emergencyService.createSystemAlert(
      "⚠️ ALERTA CRÍTICO DE TESTE",
      "Simulação de alerta crítico - terremoto detectado na região. Procure abrigo imediatamente!",
      "critical"
    );
  };

  const testHealthAlert = () => {
    emergencyService.createSystemAlert(
      "🏥 ALERTA DE SAÚDE",
      "Qualidade do ar crítica detectada. Pessoas com problemas respiratórios devem evitar atividades ao ar livre.",
      "medium"
    );
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      emergencyService.stopEmergencyMonitoring();
      setIsMonitoring(false);
    } else {
      emergencyService.startEmergencyMonitoring();
      setIsMonitoring(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-5 w-5" />
          <span className="hidden sm:inline">
            Painel de Teste - Sistema de Emergência
          </span>
          <span className="sm:hidden">Teste de Emergência</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Teste o sistema de notificações de emergência e alertas em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? "Monitoramento Ativo" : "Monitoramento Inativo"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Button
            onClick={testEmergencyAlert}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Teste Alerta Normal</span>
            <span className="sm:hidden">Alerta Normal</span>
          </Button>

          <Button
            onClick={testCriticalAlert}
            variant="destructive"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Teste Alerta Crítico</span>
            <span className="sm:hidden">Alerta Crítico</span>
          </Button>

          <Button
            onClick={testHealthAlert}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Teste Alerta de Saúde</span>
            <span className="sm:hidden">Alerta Saúde</span>
          </Button>

          <Button
            onClick={toggleMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">
              {isMonitoring ? "Parar Monitoramento" : "Iniciar Monitoramento"}
            </span>
            <span className="sm:hidden">
              {isMonitoring ? "Parar" : "Iniciar"}
            </span>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Como funciona:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • <strong>Alertas Normais:</strong> Aparecem como toast no canto
              superior direito
            </li>
            <li>
              • <strong>Alertas Críticos:</strong> Abrem automaticamente o modal
              de alertas
            </li>
            <li>
              • <strong>Monitoramento:</strong> Gera alertas automáticos a cada
              2-5 minutos
            </li>
            <li>
              • <strong>Notificações Push:</strong> Funcionam se o navegador
              permitir
            </li>
            <li>
              • <strong>Auto-dismiss:</strong> Alertas normais desaparecem em 10
              segundos
            </li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Para testar notificações push, permita
            notificações no navegador quando solicitado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
