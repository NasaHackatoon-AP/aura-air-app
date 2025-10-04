"use client";

import { useAlerts } from "@/contexts/AlertContext";
import { AlertModal } from "./AlertModal/AlertModal";

export function AlertWrapper() {
  const { alerts, isModalOpen, hideAlerts, dismissAlert } = useAlerts();

  return (
    <AlertModal
      alerts={alerts}
      isOpen={isModalOpen}
      onClose={hideAlerts}
      onDismiss={dismissAlert}
    />
  );
}
