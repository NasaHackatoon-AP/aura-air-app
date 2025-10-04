"use client";

import { useState, useEffect } from "react";
import { emergencyService } from "@/services/emergencyService";

interface EmergencyConfig {
  isMonitoringEnabled: boolean;
  notificationRadius: number;
  pushNotificationsEnabled: boolean;
  criticalAlertsEnabled: boolean;
  lastUpdated: string;
}

const defaultConfig: EmergencyConfig = {
  isMonitoringEnabled: false,
  notificationRadius: 50,
  pushNotificationsEnabled: false,
  criticalAlertsEnabled: true,
  lastUpdated: new Date().toISOString(),
};

export function useEmergencyConfig() {
  const [config, setConfig] = useState<EmergencyConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega configurações salvas
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem("emergency-config");
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig({ ...defaultConfig, ...parsedConfig });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<EmergencyConfig>) => {
    setIsLoading(true);

    try {
      const updatedConfig = {
        ...config,
        ...newConfig,
        lastUpdated: new Date().toISOString(),
      };
      setConfig(updatedConfig);

      localStorage.setItem("emergency-config", JSON.stringify(updatedConfig));

      // Aplica configurações ao serviço
      if (updatedConfig.isMonitoringEnabled) {
        emergencyService.startEmergencyMonitoring();
      } else {
        emergencyService.stopEmergencyMonitoring();
      }

      // Solicita permissão para notificações push se habilitado
      if (updatedConfig.pushNotificationsEnabled) {
        await emergencyService.requestNotificationPermission();
      }

      return updatedConfig;
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("emergency-config");

    // Para o monitoramento
    emergencyService.stopEmergencyMonitoring();
  };

  const testNotification = () => {
    emergencyService.createSystemAlert(
      "🔔 Teste de Notificação",
      "Esta é uma notificação de teste do sistema de emergência.",
      "medium"
    );
  };

  return {
    config,
    isLoading,
    updateConfig,
    resetConfig,
    testNotification,
  };
}
