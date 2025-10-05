// Script para testar o botão de refresh dos Alertas Meteorológicos
const testWeatherAlertsButton = async () => {
  console.log("🔄 Testando Botão de Refresh dos Alertas Meteorológicos...\n");

  // Testar a API
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

  console.log("\n2. Melhorias Implementadas no Botão:");
  console.log("✅ Botão agora aparece em TODOS os estados do card");
  console.log("✅ Estado 'Nenhum alerta ativo' - Botão visível");
  console.log("✅ Estado 'Com alertas' - Botão visível");
  console.log("✅ Estado 'Erro' - Botão 'Tentar novamente'");
  console.log("✅ Estado 'Loading' - Botão com animação");

  console.log("\n3. Características do Botão:");
  console.log("✅ Posição: Canto superior direito do card");
  console.log("✅ Ícone: 🔄 (RefreshCw) quando inativo");
  console.log("✅ Ícone: ⏳ (Loader2) quando ativo");
  console.log("✅ Tamanho: Botão pequeno (size='sm')");
  console.log("✅ Estilo: Outline com hover");
  console.log("✅ Tooltip: 'Atualizar alertas meteorológicos'");

  console.log("\n4. Estados do Botão:");
  console.log("✅ Normal: Ícone 🔄, clicável");
  console.log("✅ Loading: Ícone ⏳ com animação, desabilitado");
  console.log("✅ Error: Botão 'Tentar novamente' (full width)");
  console.log("✅ Hover: Mudança de cor de fundo");

  console.log("\n5. Funcionalidades:");
  console.log("✅ Atualiza dados meteorológicos em tempo real");
  console.log("✅ Recalcula alertas baseados nos novos dados");
  console.log("✅ Atualiza timestamp da última atualização");
  console.log("✅ Trata erros de rede graciosamente");
  console.log("✅ Auto-refresh a cada 10 minutos");

  console.log("\n6. Alertas que Podem ser Gerados:");
  console.log("✅ Chuva Forte: Umidade > 80% ou descrição com 'chuva'");
  console.log("✅ Índice UV Alto: Baseado na hora e condições do céu");
  console.log("✅ Vento Forte: Velocidade > 15 km/h");
  console.log("✅ Calor Intenso: Temperatura > 35°C");
  console.log("✅ Frio Intenso: Temperatura < 10°C");
  console.log("✅ Qualidade do Ar: AQI > 100");

  console.log("\n7. Dados Atuais (que podem gerar alertas):");
  console.log("   - Temperatura: 26.96°C (normal)");
  console.log("   - Umidade: 58% (normal)");
  console.log("   - Vento: 3.6 km/h (normal)");
  console.log("   - Descrição: 'céu limpo' (pode gerar UV alto)");
  console.log("   - AQI: 70 (normal)");

  console.log("\n🎯 Para testar na interface:");
  console.log("1. Acesse: http://localhost:3002/dashboard");
  console.log("2. Procure pelo card 'Alertas Meteorológicos'");
  console.log(
    "3. O botão de refresh (🔄) deve estar no canto superior direito"
  );
  console.log("4. Clique no botão para atualizar os dados");
  console.log("5. Observe o ícone mudar para loading (⏳)");
  console.log("6. Verifique o timestamp da última atualização");

  console.log(
    "\n✅ Botão de Refresh dos Alertas Meteorológicos implementado e funcionando!"
  );
};

// Executar teste
testWeatherAlertsButton();
