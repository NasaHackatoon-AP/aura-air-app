/**
 * Tipos TypeScript para a API de Perfil de Saúde
 * Air Aura App - NASA Space Apps Challenge 2024
 */

export interface HealthProfileRequest {
  usuario_id: number;
  possui_asma: boolean;
  possui_dpoc: boolean;
  possui_alergias: boolean;
  fumante: boolean;
  sensibilidade_alta: boolean;
}

export interface HealthProfileResponse {
  id: number;
  usuario_id: number;
  possui_asma: boolean;
  possui_dpoc: boolean;
  possui_alergias: boolean;
  fumante: boolean;
  sensibilidade_alta: boolean;
  data_criacao: string;
  ultima_atualizacao: string;
}

export interface HealthProfileFormData {
  possui_asma: boolean;
  possui_dpoc: boolean;
  possui_alergias: boolean;
  fumante: boolean;
  sensibilidade_alta: boolean;
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  severity: "low" | "moderate" | "high" | "severe";
  affectedSystems: string[];
}

export interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: "air_quality" | "weather" | "emergency" | "general";
  conditions: string[]; // IDs das condições que geram esta recomendação
}

export interface HealthProfileError {
  message: string;
  code?: string;
  details?: any;
}

export interface HealthProfileState {
  profile: HealthProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  hasProfile: boolean;
}

export interface UseHealthProfileOptions {
  userId?: number;
  autoFetch?: boolean;
}

export interface HealthProfileService {
  createProfile: (data: HealthProfileRequest) => Promise<HealthProfileResponse>;
  getProfile: (userId: number) => Promise<HealthProfileResponse | null>;
  updateProfile: (
    userId: number,
    data: HealthProfileRequest
  ) => Promise<HealthProfileResponse>;
  deleteProfile: (userId: number) => Promise<void>;
}

// Constantes para validação
export const HEALTH_PROFILE_FIELDS = {
  USUARIO_ID: "usuario_id",
  POSSUI_ASMA: "possui_asma",
  POSSUI_DPOC: "possui_dpoc",
  POSSUI_ALERGIAS: "possui_alergias",
  FUMANTE: "fumante",
  SENSIBILIDADE_ALTA: "sensibilidade_alta",
} as const;

export const HEALTH_CONDITIONS = {
  ASMA: "asma",
  DPOC: "dpoc",
  ALERGIAS: "alergias",
  FUMANTE: "fumante",
  SENSIBILIDADE_ALTA: "sensibilidade_alta",
} as const;

export const HEALTH_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const HEALTH_CATEGORIES = {
  AIR_QUALITY: "air_quality",
  WEATHER: "weather",
  EMERGENCY: "emergency",
  GENERAL: "general",
} as const;
