import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE_URL = "https://gustavo-production-08e9.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, userId = "1" } = body;

    console.log(
      `🧪 Weather Conditions Test API: Testing scenario: ${scenario}`
    );

    // Dados de teste baseados no cenário
    const testData = getTestDataForScenario(scenario);

    console.log("📊 Test data:", testData);

    // Retornar dados de teste
    return NextResponse.json(testData);
  } catch (error) {
    console.error("❌ Weather Conditions Test API: Error:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

function getTestDataForScenario(scenario: string) {
  const scenarios = {
    storm: {
      latitude: -23.5505,
      longitude: -46.6333,
      aqi_original: 85.0,
      aqi_personalizado: 95.0,
      nivel_alerta: "vermelho",
      usuario_id: 1,
      clima: {
        cidade: "São Paulo",
        temperatura: 22.0,
        umidade: 95,
        vento: 25.0,
        descricao: "chuva forte",
        chuva_mm: 45.0,
        neve_mm: 0.0,
      },
    },
    heatwave: {
      latitude: -23.5505,
      longitude: -46.6333,
      aqi_original: 95.0,
      aqi_personalizado: 105.0,
      nivel_alerta: "vermelho",
      usuario_id: 1,
      clima: {
        cidade: "São Paulo",
        temperatura: 42.0,
        umidade: 75,
        vento: 3.0,
        descricao: "ensolarado",
        chuva_mm: 0.0,
        neve_mm: 0.0,
      },
    },
    coldwave: {
      latitude: -23.5505,
      longitude: -46.6333,
      aqi_original: 60.0,
      aqi_personalizado: 70.0,
      nivel_alerta: "amarelo",
      usuario_id: 1,
      clima: {
        cidade: "São Paulo",
        temperatura: 5.0,
        umidade: 85,
        vento: 20.0,
        descricao: "nublado",
        chuva_mm: 8.0,
        neve_mm: 0.0,
      },
    },
    pollution: {
      latitude: -23.5505,
      longitude: -46.6333,
      aqi_original: 180.0,
      aqi_personalizado: 200.0,
      nivel_alerta: "vermelho",
      usuario_id: 1,
      clima: {
        cidade: "São Paulo",
        temperatura: 28.0,
        umidade: 45,
        vento: 2.0,
        descricao: "nublado",
        chuva_mm: 0.0,
        neve_mm: 0.0,
      },
    },
    "uv-extreme": {
      latitude: -23.5505,
      longitude: -46.6333,
      aqi_original: 70.0,
      aqi_personalizado: 80.0,
      nivel_alerta: "amarelo",
      usuario_id: 1,
      clima: {
        cidade: "São Paulo",
        temperatura: 35.0,
        umidade: 30,
        vento: 8.0,
        descricao: "céu limpo",
        chuva_mm: 0.0,
        neve_mm: 0.0,
      },
    },
  };

  return scenarios[scenario as keyof typeof scenarios] || scenarios.storm;
}
