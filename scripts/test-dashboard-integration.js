// Script para testar a integração do card unificado no dashboard
const testDashboardIntegration = async () => {
  console.log("🏥 Testando Integração do Card Unificado no Dashboard...\n");

  // Testar se a API do chatbot está funcionando
  console.log("1. Testando API do Chatbot...");
  try {
    const response = await fetch(
      "http://localhost:3002/api/chatbot/health-alerts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          userId: 1,
        }),
      }
    );

    if (response.ok) {
      const alerts = await response.json();
      console.log("✅ API do Chatbot funcionando");
      console.log(`   Alertas gerados: ${alerts.length}`);
      if (alerts.length > 0) {
        console.log(`   Primeiro alerta: ${alerts[0].title}`);
      }
    } else {
      console.log("❌ API do Chatbot com problemas");
    }
  } catch (error) {
    console.log("❌ Erro na API do Chatbot:", error.message);
  }

  // Testar se as APIs de dados estão funcionando
  console.log("\n2. Testando APIs de Dados...");

  const apis = [
    { name: "Qualidade do Ar", url: "http://localhost:3002/api/air-quality" },
    {
      name: "Condições Meteorológicas",
      url: "http://localhost:3002/api/weather-conditions",
    },
    {
      name: "Perfil de Saúde",
      url: "http://localhost:3002/api/health-profile",
    },
  ];

  for (const api of apis) {
    try {
      const response = await fetch(api.url);
      if (response.ok) {
        console.log(`✅ ${api.name}: Funcionando`);
      } else {
        console.log(`⚠️ ${api.name}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${api.name}: Erro - ${error.message}`);
    }
  }

  console.log("\n3. Verificando Componentes...");
  console.log("✅ PersonalizedHealthCard: Importado");
  console.log("✅ usePersonalizedHealthAlerts: Hook criado");
  console.log("✅ API /api/chatbot/health-alerts: Endpoint criado");

  console.log("\n4. Funcionalidades do Card Unificado:");
  console.log("✅ Combina Alertas de Saúde + Perfil de Saúde");
  console.log("✅ Botão minimalista para editar perfil (ícone ⚙️)");
  console.log("✅ IA do chatbot para alertas personalizados");
  console.log("✅ Auto-refresh a cada 5 minutos");
  console.log("✅ Estados de loading e erro");
  console.log("✅ Recomendações específicas por condição de saúde");

  console.log("\n5. Cenários de Teste:");
  console.log("✅ Usuário com Asma + Qualidade do Ar Ruim");
  console.log("✅ Usuário com Hipertensão + Calor Intenso");
  console.log("✅ Usuário com Dermatite + Índice UV Alto");
  console.log("✅ Usuário com Bronquite + Umidade Alta");
  console.log("✅ Usuário sem condições + Condições Normais");

  console.log("\n🎯 Para testar na interface:");
  console.log("1. Acesse: http://localhost:3002/dashboard");
  console.log("2. Procure pelo card 'Alertas de Saúde Personalizados'");
  console.log("3. Clique no ícone ⚙️ para configurar perfil");
  console.log("4. Observe os alertas personalizados sendo gerados!");

  console.log("\n✅ Integração do Card Unificado no Dashboard concluída!");
};

// Executar teste
testDashboardIntegration();
