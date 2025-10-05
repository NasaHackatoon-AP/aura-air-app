import { useState, useEffect } from "react";

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

interface HistoryDataPoint {
  time: string;
  aqi: number;
  pm25: number;
}

interface UseAirQualityHistoryOptions {
  userId?: number;
  autoFetch?: boolean;
  refreshInterval?: number; // em milissegundos
}

export function useAirQualityHistory({
  userId = 1,
  autoFetch = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutos
}: UseAirQualityHistoryOptions = {}) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAirQualityHistory = async () => {
    console.log(
      `🔍 useAirQualityHistory: Buscando dados para userId: ${userId}`
    );
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=-23.5505&lon=-46.6333&usuario_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 useAirQualityHistory: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ useAirQualityHistory: ${errorMessage}`);
        throw new Error(
          `API de histórico de qualidade do ar indisponível: ${errorMessage}`
        );
      }

      const airQualityData = await res.json();
      console.log("✅ useAirQualityHistory: Dados recebidos:", airQualityData);

      setData(airQualityData);
      setLastUpdated(new Date());

      // Gerar dados históricos baseados no AQI atual
      const generatedHistory = generateHistoryData(airQualityData);
      setHistoryData(generatedHistory);
    } catch (err) {
      console.error("❌ useAirQualityHistory: Erro ao buscar dados:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados históricos de qualidade do ar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch quando o componente monta ou userId muda
  useEffect(() => {
    if (autoFetch && userId) {
      fetchAirQualityHistory();
    }
  }, [userId, autoFetch]);

  // Auto-refresh em intervalos regulares
  useEffect(() => {
    if (!autoFetch || !userId) return;

    const interval = setInterval(() => {
      console.log("🔄 useAirQualityHistory: Auto-refresh dos dados");
      fetchAirQualityHistory();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoFetch, userId, refreshInterval]);

  // Dados históricos fixos baseados no horário atual
  const getHistoricalDataBasedOnTime = (): HistoryDataPoint[] => {
    const now = new Date();
    const currentHour = now.getHours();

    // Dados fixos para horários que já passaram
    const fixedData: { [key: string]: { aqi: number; pm25: number } } = {
      "00:00": { aqi: 45, pm25: 13 },
      "03:00": { aqi: 42, pm25: 12 },
      "06:00": { aqi: 48, pm25: 14 },
      "09:00": { aqi: 55, pm25: 16 },
      "12:00": { aqi: 62, pm25: 18 },
      "15:00": { aqi: 58, pm25: 17 },
      "18:00": { aqi: 52, pm25: 15 },
      "21:00": { aqi: 47, pm25: 14 },
    };

    // Horários do dia
    const timePoints = [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ];

    return timePoints
      .map((time) => {
        const timeHour = parseInt(time.split(":")[0]);

        // Se o horário já passou, usar dados fixos
        if (timeHour < currentHour) {
          return {
            time,
            aqi: fixedData[time].aqi,
            pm25: fixedData[time].pm25,
          };
        }

        // Se o horário ainda não chegou, retornar null (será preenchido dinamicamente)
        return null;
      })
      .filter(Boolean) as HistoryDataPoint[];
  };

  // Gerar dados históricos de 24h baseados no AQI atual
  const generateHistoryData = (
    currentData: AirQualityData
  ): HistoryDataPoint[] => {
    const currentAQI =
      currentData.aqi_personalizado || currentData.aqi_original || 50;
    const currentPM25 = Math.round(currentAQI * 0.3); // PM2.5 baseado no AQI

    const now = new Date();
    const currentHour = now.getHours();

    // Obter dados históricos fixos (apenas horários que já passaram)
    const historicalData = getHistoricalDataBasedOnTime();

    // Gerar dados para horários futuros baseados no AQI atual
    const timePoints = [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ];

    const allData: HistoryDataPoint[] = [];

    timePoints.forEach((time) => {
      const timeHour = parseInt(time.split(":")[0]);

      if (timeHour < currentHour) {
        // Horário já passou - usar dados fixos
        const fixedData = historicalData.find((d) => d.time === time);
        if (fixedData) {
          allData.push(fixedData);
        }
      } else {
        // Horário futuro - gerar dados baseados no AQI atual
        const variation = Math.sin(timeHour * 0.3) * 0.2;
        const aqi = Math.max(0, Math.round(currentAQI * (1 + variation)));
        const pm25 = Math.max(0, Math.round(currentPM25 * (1 + variation)));

        allData.push({
          time,
          aqi,
          pm25,
        });
      }
    });

    // Adicionar o ponto "Agora" com dados reais
    allData.push({
      time: "Agora",
      aqi: currentAQI,
      pm25: currentPM25,
    });

    return allData;
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
    historyData,
    isLoading,
    error,
    fetchAirQualityHistory,
    hasData: !!data,
    getTimeSinceUpdate,
    getNextUpdateTime,
  };
}
