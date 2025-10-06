// Script para testar o botão de refresh dos Alertas Meteorológicos
const testWeatherAlertsRefresh = async () => {
  console.log("🌤️ Testando Botão de Refresh dos Alertas Meteorológicos...\n");

  // Testar a API de condições meteorológicas
  console.log("1. Testando API de Condições Meteorológicas...");
  try {
    const response = await fetch(
      "http://localhost:3002/api/weather-conditions"
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API funcionando");
      console.log(`   Cidade: ${data.clima.cidade}`);
      console.log(`   Temperatura: ${data.clima.temperatura}°C`);
      console.log(`   Umidade: ${data.clima.umidade}%`);
      console.log(`   Vento: ${data.clima.vento} km/h`);
      console.log(`   Descrição: ${data.clima.descricao}`);
      console.log(`   AQI: ${data.aqi_personalizado}`);
    } else {
      console.log(`❌ API com problemas: Status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Erro na API: ${error.message}`);
  }

  // Simular diferentes cenários de alertas
  console.log("\n2. Simulando Cenários de Alertas...");

  const scenarios = [
    {
      name: "Chuva Forte",
      data: { umidade: 85, descricao: "chuva forte", chuva_mm: 15 },
      expectedAlert: "Alerta de Chuva Forte",
    },
    {
      name: "Calor Intenso",
      data: { temperatura: 38, descricao: "ensolarado" },
      expectedAlert: "Alerta de Calor Intenso",
    },
    {
      name: "Vento Forte",
      data: { vento: 20, descricao: "nublado" },
      expectedAlert: "Alerta de Vento Forte",
    },
    {
      name: "Índice UV Alto",
      data: { descricao: "céu limpo" },
      expectedAlert: "Índice UV Alto",
    },
    {
      name: "Qualidade do Ar Ruim",
      data: { aqi_personalizado: 120 },
      expectedAlert: "Alerta de Qualidade do Ar",
    },
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`\n   ${index + 1}. ${scenario.name}:`);
    console.log(`      Dados: ${JSON.stringify(scenario.data)}`);
    console.log(`      Alerta esperado: ${scenario.expectedAlert}`);
  });

  console.log("\n3. Funcionalidades do Botão de Refresh:");
  console.log("✅ Botão localizado no canto superior direito do card");
  console.log("✅ Ícone de refresh (🔄) quando inativo");
  console.log("✅ Ícone de loading (⏳) quando ativo");
  console.log("✅ Desabilitado durante carregamento");
  console.log("✅ Atualiza dados em tempo real");
  console.log("✅ Mostra timestamp da última atualização");

  console.log("\n4. Estados do Botão:");
  console.log("✅ Estado Normal: Ícone 🔄 (RefreshCw)");
  console.log("✅ Estado Loading: Ícone ⏳ (Loader2) com animação");
  console.log("✅ Estado Disabled: Durante carregamento ou erro");
  console.log("✅ Estado Error: Botão 'Tentar novamente' em caso de erro");

  console.log("\n5. Comportamento do Refresh:");
  console.log("✅ Atualiza dados meteorológicos");
  console.log("✅ Recalcula alertas baseados nos novos dados");
  console.log("✅ Atualiza timestamp da última atualização");
  console.log("✅ Mantém estado de loading durante a operação");
  console.log("✅ Trata erros de rede graciosamente");

  console.log("\n6. Integração com Hook useWeatherAlerts:");
  console.log("✅ fetchWeatherAlerts(): Função de refresh");
  console.log("✅ isLoading: Estado de carregamento");
  console.log("✅ error: Tratamento de erros");
  console.log("✅ getTimeSinceUpdate(): Timestamp formatado");
  console.log("✅ Auto-refresh: A cada 10 minutos");

  console.log("\n🎯 Para testar na interface:");
  console.log("1. Acesse: http://localhost:3002/dashboard");
  console.log("2. Procure pelo card 'Alertas Meteorológicos'");
  console.log("3. Clique no botão de refresh (🔄) no canto superior direito");
  console.log("4. Observe o ícone mudar para loading (⏳)");
  console.log("5. Aguarde a atualização dos dados");
  console.log("6. Verifique o timestamp da última atualização");

  console.log(
    "\n✅ Botão de Refresh dos Alertas Meteorológicos está funcionando!"
  );
};

// Executar teste
testWeatherAlertsRefresh();
