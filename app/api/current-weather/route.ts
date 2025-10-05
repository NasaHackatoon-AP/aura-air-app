import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE_URL = "https://gustavo-production-08e9.up.railway.app";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "1";
    const lat = searchParams.get("lat") || "-23.5505";
    const lon = searchParams.get("lon") || "-46.6333";

    console.log(
      `🌤️ Current Weather API: Buscando dados para userId: ${userId}`
    );

    // Buscar dados da API externa
    const externalResponse = await fetch(
      `${EXTERNAL_API_BASE_URL}/airmonitor/monitor/aqi?lat=${lat}&lon=${lon}&usuario_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!externalResponse.ok) {
      console.error(
        `❌ Current Weather API: Erro externo ${externalResponse.status}`
      );
      throw new Error(`API externa retornou status ${externalResponse.status}`);
    }

    const externalData = await externalResponse.json();
    console.log(
      "✅ Current Weather API: Dados externos recebidos:",
      externalData
    );

    // Processar dados para formato das condições atuais
    const processedData = processCurrentWeatherData(externalData);
    console.log("✅ Current Weather API: Dados processados:", processedData);

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("❌ Current Weather API: Error:", error);

    // Fallback data para São Paulo
    const fallbackData = {
      latitude: -23.5505,
      longitude: -46.6333,
      aqi_original: 50,
      aqi_personalizado: 70,
      nivel_alerta: "amarelo",
      usuario_id: 1,
      clima: {
        cidade: "São Paulo",
        temperatura: 26.5,
        umidade: 58,
        vento: 4.2,
        descricao: "céu limpo",
        chuva_mm: 0,
        neve_mm: 0,
      },
    };

    console.log("🔄 Current Weather API: Usando dados de fallback");
    return NextResponse.json(fallbackData);
  }
}

function processCurrentWeatherData(apiData: any) {
  // Se a API retornar dados no formato esperado, retornar como está
  if (apiData.clima && apiData.clima.cidade) {
    return apiData;
  }

  // Se não, tentar processar dados alternativos
  return {
    latitude: apiData.latitude || -23.5505,
    longitude: apiData.longitude || -46.6333,
    aqi_original: apiData.aqi_original || 50,
    aqi_personalizado: apiData.aqi_personalizado || 70,
    nivel_alerta: apiData.nivel_alerta || "amarelo",
    usuario_id: apiData.usuario_id || 1,
    clima: {
      cidade: apiData.clima?.cidade || "São Paulo",
      temperatura: apiData.clima?.temperatura || 26.5,
      umidade: apiData.clima?.umidade || 58,
      vento: apiData.clima?.vento || 4.2,
      descricao: apiData.clima?.descricao || "céu limpo",
      chuva_mm: apiData.clima?.chuva_mm || 0,
      neve_mm: apiData.clima?.neve_mm || 0,
    },
  };
}
