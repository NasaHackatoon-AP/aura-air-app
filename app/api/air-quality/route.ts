import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE_URL = "https://gustavo-production-08e9.up.railway.app";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "1";
    const lat = searchParams.get("lat") || "-23.5505";
    const lon = searchParams.get("lon") || "-46.6333";

    console.log(`🌤️ Air Quality API: Fetching for userId: ${userId}`);

    const externalUrl = `${EXTERNAL_API_BASE_URL}/airmonitor/monitor/aqi?lat=${lat}&lon=${lon}&usuario_id=${userId}`;

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`📊 Air Quality API: External status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Air Quality API: External error: ${response.status} - ${errorText}`
      );

      // Retornar dados de fallback quando a API externa está indisponível
      const fallbackData = {
        latitude: -23.5505,
        longitude: -46.6333,
        aqi_original: 50.0,
        aqi_personalizado: 70.0,
        nivel_alerta: "amarelo",
        usuario_id: parseInt(userId),
        clima: {
          cidade: "São Paulo",
          temperatura: 24.0,
          umidade: 65,
          vento: 12.0,
          descricao: "parcialmente nublado",
          chuva_mm: 0.0,
          neve_mm: 0.0,
        },
      };

      console.log("🔄 Air Quality API: Using fallback data");
      return NextResponse.json(fallbackData);
    }

    const data = await response.json();
    console.log("✅ Air Quality API: Data received:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Air Quality API: Error:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
