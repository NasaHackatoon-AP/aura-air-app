"use client";

import { useEffect } from "react";
import { useAlerts } from "@/contexts/AlertContext";
import { AlertModal } from "./AlertModal/AlertModal";
import { useModal } from "@/contexts/ModalContext";

export function AlertWrapper() {
  const { alerts, isModalOpen, hideAlerts, dismissAlert } = useAlerts();
  const { openModal, closeModal } = useModal();

  // Sincronizar com o contexto de modal
  useEffect(() => {
    if (isModalOpen) {
      openModal("alerts");
    } else {
      closeModal("alerts");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleClose = () => {
    hideAlerts();
    closeModal("alerts");
  };

  return (
    <AlertModal
      alerts={alerts}
      isOpen={isModalOpen}
      onClose={handleClose}
      onDismiss={dismissAlert}
    />
  );
}
