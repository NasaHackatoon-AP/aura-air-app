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
    chuva_mm: number;
    neve_mm: number;
  };
}

interface HourlyForecastData {
  time: string;
  temperature: number;
  description: string;
  icon: string;
  precipitation: number; // probabilidade de chuva em %
  humidity: number;
  wind: number;
}

interface UseHourlyForecastOptions {
  userId?: number;
  lat?: number;
  lon?: number;
  autoFetch?: boolean;
  refreshInterval?: number;
}

const DEFAULT_LAT = -23.5505; // São Paulo latitude
const DEFAULT_LON = -46.6333; // São Paulo longitude

export function useHourlyForecast({
  userId = 1,
  lat,
  lon,
  autoFetch = true,
  refreshInterval = 300000, // 5 minutos
}: UseHourlyForecastOptions = {}) {
  const { location } = useLocation();
  const [data, setData] = useState<HourlyForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Usar coordenadas do contexto se não fornecidas
  const currentLat = lat ?? location.latitude;
  const currentLon = lon ?? location.longitude;

  const fetchHourlyForecast = useCallback(async () => {
    console.log(
      `🔍 useHourlyForecast: Buscando dados para userId: ${userId} em ${location.city}, ${location.country} (${currentLat}, ${currentLon})`
    );
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/hourly-forecast?userId=${userId}&lat=${currentLat}&lon=${currentLon}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 useHourlyForecast: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ useHourlyForecast: ${errorMessage}`);
        throw new Error(
          `API de previsão horária indisponível: ${errorMessage}`
        );
      }

      const airQualityData: AirQualityData = await res.json();
      console.log("✅ useHourlyForecast: Dados recebidos:", airQualityData);

      // Gerar previsão horária baseada nos dados atuais
      const hourlyForecast = generateHourlyForecast(airQualityData);
      setData(hourlyForecast);
      setLastUpdated(new Date());
      console.log(
        "✅ useHourlyForecast: Previsão horária gerada:",
        hourlyForecast
      );
    } catch (err) {
      console.error("❌ useHourlyForecast: Erro ao buscar dados:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar previsão horária"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, lat, lon]);

  // Gerar previsão horária de 24 horas baseada nos dados atuais
  const generateHourlyForecast = (
    currentData: AirQualityData
  ): HourlyForecastData[] => {
    const { clima } = currentData;
    const now = new Date();
    const currentHour = now.getHours();

    const forecast: HourlyForecastData[] = [];

    // Gerar previsão para as próximas 24 horas
    for (let i = 0; i < 24; i++) {
      const forecastHour = (currentHour + i) % 24;
      const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000);

      // Calcular variações baseadas na hora do dia
      const hourVariation = Math.sin(((forecastHour - 6) * Math.PI) / 12) * 0.3; // Variação diurna
      const temperatureVariation = Math.sin((i * Math.PI) / 12) * 0.2; // Variação ao longo do dia

      // Temperatura baseada na atual com variações
      const temperature =
        Math.round(
          (clima.temperatura + hourVariation + temperatureVariation) * 10
        ) / 10;

      // Umidade varia inversamente com a temperatura
      const humidity = Math.max(
        20,
        Math.min(90, clima.umidade - (temperature - clima.temperatura) * 2)
      );

      // Vento com variação aleatória
      const wind = Math.max(0, clima.vento + (Math.random() - 0.5) * 4);

      // Descrição baseada na temperatura e umidade
      const description = getWeatherDescription(
        temperature,
        humidity,
        forecastHour
      );

      // Ícone baseado na descrição
      const icon = getWeatherIcon(description);

      // Probabilidade de precipitação baseada na umidade e hora
      const precipitation = calculatePrecipitationProbability(
        humidity,
        forecastHour
      );

      // Formatar hora
      const timeString =
        i === 0 ? "Agora" : `${forecastHour.toString().padStart(2, "0")}:00`;

      forecast.push({
        time: timeString,
        temperature,
        description,
        icon,
        precipitation: Math.round(precipitation),
        humidity: Math.round(humidity),
        wind: Math.round(wind * 10) / 10,
      });
    }

    return forecast;
  };

  // Determinar descrição do clima baseada na temperatura, umidade e hora
  const getWeatherDescription = (
    temperature: number,
    humidity: number,
    hour: number
  ): string => {
    // Condições baseadas na temperatura
    if (temperature > 30) {
      if (humidity > 70) return "abafado";
      if (humidity > 50) return "parcialmente nublado";
      return "ensolarado";
    } else if (temperature > 25) {
      if (humidity > 80) return "nublado";
      if (humidity > 60) return "parcialmente nublado";
      return "ensolarado";
    } else if (temperature > 20) {
      if (humidity > 85) return "nublado";
      if (humidity > 70) return "parcialmente nublado";
      return "céu limpo";
    } else {
      if (humidity > 90) return "nublado";
      return "céu limpo";
    }
  };

  // Determinar ícone baseado na descrição
  const getWeatherIcon = (description: string): string => {
    if (description.includes("ensolarado") || description.includes("limpo")) {
      return "sun";
    } else if (description.includes("nublado")) {
      return "cloud";
    } else if (description.includes("chuva")) {
      return "cloud-rain";
    } else if (description.includes("abafado")) {
      return "cloud-fog";
    }
    return "cloud";
  };

  // Calcular probabilidade de precipitação
  const calculatePrecipitationProbability = (
    humidity: number,
    hour: number
  ): number => {
    let baseProbability = 0;

    // Baseado na umidade
    if (humidity > 85) baseProbability = 60;
    else if (humidity > 75) baseProbability = 40;
    else if (humidity > 65) baseProbability = 20;
    else if (humidity > 55) baseProbability = 10;

    // Ajuste baseado na hora (mais chuva à tarde/noite)
    if (hour >= 14 && hour <= 20) baseProbability *= 1.5;
    else if (hour >= 21 || hour <= 6) baseProbability *= 1.2;

    return Math.min(90, Math.max(0, baseProbability));
  };

  useEffect(() => {
    if (autoFetch) {
      fetchHourlyForecast();
      const interval = setInterval(() => {
        console.log("🔄 useHourlyForecast: Auto-refresh dos dados");
        fetchHourlyForecast();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [
    autoFetch,
    fetchHourlyForecast,
    refreshInterval,
    location.latitude,
    location.longitude,
  ]);

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

    if (diffInMinutes <= 0) return "Atualizando...";
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
    fetchHourlyForecast,
    hasData: data.length > 0,
    getTimeSinceUpdate,
    getNextUpdateTime,
  };
}
