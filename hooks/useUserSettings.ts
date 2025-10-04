"use client";

import { useState, useEffect } from "react";

interface UserSettings {
  notifications: boolean;
  emergencyAlerts: boolean;
  pushNotifications: boolean;
  updateInterval: number;
  language: string;
  emergencyRadius: number;
  criticalAlerts: boolean;
  // Emergency specific settings
  isMonitoringEnabled: boolean;
  notificationRadius: number;
  pushNotificationsEnabled: boolean;
}

const defaultSettings: UserSettings = {
  notifications: true,
  emergencyAlerts: true,
  pushNotifications: false,
  updateInterval: 15,
  language: "pt-BR",
  emergencyRadius: 100,
  criticalAlerts: true,
  // Emergency specific settings
  isMonitoringEnabled: true,
  notificationRadius: 100,
  pushNotificationsEnabled: false,
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega configurações do localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("user-settings");
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva configurações no localStorage
  const saveSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      localStorage.setItem("user-settings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  // Atualiza uma configuração específica e salva automaticamente
  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    try {
      localStorage.setItem("user-settings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  // Restaura configurações padrão
  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem("user-settings");
    } catch (error) {
      console.error("Erro ao resetar configurações:", error);
    }
  };

  return {
    settings,
    isLoading,
    saveSettings,
    updateSetting,
    resetSettings,
  };
}
