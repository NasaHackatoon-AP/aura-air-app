"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  name: string;
  email: string;
  location: string;
  avatar?: string;
}

const defaultProfile: UserProfile = {
  name: "João Silva",
  email: "joao.silva@email.com",
  location: "São Paulo, Brasil",
  avatar: undefined,
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega perfil do localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("user-profile");
      if (savedProfile) {
        setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva perfil no localStorage
  const saveProfile = (newProfile: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...newProfile };
    setProfile(updatedProfile);

    try {
      localStorage.setItem("user-profile", JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  // Atualiza uma propriedade específica do perfil
  const updateProfile = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    saveProfile({ [key]: value });
  };

  return {
    profile,
    isLoading,
    saveProfile,
    updateProfile,
  };
}
