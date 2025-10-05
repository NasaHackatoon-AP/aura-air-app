"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface ModalContextType {
  isAnyModalOpen: boolean;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  const openModal = useCallback((modalId: string) => {
    setOpenModals((prev) => new Set(prev).add(modalId));
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setOpenModals((prev) => {
      const newSet = new Set(prev);
      newSet.delete(modalId);
      return newSet;
    });
  }, []);

  const isAnyModalOpen = openModals.size > 0;

  return (
    <ModalContext.Provider value={{ isAnyModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
