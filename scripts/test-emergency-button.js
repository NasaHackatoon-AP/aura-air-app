// Script para testar o botão de emergência
const testEmergencyButton = async () => {
  console.log("🚨 Testando Botão de Emergência...\n");

  const scenarios = [
    { id: "storm", name: "Tempestade Severa" },
    { id: "heatwave", name: "Onda de Calor" },
    { id: "coldwave", name: "Frente Fria" },
    { id: "pollution", name: "Poluição Extrema" },
    { id: "uv-extreme", name: "Índice UV Extremo" },
  ];

  for (const scenario of scenarios) {
    console.log(`🧪 Testando cenário: ${scenario.name}`);

    try {
      const response = await fetch(
        "http://localhost:3001/api/weather-conditions-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenario: scenario.id,
            userId: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Dados recebidos:", JSON.stringify(data.clima, null, 2));

      // Analisar alertas que seriam gerados
      const { clima } = data;
      const alerts = [];

      if (
        clima.umidade > 80 ||
        clima.descricao.includes("chuva") ||
        clima.chuva_mm > 0
      ) {
        alerts.push("🌧️ Alerta de Chuva Forte");
      }

      if (clima.temperatura > 35) {
        alerts.push("🌡️ Alerta de Calor Intenso");
      }

      if (clima.temperatura < 10) {
        alerts.push("❄️ Alerta de Frio Intenso");
      }

      if (clima.vento > 15) {
        alerts.push("💨 Alerta de Vento Forte");
      }

      const aqi = data.aqi_personalizado || data.aqi_original;
      if (aqi > 100) {
        alerts.push("🌫️ Alerta de Qualidade do Ar");
      }

      // Índice UV
      const hour = 12; // meio-dia
      let baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8;
      if (
        clima.descricao.includes("limpo") ||
        clima.descricao.includes("ensolarado")
      ) {
        baseUV *= 1.2;
      }
      const uvIndex = Math.max(0, Math.round(baseUV));
      if (uvIndex >= 6) {
        alerts.push("☀️ Alerta de Índice UV Alto");
      }

      console.log("🚨 Alertas que seriam gerados:", alerts);
      console.log("");
    } catch (error) {
      console.error(`❌ Erro no cenário ${scenario.name}:`, error);
    }
  }

  console.log("✅ Todos os cenários de emergência testados!");
  console.log("\n💡 Para testar na interface:");
  console.log("1. Acesse: http://localhost:3001/test-air-quality");
  console.log("2. Procure por: 'Teste de Emergência - Alertas'");
  console.log("3. Clique nos botões de simulação");
  console.log("4. Observe os alertas sendo gerados em tempo real!");
};

// Executar teste
testEmergencyButton();
