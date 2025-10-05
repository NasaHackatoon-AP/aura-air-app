import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { healthProfile, airQuality, weatherData, userId } = body;

    console.log("🤖 Chatbot Health Alerts API: Gerando alertas personalizados");
    console.log("👤 Perfil de saúde:", healthProfile);
    console.log("🌬️ Qualidade do ar:", airQuality);
    console.log("🌤️ Dados meteorológicos:", weatherData);

    // Simular processamento da IA do chatbot
    const personalizedAlerts = await generatePersonalizedAlerts({
      healthProfile,
      airQuality,
      weatherData,
      userId,
    });

    console.log("✅ Alertas gerados:", personalizedAlerts.length);

    return NextResponse.json(personalizedAlerts);
  } catch (error) {
    console.error("❌ Chatbot Health Alerts API: Error:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

async function generatePersonalizedAlerts({
  healthProfile,
  airQuality,
  weatherData,
  userId,
}: {
  healthProfile: any;
  airQuality: any;
  weatherData: any;
  userId: number;
}) {
  const alerts = [];
  const conditions = healthProfile?.condicoes_saude || [];
  const aqi = airQuality?.aqi_personalizado || airQuality?.aqi_original || 50;
  const temperature = weatherData?.clima?.temperatura || 25;
  const humidity = weatherData?.clima?.umidade || 50;
  const wind = weatherData?.clima?.vento || 5;
  const description = weatherData?.clima?.descricao || "céu limpo";

  // Simular delay de processamento da IA
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Alerta de Qualidade do Ar Personalizado
  if (aqi > 50) {
    const severity = aqi > 100 ? "high" : aqi > 75 ? "moderate" : "low";
    const condition = conditions.includes("Asma")
      ? "Asma"
      : conditions.includes("Bronquite")
      ? "Bronquite"
      : conditions.includes("Rinite")
      ? "Rinite"
      : "Geral";

    alerts.push({
      id: "air_quality",
      type: "air_quality",
      severity,
      title: getAirQualityTitle(aqi),
      description: generateAirQualityDescription(condition, aqi),
      recommendations: generateAirQualityRecommendations(condition, aqi),
      healthCondition: condition,
      icon: "🌫️",
      color: getSeverityColor(severity),
    });
  }

  // Alerta de Índice UV Personalizado
  const uvIndex = calculateUVIndex(description);
  if (uvIndex >= 6) {
    const hasSkinCondition = conditions.some(
      (c: string) =>
        c.includes("Dermatite") ||
        c.includes("Psoríase") ||
        c.includes("Vitiligo")
    );

    alerts.push({
      id: "uv_index",
      type: "uv",
      severity: uvIndex >= 8 ? "high" : "moderate",
      title: "Índice UV Alto",
      description: hasSkinCondition
        ? "O índice UV está alto hoje. Pessoas com condições de pele precisam de proteção extra."
        : "O índice UV está alto hoje. Proteção solar é recomendada.",
      recommendations: generateUVRecommendations(hasSkinCondition),
      healthCondition: hasSkinCondition ? "Condições de Pele" : "Geral",
      icon: "☀️",
      color: uvIndex >= 8 ? "text-red-600" : "text-orange-600",
    });
  }

  // Alerta de Temperatura Personalizado
  if (temperature > 35 || temperature < 10) {
    const hasHeartCondition = conditions.some(
      (c: string) => c.includes("Hipertensão") || c.includes("Cardiopatia")
    );

    alerts.push({
      id: "temperature",
      type: "temperature",
      severity: temperature > 38 || temperature < 5 ? "high" : "moderate",
      title: temperature > 35 ? "Calor Intenso" : "Frio Intenso",
      description: hasHeartCondition
        ? `Temperatura extrema (${temperature}°C). Pessoas com condições cardíacas precisam de cuidado especial.`
        : `Temperatura extrema (${temperature}°C). Cuidado com desidratação e hipotermia.`,
      recommendations: generateTemperatureRecommendations(
        temperature,
        hasHeartCondition
      ),
      healthCondition: hasHeartCondition ? "Condições Cardíacas" : "Geral",
      icon: temperature > 35 ? "🌡️" : "❄️",
      color:
        temperature > 38 || temperature < 5
          ? "text-red-600"
          : "text-orange-600",
    });
  }

  // Alerta de Umidade Personalizado
  if (humidity > 80 || humidity < 30) {
    const hasRespiratoryCondition = conditions.some(
      (c: string) =>
        c.includes("Asma") || c.includes("Bronquite") || c.includes("Rinite")
    );

    alerts.push({
      id: "humidity",
      type: "humidity",
      severity: humidity > 90 || humidity < 20 ? "high" : "moderate",
      title: humidity > 80 ? "Umidade Alta" : "Umidade Baixa",
      description: hasRespiratoryCondition
        ? `Umidade ${
            humidity > 80 ? "alta" : "baixa"
          } (${humidity}%). Pessoas com condições respiratórias podem sentir desconforto.`
        : `Umidade ${
            humidity > 80 ? "alta" : "baixa"
          } (${humidity}%). Cuidado com desconforto respiratório.`,
      recommendations: generateHumidityRecommendations(
        humidity,
        hasRespiratoryCondition
      ),
      healthCondition: hasRespiratoryCondition
        ? "Condições Respiratórias"
        : "Geral",
      icon: humidity > 80 ? "💧" : "🏜️",
      color:
        humidity > 90 || humidity < 20 ? "text-red-600" : "text-orange-600",
    });
  }

  return alerts;
}

function getAirQualityTitle(aqi: number): string {
  if (aqi <= 50) return "Qualidade do Ar Boa";
  if (aqi <= 75) return "Qualidade do Ar Moderada";
  if (aqi <= 100) return "Qualidade do Ar Ruim";
  if (aqi <= 150) return "Qualidade do Ar Muito Ruim";
  return "Qualidade do Ar Perigosa";
}

function generateAirQualityDescription(condition: string, aqi: number): string {
  const level =
    aqi <= 50
      ? "baixos"
      : aqi <= 75
      ? "moderados"
      : aqi <= 100
      ? "elevados"
      : "muito elevados";

  if (condition === "Asma") {
    return `Os níveis de PM2.5 estão ${level}. Pessoas com asma podem sentir desconforto respiratório.`;
  }

  if (condition === "Bronquite") {
    return `Os níveis de PM2.5 estão ${level}. Pessoas com bronquite podem ter crises respiratórias.`;
  }

  if (condition === "Rinite") {
    return `Os níveis de PM2.5 estão ${level}. Pessoas com rinite podem ter irritação nasal.`;
  }

  return `Os níveis de PM2.5 estão ${level}. Pessoas sensíveis podem sentir desconforto.`;
}

function generateAirQualityRecommendations(
  condition: string,
  aqi: number
): string[] {
  const baseRecommendations = [
    "Evite exercícios intensos ao ar livre",
    "Mantenha medicação de resgate por perto",
    "Considere usar máscara ao sair",
  ];

  if (condition === "Asma") {
    return [
      ...baseRecommendations,
      "Use inalador preventivo conforme prescrito",
      "Evite áreas com muito tráfego",
      "Mantenha ambiente limpo e arejado",
    ];
  }

  if (condition === "Bronquite") {
    return [
      ...baseRecommendations,
      "Evite fumaça e poluentes",
      "Mantenha ambiente úmido",
      "Use umidificador se necessário",
    ];
  }

  if (condition === "Rinite") {
    return [
      ...baseRecommendations,
      "Evite alérgenos conhecidos",
      "Use soro fisiológico para limpeza nasal",
      "Mantenha ambiente livre de poeira",
    ];
  }

  return baseRecommendations;
}

function generateUVRecommendations(hasSkinCondition: boolean): string[] {
  const baseRecommendations = [
    "Use protetor solar FPS 30+",
    "Evite exposição entre 10h-16h",
    "Use óculos de sol e chapéu",
  ];

  if (hasSkinCondition) {
    return [
      ...baseRecommendations,
      "Use protetor solar FPS 50+",
      "Reaplique protetor a cada 2 horas",
      "Use roupas com proteção UV",
      "Consulte dermatologista regularmente",
    ];
  }

  return baseRecommendations;
}

function generateTemperatureRecommendations(
  temperature: number,
  hasHeartCondition: boolean
): string[] {
  if (temperature > 35) {
    const baseRecommendations = [
      "Beba muita água",
      "Evite atividades ao ar livre",
      "Use roupas leves e claras",
    ];

    if (hasHeartCondition) {
      return [
        ...baseRecommendations,
        "Monitore pressão arterial",
        "Evite esforço físico excessivo",
        "Mantenha medicamentos refrigerados",
        "Evite mudanças bruscas de temperatura",
      ];
    }

    return baseRecommendations;
  } else {
    const baseRecommendations = [
      "Use roupas quentes",
      "Evite exposição prolongada ao frio",
      "Mantenha-se hidratado",
    ];

    if (hasHeartCondition) {
      return [
        ...baseRecommendations,
        "Monitore pressão arterial",
        "Evite mudanças bruscas de temperatura",
        "Mantenha medicamentos em temperatura adequada",
        "Evite esforço físico excessivo",
      ];
    }

    return baseRecommendations;
  }
}

function generateHumidityRecommendations(
  humidity: number,
  hasRespiratoryCondition: boolean
): string[] {
  if (humidity > 80) {
    const baseRecommendations = [
      "Evite ambientes muito úmidos",
      "Use desumidificador se necessário",
      "Mantenha boa ventilação",
    ];

    if (hasRespiratoryCondition) {
      return [
        ...baseRecommendations,
        "Evite mofo e fungos",
        "Mantenha medicação de resgate por perto",
        "Use umidificador com moderação",
      ];
    }

    return baseRecommendations;
  } else {
    const baseRecommendations = [
      "Use umidificador se necessário",
      "Beba mais água",
      "Evite ambientes muito secos",
    ];

    if (hasRespiratoryCondition) {
      return [
        ...baseRecommendations,
        "Mantenha medicação de resgate por perto",
        "Use soro fisiológico para hidratação nasal",
        "Evite ar condicionado excessivo",
      ];
    }

    return baseRecommendations;
  }
}

function calculateUVIndex(description: string): number {
  const hour = new Date().getHours();
  let baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8;

  if (description.includes("limpo") || description.includes("ensolarado")) {
    baseUV *= 1.2;
  } else if (description.includes("nublado")) {
    baseUV *= 0.6;
  }

  return Math.max(0, Math.round(baseUV));
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-700";
    case "high":
      return "text-red-600";
    case "moderate":
      return "text-orange-600";
    case "low":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}
