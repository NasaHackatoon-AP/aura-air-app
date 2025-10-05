import {
  AQIForecastRequest,
  AQIForecastResponseExtended,
} from "@/types/aqiForecast";

const aqiForecastService = {
  // Buscar previsão de AQI para um usuário
  getForecast: async (userId: number): Promise<AQIForecastResponseExtended> => {
    console.log(
      `🔍 aqiForecastService: Fazendo requisição para /api/aqi-forecast?userId=${userId}`
    );

    const res = await fetch(`/api/aqi-forecast?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(
      `📊 aqiForecastService: Status da resposta: ${res.status} ${res.statusText}`
    );

    if (!res.ok) {
      console.error(`❌ aqiForecastService: Erro na resposta: ${res.status}`);
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erro ${res.status}`;
      console.error(`❌ aqiForecastService: Dados do erro:`, errorData);
      throw new Error(`API de AQI indisponível: ${errorMessage}`);
    }

    const data = await res.json();
    console.log("✅ aqiForecastService: Dados recebidos com sucesso:", data);
    return data;
  },
};

export default aqiForecastService;
export type { AQIForecastRequest, AQIForecastResponseExtended };
