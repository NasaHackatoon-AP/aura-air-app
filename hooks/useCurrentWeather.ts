"use client";

import { useState, useEffect, useCallback } from "react";

interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  city: string;
  lastUpdated: string;
}

interface UseCurrentWeatherOptions {
  userId?: number;
  autoFetch?: boolean;
  refreshInterval?: number;
}

export function useCurrentWeather({
  userId = 1,
  autoFetch = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutos
}: UseCurrentWeatherOptions = {}) {
  const [data, setData] = useState<CurrentWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCurrentWeather = useCallback(async () => {
    console.log(`🌤️ useCurrentWeather: Buscando dados para userId: ${userId}`);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/current-weather?userId=${userId}&lat=-23.5505&lon=-46.6333`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 useCurrentWeather: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ useCurrentWeather: ${errorMessage}`);
        throw new Error(
          `API de condições atuais indisponível: ${errorMessage}`
        );
      }

      const weatherData = await res.json();
      console.log("✅ useCurrentWeather: Dados recebidos:", weatherData);

      // Processar dados da API
      const processedData = processWeatherData(weatherData);
      setData(processedData);
      setLastUpdated(new Date());
      console.log("✅ useCurrentWeather: Dados processados:", processedData);
    } catch (err) {
      console.error("❌ useCurrentWeather: Erro ao buscar dados:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar condições atuais"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const processWeatherData = (apiData: any): CurrentWeatherData => {
    const { clima } = apiData;

    // Calcular sensação térmica
    const feelsLike = calculateFeelsLike(
      clima.temperatura,
      clima.umidade,
      clima.vento
    );

    // Calcular pressão atmosférica
    const pressure = calculateAtmosphericPressure(
      clima.temperatura,
      clima.umidade
    );

    // Calcular visibilidade
    const visibility = calculateVisibility(clima.umidade, clima.descricao);

    // Calcular índice UV
    const uvIndex = calculateUVIndex(clima.descricao);

    return {
      temperature: Math.round(clima.temperatura),
      feelsLike: Math.round(feelsLike),
      condition: translateWeatherCondition(clima.descricao),
      humidity: Math.round(clima.umidade),
      windSpeed: Math.round(clima.vento),
      visibility: Math.round(visibility),
      pressure: Math.round(pressure),
      uvIndex: Math.round(uvIndex),
      city: clima.cidade,
      lastUpdated: new Date().toLocaleString("pt-BR"),
    };
  };

  const calculateFeelsLike = (
    temp: number,
    humidity: number,
    wind: number
  ): number => {
    // Fórmula de sensação térmica baseada em temperatura, umidade e vento
    const heatIndex = temp + (humidity - 50) * 0.1;
    const windChill = wind > 5 ? (wind - 5) * 0.5 : 0;
    return heatIndex - windChill;
  };

  const calculateAtmosphericPressure = (
    temp: number,
    humidity: number
  ): number => {
    // Pressão atmosférica baseada em temperatura e umidade
    const basePressure = 1013.25; // Pressão padrão ao nível do mar
    const tempFactor = (temp - 20) * 0.1;
    const humidityFactor = (humidity - 50) * 0.05;
    return basePressure + tempFactor + humidityFactor;
  };

  const calculateVisibility = (
    humidity: number,
    description: string
  ): number => {
    // Visibilidade baseada em umidade e condições do céu
    let baseVisibility = 15; // km

    if (humidity > 80) {
      baseVisibility = 5;
    } else if (humidity > 60) {
      baseVisibility = 10;
    }

    if (description.includes("neblina") || description.includes("névoa")) {
      baseVisibility = Math.min(baseVisibility, 3);
    } else if (description.includes("chuva")) {
      baseVisibility = Math.min(baseVisibility, 8);
    }

    return Math.max(1, baseVisibility);
  };

  const calculateUVIndex = (description: string): number => {
    const hour = new Date().getHours();
    let baseUV = 0;

    // Índice UV baseado na hora do dia
    if (hour >= 6 && hour <= 18) {
      baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8; // Pico ao meio-dia
    }

    // Ajuste baseado na descrição do clima
    if (description.includes("limpo") || description.includes("ensolarado")) {
      baseUV *= 1.2;
    } else if (
      description.includes("nublado") ||
      description.includes("nuvens")
    ) {
      baseUV *= 0.6;
    }

    return Math.max(0, Math.round(baseUV));
  };

  const translateWeatherCondition = (description: string): string => {
    const conditions: { [key: string]: string } = {
      "céu limpo": "Céu Limpo",
      ensolarado: "Ensolarado",
      nublado: "Nublado",
      "parcialmente nublado": "Parcialmente Nublado",
      chuva: "Chuva",
      "chuva forte": "Chuva Forte",
      trovoada: "Trovoada",
      neblina: "Neblina",
      névoa: "Névoa",
    };

    return conditions[description.toLowerCase()] || description;
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCurrentWeather();
      const interval = setInterval(() => {
        console.log("🔄 useCurrentWeather: Auto-refresh dos dados");
        fetchCurrentWeather();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoFetch, fetchCurrentWeather, refreshInterval]);

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return "Nunca";

    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes === 1) return "Há 1 minuto";
    if (diffInMinutes < 60) return `Há ${diffInMinutes} minutos`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "Há 1 hora";
    return `Há ${diffInHours} horas`;
  };

  return {
    data,
    isLoading,
    error,
    fetchCurrentWeather,
    hasData: !!data,
    getTimeSinceUpdate,
  };
}
