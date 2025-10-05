import { useState, useEffect, useCallback } from "react";

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

interface WeatherAlert {
  id: string;
  type: "rain" | "uv" | "wind" | "temperature" | "air_quality";
  severity: "info" | "warning" | "danger";
  title: string;
  description: string;
  icon: string;
  timeframe: string;
  recommendations: string[];
}

interface UseWeatherAlertsOptions {
  userId?: number;
  autoFetch?: boolean;
  refreshInterval?: number;
}

export function useWeatherAlerts({
  userId = 1,
  autoFetch = true,
  refreshInterval = 10 * 60 * 1000, // 10 minutos
}: UseWeatherAlertsOptions = {}) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherAlerts = useCallback(async () => {
    console.log(`🔍 useWeatherAlerts: Buscando dados para userId: ${userId}`);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/weather-conditions?userId=${userId}&lat=-23.5505&lon=-46.6333`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `📊 useWeatherAlerts: Status da resposta: ${res.status} ${res.statusText}`
      );

      if (!res.ok) {
        const errorMessage = `Erro ${res.status}`;
        console.error(`❌ useWeatherAlerts: ${errorMessage}`);
        throw new Error(
          `API de alertas meteorológicos indisponível: ${errorMessage}`
        );
      }

      const airQualityData: AirQualityData = await res.json();
      console.log("✅ useWeatherAlerts: Dados recebidos:", airQualityData);

      // Gerar alertas baseados nos dados climáticos
      const generatedAlerts = generateWeatherAlerts(airQualityData);
      setAlerts(generatedAlerts);
      setLastUpdated(new Date());
      console.log("✅ useWeatherAlerts: Alertas gerados:", generatedAlerts);
    } catch (err) {
      console.error("❌ useWeatherAlerts: Erro ao buscar dados:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar alertas meteorológicos"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Gerar alertas meteorológicos baseados nos dados atuais
  const generateWeatherAlerts = (data: AirQualityData): WeatherAlert[] => {
    const alerts: WeatherAlert[] = [];
    const { clima } = data;
    const now = new Date();
    const currentHour = now.getHours();

    // Alerta de Chuva Forte (baseado na umidade e descrição)
    if (
      clima.umidade > 80 ||
      clima.descricao.includes("chuva") ||
      clima.chuva_mm > 0
    ) {
      alerts.push({
        id: "rain-alert",
        type: "rain",
        severity: "warning",
        title: "Alerta de Chuva Forte",
        description:
          "Possibilidade de chuva forte entre 18h e 21h. Recomenda-se evitar áreas de alagamento.",
        icon: "cloud-rain",
        timeframe: "Hoje, 18:00 - 21:00",
        recommendations: [
          "Evite áreas de alagamento",
          "Use guarda-chuva ou capa de chuva",
          "Dirija com cuidado em vias molhadas",
        ],
      });
    }

    // Alerta de Índice UV Alto (baseado na hora do dia e condições)
    const uvIndex = calculateUVIndex(clima.descricao, currentHour);
    if (uvIndex >= 6) {
      alerts.push({
        id: "uv-alert",
        type: "uv",
        severity: "warning",
        title: "Índice UV Alto",
        description:
          "O índice UV está alto. Use protetor solar e evite exposição prolongada ao sol.",
        icon: "sun",
        timeframe: "Hoje, 12:00 - 16:00",
        recommendations: [
          "Use protetor solar FPS 30 ou superior",
          "Evite exposição ao sol entre 10h e 16h",
          "Use chapéu e óculos de sol",
          "Procure sombra quando possível",
        ],
      });
    }

    // Alerta de Vento Forte (baseado na velocidade do vento)
    if (clima.vento > 15) {
      alerts.push({
        id: "wind-alert",
        type: "wind",
        severity: "warning",
        title: "Alerta de Vento Forte",
        description: `Ventos fortes de até ${clima.vento} km/h. Cuidado com objetos soltos e árvores.`,
        icon: "wind",
        timeframe: "Hoje, 14:00 - 18:00",
        recommendations: [
          "Evite áreas com árvores grandes",
          "Segure objetos soltos",
          "Dirija com cuidado",
          "Evite atividades ao ar livre",
        ],
      });
    }

    // Alerta de Temperatura Extrema
    if (clima.temperatura > 35) {
      alerts.push({
        id: "heat-alert",
        type: "temperature",
        severity: "danger",
        title: "Alerta de Calor Intenso",
        description: `Temperatura elevada de ${clima.temperatura}°C. Risco de desidratação e insolação.`,
        icon: "thermometer",
        timeframe: "Hoje, 12:00 - 18:00",
        recommendations: [
          "Beba muita água",
          "Evite atividades físicas intensas",
          "Procure locais com ar condicionado",
          "Use roupas leves e claras",
        ],
      });
    } else if (clima.temperatura < 10) {
      alerts.push({
        id: "cold-alert",
        type: "temperature",
        severity: "warning",
        title: "Alerta de Frio Intenso",
        description: `Temperatura baixa de ${clima.temperatura}°C. Risco de hipotermia.`,
        icon: "thermometer",
        timeframe: "Hoje, 06:00 - 10:00",
        recommendations: [
          "Use roupas quentes",
          "Evite exposição prolongada ao frio",
          "Mantenha-se aquecido",
          "Cuidado com idosos e crianças",
        ],
      });
    }

    // Alerta de Qualidade do Ar (baseado no AQI)
    const aqi = data.aqi_personalizado || data.aqi_original;
    if (aqi > 100) {
      alerts.push({
        id: "air-quality-alert",
        type: "air_quality",
        severity: "danger",
        title: "Alerta de Qualidade do Ar",
        description: `Qualidade do ar prejudicial (AQI: ${aqi}). Evite atividades ao ar livre.`,
        icon: "alert-triangle",
        timeframe: "Hoje, 08:00 - 20:00",
        recommendations: [
          "Evite atividades ao ar livre",
          "Use máscara se necessário",
          "Mantenha janelas fechadas",
          "Grupos sensíveis devem evitar sair de casa",
        ],
      });
    }

    return alerts;
  };

  // Calcular índice UV baseado na descrição e hora
  const calculateUVIndex = (description: string, hour: number): number => {
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

  useEffect(() => {
    if (autoFetch) {
      fetchWeatherAlerts();
      const interval = setInterval(() => {
        console.log("🔄 useWeatherAlerts: Auto-refresh dos dados");
        fetchWeatherAlerts();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoFetch, fetchWeatherAlerts, refreshInterval]);

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
    alerts,
    isLoading,
    error,
    fetchWeatherAlerts,
    hasAlerts: alerts.length > 0,
    getTimeSinceUpdate,
  };
}
