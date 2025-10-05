"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { DisasterAlert, HealthRiskAlert, Location } from "@/types/alerts";
import { alertService } from "@/services/alertService";

interface AlertContextType {
  alerts: (DisasterAlert | HealthRiskAlert)[];
  isModalOpen: boolean;
  isLoading: boolean;
  showAlerts: () => void;
  hideAlerts: () => void;
  dismissAlert: (alertId: string) => void;
  loginUser: (location: Location, healthConditions?: string[]) => Promise<void>;
  updateLocation: (location: Location) => Promise<void>;
  updateHealthConditions: (conditions: string[]) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<(DisasterAlert | HealthRiskAlert)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showAlerts = () => {
    setIsModalOpen(true);
  };

  const hideAlerts = () => {
    setIsModalOpen(false);
  };

  const dismissAlert = (alertId: string) => {
    alertService.dismissAlert(alertId);
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const loginUser = async (
    location: Location,
    healthConditions: string[] = []
  ) => {
    setIsLoading(true);
    try {
      const { disasterAlerts, healthAlerts } = await alertService.loginUser(
        location,
        healthConditions
      );
      setAlerts([...disasterAlerts, ...healthAlerts]);

      // Mostra os alertas automaticamente se houver algum
      if (disasterAlerts.length > 0 || healthAlerts.length > 0) {
        // Delay de 2 segundos para dar tempo do login completar
        setTimeout(() => {
          setIsModalOpen(true);
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (location: Location) => {
    setIsLoading(true);
    try {
      await alertService.updateUserLocation(location);
      const activeAlerts = alertService.getActiveAlerts();
      setAlerts(activeAlerts);
    } catch (error) {
      console.error("Erro ao atualizar localização:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHealthConditions = async (conditions: string[]) => {
    setIsLoading(true);
    try {
      await alertService.updateHealthConditions(conditions);
      const activeAlerts = alertService.getActiveAlerts();
      setAlerts(activeAlerts);
    } catch (error) {
      console.error("Erro ao atualizar condições de saúde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Configura atualizações em tempo real
  useEffect(() => {
    const handleRealTimeUpdate = (
      newAlerts: (DisasterAlert | HealthRiskAlert)[]
    ) => {
      setAlerts(newAlerts);
      // Se há novos alertas críticos, mostra o modal automaticamente
      const criticalAlerts = newAlerts.filter((alert) =>
        "severity" in alert
          ? alert.severity === "critical"
          : alert.riskLevel === "critical"
      );
      if (criticalAlerts.length > 0) {
        setIsModalOpen(true);
      }
    };

    alertService.startRealTimeUpdates(handleRealTimeUpdate);

    return () => {
      alertService.stopRealTimeUpdates();
    };
  }, []);

  const value: AlertContextType = {
    alerts,
    isModalOpen,
    isLoading,
    showAlerts,
    hideAlerts,
    dismissAlert,
    loginUser,
    updateLocation,
    updateHealthConditions,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts deve ser usado dentro de um AlertProvider");
  }
  return context;
}
