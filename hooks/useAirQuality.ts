import { useState, useEffect, useCallback } from "react";
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
  };
}

interface UseAirQualityOptions {
  userId?: number;
  autoFetch?: boolean;
  refreshInterval?: number; // em milissegundos
}

export function useAirQuality({
  userId = 1,
  autoFetch = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutos
}: UseAirQualityOptions = {}) {
  const { location } = useLocation();
  const [data, setData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAirQuality = useCallback(async () => {
    console.log(
      `🔍 useAirQuality: Buscando dados para userId: ${userId} em ${location.city}, ${location.country} (${location.latitude}, ${location.longitude})`
    );
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/air-quality?userId=${userId}&lat=${location.latitude}&lon=${location.longitude}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 useAirQuality: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ useAirQuality: ${errorMessage}`);
        throw new Error(`API de qualidade do ar indisponível: ${errorMessage}`);
      }

      const airQualityData = await res.json();
      console.log("✅ useAirQuality: Dados recebidos:", airQualityData);

      setData(airQualityData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("❌ useAirQuality: Erro ao buscar dados:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados de qualidade do ar"
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    userId,
    location.latitude,
    location.longitude,
    location.city,
    location.country,
  ]);

  // Auto-fetch quando o componente monta, userId muda ou localização muda
  useEffect(() => {
    if (autoFetch && userId) {
      fetchAirQuality();
    }
  }, [
    userId,
    autoFetch,
    location.latitude,
    location.longitude,
    fetchAirQuality,
  ]);

  // Auto-refresh em intervalos regulares
  useEffect(() => {
    if (!autoFetch || !userId) return;

    const interval = setInterval(() => {
      console.log("🔄 useAirQuality: Auto-refresh dos dados");
      fetchAirQuality();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoFetch, userId, refreshInterval]);

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Bom";
    if (aqi <= 100) return "Moderado";
    if (aqi <= 150) return "Insalubre para grupos sensíveis";
    if (aqi <= 200) return "Insalubre";
    if (aqi <= 300) return "Muito insalubre";
    return "Perigoso";
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-500";
    if (aqi <= 100) return "text-yellow-500";
    if (aqi <= 150) return "text-orange-500";
    if (aqi <= 200) return "text-red-500";
    if (aqi <= 300) return "text-purple-500";
    return "text-red-700";
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50)
      return "A qualidade do ar é considerada satisfatória e a poluição do ar representa pouco ou nenhum risco.";
    if (aqi <= 100)
      return "A qualidade do ar é aceitável. No entanto, pode haver um risco moderado para algumas pessoas que são particularmente sensíveis à poluição do ar.";
    if (aqi <= 150)
      return "Membros de grupos sensíveis podem experimentar efeitos na saúde. O público em geral provavelmente não será afetado.";
    if (aqi <= 200)
      return "Todos podem começar a experimentar efeitos na saúde; membros de grupos sensíveis podem experimentar efeitos mais sérios na saúde.";
    if (aqi <= 300)
      return "Aviso de saúde de emergência. Toda a população é mais provável de ser afetada.";
    return "Aviso de saúde: todos podem experimentar efeitos mais sérios na saúde.";
  };

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
    fetchAirQuality,
    hasData: !!data,
    getAQICategory,
    getAQIColor,
    getAQIDescription,
    getTimeSinceUpdate,
    getNextUpdateTime,
  };
}
