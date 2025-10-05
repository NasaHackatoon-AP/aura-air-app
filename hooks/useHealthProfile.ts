import { useState, useEffect } from "react";
import healthProfileService from "@/services/healthProfileService";
import {
  HealthProfileRequest,
  HealthProfileResponse,
  UseHealthProfileOptions,
} from "@/types/healthProfile";

export function useHealthProfile({
  userId,
  autoFetch = true,
}: UseHealthProfileOptions = {}) {
  const [profile, setProfile] = useState<HealthProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch profile when component mounts or userId changes
  useEffect(() => {
    if (autoFetch && userId) {
      fetchProfile();
    }
  }, [userId, autoFetch]);

  const fetchProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const profileData = await healthProfileService.getProfile(userId);
      setProfile(profileData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar perfil de saúde"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (profileData: HealthProfileRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const newProfile = await healthProfileService.createProfile(profileData);
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar perfil de saúde"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: HealthProfileRequest) => {
    if (!userId) throw new Error("ID do usuário é obrigatório");

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await healthProfileService.updateProfile(
        userId,
        profileData
      );
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar perfil de saúde"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!userId) throw new Error("ID do usuário é obrigatório");

    setIsLoading(true);
    setError(null);

    try {
      await healthProfileService.deleteProfile(userId);
      setProfile(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao deletar perfil de saúde"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    hasProfile: !!profile,
  };
}
