import { useState, useEffect } from "react";
import { useLocation } from "@/contexts/LocationContext";

interface AirQualityData {
  latitude: number;
  longitude: number;
  aqi_original: number;
  aqi_personalizado: number;
  nivel_alerta: string;
  usuario_id: number | null;
  clima: {
    cidade: string;
    temperatura: number;
    umidade: number;
    vento: number;
    descricao: string;
    chuva_mm: number;
    neve_mm: number;
  };
}

interface WeatherConditions {
  // Dados da API atual
  temperatura: number;
  umidade: number;
  vento: number;
  descricao: string;
  cidade: string;
  chuva_mm: number;

  // Dados calculados/simulados
  sensacao_termica: number;
  pressao: number;
  indice_uv: number;
  visibilidade: number;
}

interface UseWeatherConditionsOptions {
  userId?: number;
  autoFetch?: boolean;
  refreshInterval?: number;
}

export function useWeatherConditions({
  userId = 1,
  autoFetch = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutos
}: UseWeatherConditionsOptions = {}) {
  const { location } = useLocation();
  const [data, setData] = useState<WeatherConditions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherConditions = async () => {
    console.log(
      `🔍 useWeatherConditions: Buscando dados para userId: ${userId} em ${location.city}, ${location.country} (${location.latitude}, ${location.longitude})`
    );
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/weather-conditions?userId=${userId}&lat=${location.latitude}&lon=${location.longitude}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 useWeatherConditions: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ useWeatherConditions: ${errorMessage}`);
        throw new Error(
          `API de condições climáticas indisponível: ${errorMessage}`
        );
      }

      const airQualityData: AirQualityData = await res.json();
      console.log("✅ useWeatherConditions: Dados recebidos:", airQualityData);

      // Processar e enriquecer os dados climáticos
      const weatherConditions = processWeatherData(airQualityData);
      setData(weatherConditions);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("❌ useWeatherConditions: Erro ao buscar dados:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar condições climáticas"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Processar e enriquecer dados climáticos
  const processWeatherData = (
    airQualityData: AirQualityData
  ): WeatherConditions => {
    const { clima } = airQualityData;

    // Calcular sensação térmica baseada na temperatura e umidade
    const sensacao_termica = calculateFeelsLike(
      clima.temperatura,
      clima.umidade,
      clima.vento
    );

    // Calcular pressão atmosférica baseada na altitude e temperatura
    const pressao = calculatePressure(clima.temperatura, clima.umidade);

    // Calcular índice UV baseado na hora do dia e condições
    const indice_uv = calculateUVIndex(clima.descricao);

    // Calcular visibilidade baseada na umidade e condições
    const visibilidade = calculateVisibility(clima.umidade, clima.descricao);

    return {
      temperatura: clima.temperatura,
      umidade: clima.umidade,
      vento: clima.vento,
      descricao: clima.descricao,
      cidade: clima.cidade,
      chuva_mm: clima.chuva_mm,
      sensacao_termica,
      pressao,
      indice_uv,
      visibilidade,
    };
  };

  // Calcular sensação térmica
  const calculateFeelsLike = (
    temp: number,
    humidity: number,
    wind: number
  ): number => {
    // Fórmula simplificada para sensação térmica
    const heatIndex = temp + (humidity / 100) * 2 - (wind / 10) * 1.5;
    return Math.round(heatIndex * 10) / 10;
  };

  // Calcular pressão atmosférica
  const calculatePressure = (temp: number, humidity: number): number => {
    // Pressão baseada na temperatura e umidade (simplificada)
    const basePressure = 1013.25; // Pressão padrão ao nível do mar
    const tempAdjustment = (temp - 20) * 0.1; // Ajuste por temperatura
    const humidityAdjustment = (humidity - 50) * 0.05; // Ajuste por umidade
    return (
      Math.round((basePressure + tempAdjustment + humidityAdjustment) * 10) / 10
    );
  };

  // Calcular índice UV
  const calculateUVIndex = (description: string): number => {
    const now = new Date();
    const hour = now.getHours();

    // Índice UV baseado na hora do dia e condições
    let baseUV = 0;
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
    } else if (description.includes("chuva")) {
      baseUV *= 0.3;
    }

    return Math.max(0, Math.round(baseUV));
  };

  // Calcular visibilidade
  const calculateVisibility = (
    humidity: number,
    description: string
  ): number => {
    let baseVisibility = 15; // km

    // Ajuste por umidade
    if (humidity > 80) baseVisibility *= 0.7;
    else if (humidity > 60) baseVisibility *= 0.85;

    // Ajuste por condições
    if (description.includes("neblina") || description.includes("névoa")) {
      baseVisibility *= 0.3;
    } else if (description.includes("chuva")) {
      baseVisibility *= 0.8;
    }

    return Math.max(1, Math.round(baseVisibility));
  };

  // Auto-fetch quando o componente monta, userId muda ou localização muda
  useEffect(() => {
    if (autoFetch && userId) {
      fetchWeatherConditions();
    }
  }, [userId, autoFetch, location.latitude, location.longitude]);

  // Auto-refresh em intervalos regulares
  useEffect(() => {
    if (!autoFetch || !userId) return;

    const interval = setInterval(() => {
      console.log("🔄 useWeatherConditions: Auto-refresh dos dados");
      fetchWeatherConditions();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoFetch, userId, refreshInterval]);

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

  const getNextUpdateTime = () => {
    if (!lastUpdated) return "Em breve";

    const nextUpdate = new Date(lastUpdated.getTime() + refreshInterval);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (nextUpdate.getTime() - now.getTime()) / (1000 * 60)
    );

    if (diffInMinutes <= 0) return "Agora";
    if (diffInMinutes === 1) return "Em 1 minuto";
    if (diffInMinutes < 60) return `Em ${diffInMinutes} minutos`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "Em 1 hora";
    return `Em ${diffInHours} horas`;
  };

  return {
    data,
    isLoading,
    error,
    fetchWeatherConditions,
    hasData: !!data,
    getTimeSinceUpdate,
    getNextUpdateTime,
  };
}
