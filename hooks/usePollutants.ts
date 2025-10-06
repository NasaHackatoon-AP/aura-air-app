import { useState, useEffect, useCallback } from "react";
import { useLocation } from "@/contexts/LocationContext";

interface PollutantData {
  nome: string;
  concentracao: number;
  unidade: string;
  limite_recomendado: number;
  status: "Bom" | "Moderado" | "Alto" | "Muito Alto" | "Perigoso";
}

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

interface UsePollutantsOptions {
  userId?: number;
  autoFetch?: boolean;
  refreshInterval?: number; // em milissegundos
}

export function usePollutants({
  userId = 1,
  autoFetch = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutos
}: UsePollutantsOptions = {}) {
  const { location } = useLocation();
  const [data, setData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPollutants = useCallback(async () => {
    console.log(
      `🔍 usePollutants: Buscando dados para userId: ${userId} em ${location.city}, ${location.country} (${location.latitude}, ${location.longitude})`
    );
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=${location.latitude}&lon=${location.longitude}&usuario_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 usePollutants: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ usePollutants: ${errorMessage}`);
        throw new Error(`API de poluentes indisponível: ${errorMessage}`);
      }

      const airQualityData = await res.json();
      console.log("✅ usePollutants: Dados recebidos:", airQualityData);

      setData(airQualityData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("❌ usePollutants: Erro ao buscar dados:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados de poluentes"
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
      fetchPollutants();
    }
  }, [
    userId,
    autoFetch,
    location.latitude,
    location.longitude,
    fetchPollutants,
  ]);

  // Auto-refresh em intervalos regulares
  useEffect(() => {
    if (!autoFetch || !userId) return;

    const interval = setInterval(() => {
      console.log("🔄 usePollutants: Auto-refresh dos dados");
      fetchPollutants();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoFetch, userId, refreshInterval]);

  // Gerar dados de poluentes baseados no AQI
  const generatePollutantsData = (): PollutantData[] => {
    if (!data) return [];

    const aqi = data.aqi_personalizado || data.aqi_original || 50;

    // Gerar concentrações baseadas no AQI
    const pollutants: PollutantData[] = [
      {
        nome: "Material Particulado 2.5",
        concentracao: Math.round(aqi * 0.3), // PM2.5 baseado no AQI
        unidade: "μg/m³",
        limite_recomendado: 15,
        status: getPollutantStatus(aqi * 0.3, 15),
      },
      {
        nome: "Material Particulado 10",
        concentracao: Math.round(aqi * 0.6), // PM10 baseado no AQI
        unidade: "μg/m³",
        limite_recomendado: 50,
        status: getPollutantStatus(aqi * 0.6, 50),
      },
      {
        nome: "Ozônio",
        concentracao: Math.round(aqi * 0.8), // O3 baseado no AQI
        unidade: "ppb",
        limite_recomendado: 100,
        status: getPollutantStatus(aqi * 0.8, 100),
      },
      {
        nome: "Dióxido de Nitrogênio",
        concentracao: Math.round(aqi * 0.4), // NO2 baseado no AQI
        unidade: "ppb",
        limite_recomendado: 100,
        status: getPollutantStatus(aqi * 0.4, 100),
      },
      {
        nome: "Dióxido de Enxofre",
        concentracao: Math.round(aqi * 0.2), // SO2 baseado no AQI
        unidade: "ppb",
        limite_recomendado: 75,
        status: getPollutantStatus(aqi * 0.2, 75),
      },
      {
        nome: "Monóxido de Carbono",
        concentracao: Math.round(aqi * 0.1 * 10) / 10, // CO baseado no AQI
        unidade: "ppm",
        limite_recomendado: 9,
        status: getPollutantStatus(aqi * 0.1, 9),
      },
    ];

    return pollutants;
  };

  const getPollutantStatus = (
    concentration: number,
    limit: number
  ): "Bom" | "Moderado" | "Alto" | "Muito Alto" | "Perigoso" => {
    const ratio = concentration / limit;

    if (ratio <= 0.5) return "Bom";
    if (ratio <= 0.8) return "Moderado";
    if (ratio <= 1.0) return "Alto";
    if (ratio <= 1.5) return "Muito Alto";
    return "Perigoso";
  };

  const getPollutantColor = (status: string): string => {
    switch (status) {
      case "Bom":
        return "bg-green-500";
      case "Moderado":
        return "bg-yellow-500";
      case "Alto":
        return "bg-orange-500";
      case "Muito Alto":
        return "bg-red-500";
      case "Perigoso":
        return "bg-red-700";
      default:
        return "bg-gray-500";
    }
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

  return {
    data,
    isLoading,
    error,
    fetchPollutants,
    hasData: !!data,
    pollutants: generatePollutantsData(),
    getPollutantColor,
    getTimeSinceUpdate,
  };
}
