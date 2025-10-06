import { useState, useEffect, useCallback } from "react";
import aqiForecastService from "@/services/aqiForecastService";
import { useLocation } from "@/contexts/LocationContext";
import {
  AQIForecastResponseExtended,
  UseAQIForecastOptions,
} from "@/types/aqiForecast";

export function useAQIForecast({
  userId,
  autoFetch = true,
}: UseAQIForecastOptions = {}) {
  const { location } = useLocation();
  const [forecast, setForecast] = useState<AQIForecastResponseExtended | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    if (!userId) {
      console.log("🚫 useAQIForecast: userId não fornecido");
      return;
    }

    console.log(
      `🔍 useAQIForecast: Iniciando busca para userId: ${userId} em ${location.city}, ${location.country} (${location.latitude}, ${location.longitude})`
    );
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `📡 useAQIForecast: Chamando aqiForecastService.getForecast(${userId}, ${location.latitude}, ${location.longitude})`
      );
      const forecastData = await aqiForecastService.getForecast(
        userId,
        location.latitude,
        location.longitude,
        location.state,
        location.city
      );
      console.log("✅ useAQIForecast: Dados recebidos:", forecastData);
      setForecast(forecastData);
    } catch (err) {
      console.error("❌ useAQIForecast: Erro ao buscar previsão:", err);

      setError(
        err instanceof Error ? err.message : "Erro ao carregar previsão de AQI"
      );
      setForecast(null);
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

  // Auto-fetch forecast when component mounts, userId changes or location changes
  useEffect(() => {
    if (autoFetch && userId) {
      fetchForecast();
    }
  }, [userId, autoFetch, location.latitude, location.longitude, fetchForecast]);

  return {
    forecast,
    isLoading,
    error,
    fetchForecast,
    hasForecast: !!forecast,
  };
}
