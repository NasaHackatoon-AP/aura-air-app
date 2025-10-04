"use client";

import { useState, useEffect } from "react";
import { EmergencyToast } from "../EmergencyToast/EmergencyToast";
import {
  EmergencyNotification,
  EmergencyAlert,
  emergencyService,
} from "@/services/emergencyService";
import { useAlerts } from "@/contexts/AlertContext";

export function EmergencyNotificationManager() {
  const [notifications, setNotifications] = useState<EmergencyNotification[]>(
    []
  );
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { showAlerts } = useAlerts();

  useEffect(() => {
    // Solicita permissão para notificações
    const requestPermission = async () => {
      const granted = await emergencyService.requestNotificationPermission();
      setIsPermissionGranted(granted);
    };

    requestPermission();

    // Adiciona listener para novas notificações
    const removeListener = emergencyService.addListener((notification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Envia notificação push se permitido
      if (isPermissionGranted) {
        emergencyService.sendPushNotification(notification);
      }

      // Mostra modal de alertas para notificações críticas
      if (notification.priority === "critical") {
        setTimeout(() => {
          showAlerts();
        }, 1000);
      }
    });

    // NÃO inicia monitoramento automaticamente - apenas quando solicitado manualmente
    // emergencyService.startEmergencyMonitoring();

    // Cleanup
    return () => {
      removeListener();
      emergencyService.stopEmergencyMonitoring();
    };
  }, [isPermissionGranted, showAlerts]);

  const handleDismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    emergencyService.markAsRead(notificationId);
  };

  const handleViewDetails = (alert: EmergencyAlert) => {
    // Aqui você pode implementar navegação para detalhes do alerta
    console.log("Visualizar detalhes do alerta:", alert);
    showAlerts();
  };

  // Limita a 3 notificações visíveis por vez
  const visibleNotifications = notifications.slice(0, 3);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
      {visibleNotifications.map((notification) => (
        <EmergencyToast
          key={notification.id}
          notification={notification}
          onDismiss={handleDismissNotification}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
}
