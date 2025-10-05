"use client";

import { useState, useEffect, useCallback } from "react";
import { useHealthProfile } from "./useHealthProfile";
import { useAirQuality } from "./useAirQuality";
import { useWeatherConditions } from "./useWeatherConditions";

interface PersonalizedAlert {
  id: string;
  type: "air_quality" | "uv" | "temperature" | "humidity" | "wind" | "general";
  severity: "low" | "moderate" | "high" | "critical";
  title: string;
  description: string;
  recommendations: string[];
  healthCondition?: string;
  icon: string;
  color: string;
}

interface PersonalizedHealthAlertsData {
  alerts: PersonalizedAlert[];
  hasProfile: boolean;
  profileConditions: string[];
  lastUpdated: string;
}

interface UsePersonalizedHealthAlertsOptions {
  userId: number;
  autoFetch?: boolean;
  refreshInterval?: number;
}

export function usePersonalizedHealthAlerts({
  userId,
  autoFetch = true,
  refreshInterval = 300000, // 5 minutos
}: UsePersonalizedHealthAlertsOptions) {
  const [data, setData] = useState<PersonalizedHealthAlertsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks para dados necessários
  const { data: healthProfile, isLoading: profileLoading } = useHealthProfile({
    userId,
    autoFetch,
  });

  const { data: airQuality, isLoading: airQualityLoading } = useAirQuality({
    userId,
    autoFetch,
  });

  const { data: weatherData, isLoading: weatherLoading } = useWeatherConditions(
    {
      userId,
      autoFetch,
    }
  );

  const generatePersonalizedAlerts = useCallback(async () => {
    if (!healthProfile || !airQuality || !weatherData) {
      return null;
    }

    try {
      // Simular chamada para IA do chatbot
      const response = await fetch("/api/chatbot/health-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          healthProfile,
          airQuality,
          weatherData,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const alertsData = await response.json();
      return alertsData;
    } catch (error) {
      console.error("❌ Erro ao gerar alertas personalizados:", error);
      // Fallback: gerar alertas localmente
      return generateLocalAlerts(healthProfile, airQuality, weatherData);
    }
  }, [healthProfile, airQuality, weatherData, userId]);

  const generateLocalAlerts = (
    profile: any,
    airQuality: any,
    weather: any
  ): PersonalizedAlert[] => {
    const alerts: PersonalizedAlert[] = [];
    const conditions = profile.condicoes_saude || [];
    const aqi = airQuality.aqi_personalizado || airQuality.aqi_original || 50;
    const temperature = weather.clima?.temperatura || 25;
    const humidity = weather.clima?.umidade || 50;
    const wind = weather.clima?.vento || 5;
    const uvIndex = calculateUVIndex(weather.clima?.descricao || "céu limpo");

    // Alerta de Qualidade do Ar baseado nas condições de saúde
    if (aqi > 50) {
      const severity = aqi > 100 ? "high" : aqi > 75 ? "moderate" : "low";
      const condition = conditions.includes("Asma")
        ? "Asma"
        : conditions.includes("Bronquite")
        ? "Bronquite"
        : conditions.includes("Rinite")
        ? "Rinite"
        : "Geral";

      alerts.push({
        id: "air_quality",
        type: "air_quality",
        severity,
        title: "Qualidade do Ar Moderada",
        description: `Os níveis de PM2.5 estão moderados. Pessoas com ${condition.toLowerCase()} podem sentir desconforto respiratório leve.`,
        recommendations: generateAirQualityRecommendations(condition, aqi),
        healthCondition: condition,
        icon: "🌫️",
        color:
          severity === "high"
            ? "text-red-600"
            : severity === "moderate"
            ? "text-orange-600"
            : "text-yellow-600",
      });
    }

    // Alerta de Índice UV baseado nas condições de saúde
    if (uvIndex >= 6) {
      const hasSkinCondition = conditions.some(
        (c: string) =>
          c.includes("Dermatite") ||
          c.includes("Psoríase") ||
          c.includes("Vitiligo")
      );

      alerts.push({
        id: "uv_index",
        type: "uv",
        severity: uvIndex >= 8 ? "high" : "moderate",
        title: "Índice UV Alto",
        description: hasSkinCondition
          ? "O índice UV está alto hoje. Pessoas com condições de pele precisam de proteção extra."
          : "O índice UV está alto hoje. Proteção solar é recomendada.",
        recommendations: generateUVRecommendations(hasSkinCondition),
        healthCondition: hasSkinCondition ? "Condições de Pele" : "Geral",
        icon: "☀️",
        color: uvIndex >= 8 ? "text-red-600" : "text-orange-600",
      });
    }

    // Alerta de Temperatura baseado nas condições de saúde
    if (temperature > 35 || temperature < 10) {
      const hasHeartCondition = conditions.some(
        (c: string) => c.includes("Hipertensão") || c.includes("Cardiopatia")
      );

      alerts.push({
        id: "temperature",
        type: "temperature",
        severity: temperature > 38 || temperature < 5 ? "high" : "moderate",
        title: temperature > 35 ? "Calor Intenso" : "Frio Intenso",
        description: hasHeartCondition
          ? `Temperatura extrema (${temperature}°C). Pessoas com condições cardíacas precisam de cuidado especial.`
          : `Temperatura extrema (${temperature}°C). Cuidado com desidratação e hipotermia.`,
        recommendations: generateTemperatureRecommendations(
          temperature,
          hasHeartCondition
        ),
        healthCondition: hasHeartCondition ? "Condições Cardíacas" : "Geral",
        icon: temperature > 35 ? "🌡️" : "❄️",
        color:
          temperature > 38 || temperature < 5
            ? "text-red-600"
            : "text-orange-600",
      });
    }

    return alerts;
  };

  const generateAirQualityRecommendations = (
    condition: string,
    aqi: number
  ): string[] => {
    const baseRecommendations = [
      "Evite exercícios intensos ao ar livre",
      "Mantenha medicação de resgate por perto",
      "Considere usar máscara ao sair",
    ];

    if (condition === "Asma") {
      return [
        ...baseRecommendations,
        "Use inalador preventivo conforme prescrito",
        "Evite áreas com muito tráfego",
      ];
    }

    if (condition === "Bronquite") {
      return [
        ...baseRecommendations,
        "Evite fumaça e poluentes",
        "Mantenha ambiente úmido",
      ];
    }

    return baseRecommendations;
  };

  const generateUVRecommendations = (hasSkinCondition: boolean): string[] => {
    const baseRecommendations = [
      "Use protetor solar FPS 30+",
      "Evite exposição entre 10h-16h",
      "Use óculos de sol e chapéu",
    ];

    if (hasSkinCondition) {
      return [
        ...baseRecommendations,
        "Use protetor solar FPS 50+",
        "Reaplique protetor a cada 2 horas",
        "Use roupas com proteção UV",
      ];
    }

    return baseRecommendations;
  };

  const generateTemperatureRecommendations = (
    temperature: number,
    hasHeartCondition: boolean
  ): string[] => {
    if (temperature > 35) {
      const baseRecommendations = [
        "Beba muita água",
        "Evite atividades ao ar livre",
        "Use roupas leves e claras",
      ];

      if (hasHeartCondition) {
        return [
          ...baseRecommendations,
          "Monitore pressão arterial",
          "Evite esforço físico excessivo",
          "Mantenha medicamentos refrigerados",
        ];
      }

      return baseRecommendations;
    } else {
      const baseRecommendations = [
        "Use roupas quentes",
        "Evite exposição prolongada ao frio",
        "Mantenha-se hidratado",
      ];

      if (hasHeartCondition) {
        return [
          ...baseRecommendations,
          "Monitore pressão arterial",
          "Evite mudanças bruscas de temperatura",
          "Mantenha medicamentos em temperatura adequada",
        ];
      }

      return baseRecommendations;
    }
  };

  const calculateUVIndex = (description: string): number => {
    const hour = new Date().getHours();
    let baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8;

    if (description.includes("limpo") || description.includes("ensolarado")) {
      baseUV *= 1.2;
    } else if (description.includes("nublado")) {
      baseUV *= 0.6;
    }

    return Math.max(0, Math.round(baseUV));
  };

  const fetchAlerts = useCallback(async () => {
    if (!autoFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      const alerts = await generatePersonalizedAlerts();

      if (alerts) {
        setData({
          alerts,
          hasProfile: !!healthProfile,
          profileConditions: healthProfile?.condicoes_saude || [],
          lastUpdated: new Date().toLocaleString("pt-BR"),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [autoFetch, generatePersonalizedAlerts, healthProfile]);

  useEffect(() => {
    if (autoFetch && healthProfile && airQuality && weatherData) {
      fetchAlerts();
    }
  }, [autoFetch, healthProfile, airQuality, weatherData, fetchAlerts]);

  useEffect(() => {
    if (autoFetch && refreshInterval > 0) {
      const interval = setInterval(fetchAlerts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoFetch, refreshInterval, fetchAlerts]);

  return {
    data,
    isLoading:
      isLoading || profileLoading || airQualityLoading || weatherLoading,
    error,
    fetchAlerts,
    hasData: !!data,
    getTimeSinceUpdate: () => {
      if (!data?.lastUpdated) return "Nunca";
      const now = new Date();
      const updated = new Date(data.lastUpdated);
      const diffMs = now.getTime() - updated.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Agora mesmo";
      if (diffMins < 60) return `${diffMins} min atrás`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h atrás`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} dias atrás`;
    },
  };
}
