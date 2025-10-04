"use client";

import { useEffect } from "react";
import { useAlerts } from "@/contexts/AlertContext";

export function useAlertNotifications() {
  const { alerts, showAlerts, isModalOpen } = useAlerts();

  // Mostra alertas automaticamente quando há alertas críticos
  useEffect(() => {
    const criticalAlerts = alerts.filter((alert) =>
      "severity" in alert
        ? alert.severity === "critical"
        : alert.riskLevel === "critical"
    );

    if (criticalAlerts.length > 0 && !isModalOpen) {
      // Pequeno delay para garantir que a UI esteja pronta
      const timer = setTimeout(() => {
        showAlerts();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [alerts, isModalOpen, showAlerts]);

  return {
    hasCriticalAlerts: alerts.some((alert) =>
      "severity" in alert
        ? alert.severity === "critical"
        : alert.riskLevel === "critical"
    ),
    totalAlerts: alerts.length,
    disasterAlerts: alerts.filter((alert) => "type" in alert),
    healthAlerts: alerts.filter((alert) => "condition" in alert),
  };
}
