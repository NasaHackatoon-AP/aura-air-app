// Script para testar o card unificado de saúde
const testPersonalizedHealth = async () => {
  console.log("🏥 Testando Card Unificado de Saúde...\n");

  const testScenarios = [
    {
      name: "Usuário com Asma - Qualidade do Ar Ruim",
      healthProfile: { condicoes_saude: ["Asma"] },
      airQuality: { aqi_personalizado: 85 },
      weatherData: {
        clima: {
          temperatura: 28,
          umidade: 60,
          vento: 5,
          descricao: "céu limpo",
        },
      },
    },
    {
      name: "Usuário com Hipertensão - Calor Intenso",
      healthProfile: { condicoes_saude: ["Hipertensão"] },
      airQuality: { aqi_personalizado: 50 },
      weatherData: {
        clima: {
          temperatura: 38,
          umidade: 75,
          vento: 3,
          descricao: "ensolarado",
        },
      },
    },
    {
      name: "Usuário com Dermatite - Índice UV Alto",
      healthProfile: { condicoes_saude: ["Dermatite"] },
      airQuality: { aqi_personalizado: 60 },
      weatherData: {
        clima: {
          temperatura: 32,
          umidade: 40,
          vento: 8,
          descricao: "céu limpo",
        },
      },
    },
    {
      name: "Usuário com Bronquite - Umidade Alta",
      healthProfile: { condicoes_saude: ["Bronquite"] },
      airQuality: { aqi_personalizado: 70 },
      weatherData: {
        clima: { temperatura: 25, umidade: 85, vento: 4, descricao: "nublado" },
      },
    },
    {
      name: "Usuário sem Condições - Condições Normais",
      healthProfile: { condicoes_saude: [] },
      airQuality: { aqi_personalizado: 45 },
      weatherData: {
        clima: {
          temperatura: 22,
          umidade: 55,
          vento: 6,
          descricao: "céu limpo",
        },
      },
    },
  ];

  for (const scenario of testScenarios) {
    console.log(`🧪 Testando: ${scenario.name}`);

    try {
      const response = await fetch(
        "http://localhost:3002/api/chatbot/health-alerts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            healthProfile: scenario.healthProfile,
            airQuality: scenario.airQuality,
            weatherData: scenario.weatherData,
            userId: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const alerts = await response.json();
      console.log("✅ Alertas gerados:", alerts.length);

      alerts.forEach((alert, index) => {
        console.log(`  ${index + 1}. ${alert.icon} ${alert.title}`);
        console.log(`     Condição: ${alert.healthCondition}`);
        console.log(`     Severidade: ${alert.severity}`);
        console.log(`     Descrição: ${alert.description}`);
        console.log(
          `     Recomendações: ${alert.recommendations.length} itens`
        );
        console.log("");
      });

      if (alerts.length === 0) {
        console.log("  ✅ Nenhum alerta - condições normais");
      }
    } catch (error) {
      console.error(`❌ Erro no cenário ${scenario.name}:`, error.message);
    }

    console.log("─".repeat(50));
  }

  console.log("✅ Todos os cenários testados!");
  console.log("\n💡 Para testar na interface:");
  console.log("1. Acesse: http://localhost:3002/test-air-quality");
  console.log("2. Procure por: 'Card Unificado de Saúde'");
  console.log("3. Configure um perfil de saúde");
  console.log("4. Observe os alertas personalizados sendo gerados!");
};

// Executar teste
testPersonalizedHealth();
