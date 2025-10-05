// Script para testar alertas meteorológicos
const testWeatherAlerts = async () => {
  console.log("🧪 Testando Alertas Meteorológicos...\n");

  try {
    // Teste 1: Dados normais (sem alertas)
    console.log("📊 Teste 1: Dados normais");
    const response1 = await fetch(
      "http://localhost:3001/api/weather-conditions?userId=1"
    );
    const data1 = await response1.json();
    console.log("Dados recebidos:", JSON.stringify(data1.clima, null, 2));

    // Analisar se geraria alertas
    const { clima } = data1;
    console.log("\n🔍 Análise dos dados:");
    console.log(`- Temperatura: ${clima.temperatura}°C`);
    console.log(`- Umidade: ${clima.umidade}%`);
    console.log(`- Vento: ${clima.vento} km/h`);
    console.log(`- Descrição: ${clima.descricao}`);
    console.log(`- Chuva: ${clima.chuva_mm} mm`);

    // Verificar condições para alertas
    console.log("\n🚨 Condições para alertas:");
    console.log(
      `- Chuva forte: ${
        clima.umidade > 80 ||
        clima.descricao.includes("chuva") ||
        clima.chuva_mm > 0
          ? "SIM"
          : "NÃO"
      }`
    );
    console.log(`- Vento forte: ${clima.vento > 15 ? "SIM" : "NÃO"}`);
    console.log(`- Calor intenso: ${clima.temperatura > 35 ? "SIM" : "NÃO"}`);
    console.log(`- Frio intenso: ${clima.temperatura < 10 ? "SIM" : "NÃO"}`);

    // Calcular índice UV
    const now = new Date();
    const hour = now.getHours();
    let baseUV = 0;
    if (hour >= 6 && hour <= 18) {
      baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8;
    }
    if (
      clima.descricao.includes("limpo") ||
      clima.descricao.includes("ensolarado")
    ) {
      baseUV *= 1.2;
    } else if (
      clima.descricao.includes("nublado") ||
      clima.descricao.includes("nuvens")
    ) {
      baseUV *= 0.6;
    }
    const uvIndex = Math.max(0, Math.round(baseUV));
    console.log(
      `- Índice UV alto: ${uvIndex >= 6 ? "SIM" : "NÃO"} (UV: ${uvIndex})`
    );

    // AQI
    const aqi = data1.aqi_personalizado || data1.aqi_original;
    console.log(
      `- Qualidade do ar ruim: ${aqi > 100 ? "SIM" : "NÃO"} (AQI: ${aqi})`
    );

    console.log("\n✅ Teste concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
};

// Executar teste
testWeatherAlerts();
