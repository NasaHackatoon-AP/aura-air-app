import { useState, useEffect } from "react";
import aqiForecastService from "@/services/aqiForecastService";
import {
  AQIForecastResponseExtended,
  UseAQIForecastOptions,
} from "@/types/aqiForecast";

export function useAQIForecast({
  userId,
  autoFetch = true,
}: UseAQIForecastOptions = {}) {
  const [forecast, setForecast] = useState<AQIForecastResponseExtended | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch forecast when component mounts or userId changes
  useEffect(() => {
    if (autoFetch && userId) {
      fetchForecast();
    }
  }, [userId, autoFetch]);

  const fetchForecast = async () => {
    if (!userId) {
      console.log("🚫 useAQIForecast: userId não fornecido");
      return;
    }

    console.log(`🔍 useAQIForecast: Iniciando busca para userId: ${userId}`);
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `📡 useAQIForecast: Chamando aqiForecastService.getForecast(${userId})`
      );
      const forecastData = await aqiForecastService.getForecast(userId);
      console.log("✅ useAQIForecast: Dados recebidos:", forecastData);
      setForecast(forecastData);
    } catch (err) {
      console.error("❌ useAQIForecast: Erro ao buscar previsão:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar previsão de AQI"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    forecast,
    isLoading,
    error,
    fetchForecast,
    hasForecast: !!forecast,
  };
}
