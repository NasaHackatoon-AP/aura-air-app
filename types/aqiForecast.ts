/**
 * Tipos TypeScript para a API de Previsão de AQI
 * Air Aura App - NASA Space Apps Challenge 2024
 */

export interface AQIForecastRequest {
  usuario_id: number;
}

export interface AQIData {
  data: string; // Data da previsão (YYYY-MM-DD)
  aqi: number; // Índice de qualidade do ar
  categoria: AQICategory;
  poluentes: PollutantData[];
  recomendacoes: string[];
  risco_saude: HealthRisk;
}

// Estrutura real da API (baseada na resposta real)
export interface AQIForecastResponse {
  aqi_original: number;
  aqi_personalizado: number;
  nivel_alerta: string;
}

// Estrutura esperada (para compatibilidade com componentes)
export interface AQIForecastResponseExtended {
  usuario_id: number;
  cidade: string;
  estado: string;
  coordenadas: {
    latitude: number;
    longitude: number;
  };
  previsao: AQIData[];
  ultima_atualizacao: string;
  fonte_dados: string;
  precisao: number; // Precisão da previsão (0-100%)
}

export interface PollutantData {
  nome: string; // Nome do poluente (PM2.5, PM10, O3, NO2, etc.)
  concentracao: number; // Concentração em μg/m³
  unidade: string; // Unidade de medida
  limite_recomendado: number; // Limite recomendado pela OMS
  status: PollutantStatus;
}

export type AQICategory =
  | "Bom"
  | "Moderado"
  | "Insalubre para grupos sensíveis"
  | "Insalubre"
  | "Muito insalubre"
  | "Perigoso";

export type PollutantStatus =
  | "Bom"
  | "Moderado"
  | "Alto"
  | "Muito Alto"
  | "Perigoso";

export type HealthRisk =
  | "Baixo"
  | "Moderado"
  | "Alto"
  | "Muito Alto"
  | "Crítico";

export interface AQIForecastError {
  message: string;
  code?: string;
  details?: any;
}

export interface AQIForecastState {
  forecast: AQIForecastResponse | null;
  isLoading: boolean;
  error: string | null;
  hasForecast: boolean;
}

export interface UseAQIForecastOptions {
  userId?: number;
  autoFetch?: boolean;
}

export interface AQIForecastService {
  getForecast: (userId: number) => Promise<AQIForecastResponse>;
}

// Constantes para validação
export const AQI_CATEGORIES = {
  GOOD: "Bom",
  MODERATE: "Moderado",
  UNHEALTHY_SENSITIVE: "Insalubre para grupos sensíveis",
  UNHEALTHY: "Insalubre",
  VERY_UNHEALTHY: "Muito insalubre",
  HAZARDOUS: "Perigoso",
} as const;

export const POLLUTANT_STATUS = {
  GOOD: "Bom",
  MODERATE: "Moderado",
  HIGH: "Alto",
  VERY_HIGH: "Muito Alto",
  DANGEROUS: "Perigoso",
} as const;

export const HEALTH_RISKS = {
  LOW: "Baixo",
  MODERATE: "Moderado",
  HIGH: "Alto",
  VERY_HIGH: "Muito Alto",
  CRITICAL: "Crítico",
} as const;

export const POLLUTANTS = {
  PM25: "PM2.5",
  PM10: "PM10",
  O3: "O3",
  NO2: "NO2",
  SO2: "SO2",
  CO: "CO",
} as const;

// Cores para categorias de AQI
export const AQI_COLORS = {
  Bom: "#00E400",
  Moderado: "#FFFF00",
  "Insalubre para grupos sensíveis": "#FF7E00",
  Insalubre: "#FF0000",
  "Muito insalubre": "#8F3F97",
  Perigoso: "#7E0023",
} as const;

// Limites de AQI
export const AQI_LIMITS = {
  GOOD: { min: 0, max: 50 },
  MODERATE: { min: 51, max: 100 },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150 },
  UNHEALTHY: { min: 151, max: 200 },
  VERY_UNHEALTHY: { min: 201, max: 300 },
  HAZARDOUS: { min: 301, max: 500 },
} as const;
