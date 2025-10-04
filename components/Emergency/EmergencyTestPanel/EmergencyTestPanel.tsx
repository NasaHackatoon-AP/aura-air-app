"use client";

import { useState } from "react";
import { TouchOptimizedButton } from "@/components/Mobile/TouchOptimizedButton/TouchOptimizedButton";
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
      "🌪️ Condições Meteorológicas Severas",
      "Ventos de até 85 km/h e chuva intensa detectados. Evite áreas abertas e mantenha-se em local seguro pelos próximos 45 minutos.",
      "high"
    );
  };

  const testCriticalAlert = () => {
    emergencyService.createSystemAlert(
      "🚨 EMERGÊNCIA - Evacuação Imediata",
      "Atividade sísmica de magnitude 6.1 registrada. Saia do prédio imediatamente, use escadas, dirija-se ao ponto de encontro mais próximo.",
      "critical"
    );
  };

  const testHealthAlert = () => {
    emergencyService.createSystemAlert(
      "🫁 Alerta Atmosférico - Ar Perigoso",
      "IQA atingiu 185 (muito insalubre). Grupos sensíveis devem usar máscaras N95 e evitar atividades externas até nova avaliação.",
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
    <Card className="w-full">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
            onClick={testEmergencyAlert}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-blue-500 text-white group-hover:bg-blue-600 transition-colors">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Teste Alerta Normal
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Notificação padrão
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-red-300 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
            onClick={testCriticalAlert}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-red-500 text-white group-hover:bg-red-600 transition-colors">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Teste Alerta Crítico
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Emergência máxima
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-green-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
            onClick={testHealthAlert}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-green-500 text-white group-hover:bg-green-600 transition-colors">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Teste Alerta de Saúde
                </h3>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Qualidade do ar
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
              isMonitoring
                ? "hover:border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
                : "hover:border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
            }`}
            onClick={toggleMonitoring}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div
                className={`p-3 rounded-full text-white transition-colors ${
                  isMonitoring
                    ? "bg-orange-500 group-hover:bg-orange-600"
                    : "bg-purple-500 group-hover:bg-purple-600"
                }`}
              >
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    isMonitoring
                      ? "text-orange-900 dark:text-orange-100"
                      : "text-purple-900 dark:text-purple-100"
                  }`}
                >
                  {isMonitoring
                    ? "Parar Monitoramento"
                    : "Iniciar Monitoramento"}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    isMonitoring
                      ? "text-orange-700 dark:text-orange-300"
                      : "text-purple-700 dark:text-purple-300"
                  }`}
                >
                  {isMonitoring ? "Sistema ativo" : "Sistema inativo"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-l-4 border-l-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Como funciona:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div>
                  <strong>Alertas Normais:</strong> Aparecem como toast no canto
                  superior direito
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                <div>
                  <strong>Alertas Críticos:</strong> Abrem automaticamente o
                  modal de alertas
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                <div>
                  <strong>Monitoramento:</strong> Gera alertas automáticos a
                  cada 2-5 minutos
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <div>
                  <strong>Auto-dismiss:</strong> Alertas normais desaparecem em
                  10 segundos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-500 text-white flex-shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  💡 Dica de Notificações
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Para testar notificações push, permita notificações no
                  navegador quando solicitado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
