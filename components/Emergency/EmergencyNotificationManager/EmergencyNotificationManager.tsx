"use client";

import { useState, useEffect } from "react";
import { EmergencyToast } from "../EmergencyToast/EmergencyToast";
import {
  EmergencyNotification,
  EmergencyAlert,
  emergencyService,
} from "@/services/emergencyService";
export function EmergencyNotificationManager() {
  const [notifications, setNotifications] = useState<EmergencyNotification[]>(
    []
  );
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    // Solicita permissão para notificações
    const requestPermission = async () => {
      const granted = await emergencyService.requestNotificationPermission();
      setIsPermissionGranted(granted);
    };

    requestPermission();
  }, []);

  useEffect(() => {
    // Adiciona listener para novas notificações
    const removeListener = emergencyService.addListener((notification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Envia notificação push se permitido
      if (isPermissionGranted) {
        emergencyService.sendPushNotification(notification);
      }

      // Notificações críticas são exibidas como toast
      if (notification.priority === "critical") {
        console.log("Notificação crítica recebida:", notification);
      }
    });

    // NÃO inicia monitoramento automaticamente - apenas quando solicitado manualmente
    // emergencyService.startEmergencyMonitoring();

    // Cleanup
    return () => {
      removeListener();
      emergencyService.stopEmergencyMonitoring();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPermissionGranted]);

  const handleDismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    emergencyService.markAsRead(notificationId);
  };

  const handleViewDetails = (alert: EmergencyAlert) => {
    // Aqui você pode implementar navegação para detalhes do alerta
    console.log("Visualizar detalhes do alerta:", alert);
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
