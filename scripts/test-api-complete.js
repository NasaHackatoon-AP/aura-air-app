// Script completo para testar a API de previsão e capturar todos os logs
const API_BASE_URL = "http://localhost:3000/api/aqi-forecast";

async function testAPIComplete() {
  console.log("🧪 TESTE COMPLETO DA API DE PREVISÃO DE AQI");
  console.log("=".repeat(60));

  const testCases = [
    {
      name: "✅ Teste 1: userId válido (1)",
      url: `${API_BASE_URL}?userId=1`,
      expectedStatus: 200,
    },
    {
      name: "❌ Teste 2: userId inválido (999)",
      url: `${API_BASE_URL}?userId=999`,
      expectedStatus: 404,
    },
    {
      name: "❌ Teste 3: Sem userId",
      url: API_BASE_URL,
      expectedStatus: 400,
    },
    {
      name: "❌ Teste 4: userId string inválida",
      url: `${API_BASE_URL}?userId=abc`,
      expectedStatus: 200, // Pode funcionar se a API externa aceitar
    },
    {
      name: "❌ Teste 5: userId negativo",
      url: `${API_BASE_URL}?userId=-1`,
      expectedStatus: 200, // Pode funcionar se a API externa aceitar
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`);
    console.log(`📡 URL: ${testCase.url}`);
    console.log(`🎯 Status esperado: ${testCase.expectedStatus}`);

    try {
      const startTime = Date.now();
      const response = await fetch(testCase.url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`⏱️  Tempo de resposta: ${duration}ms`);
      console.log(
        `📊 Status recebido: ${response.status} ${response.statusText}`
      );
      console.log(`📋 Content-Type: ${response.headers.get("content-type")}`);

      const responseText = await response.text();
      console.log(`📄 Tamanho da resposta: ${responseText.length} caracteres`);

      if (response.ok) {
        console.log("✅ SUCESSO!");
        try {
          const jsonData = JSON.parse(responseText);
          console.log("📊 Dados JSON válidos:");
          console.log(`   - usuario_id: ${jsonData.usuario_id}`);
          console.log(`   - cidade: ${jsonData.cidade}`);
          console.log(`   - estado: ${jsonData.estado}`);
          console.log(`   - fonte_dados: ${jsonData.fonte_dados}`);
          console.log(`   - precisao: ${jsonData.precisao}%`);
          console.log(
            `   - dias de previsão: ${jsonData.previsao?.length || 0}`
          );

          if (jsonData.previsao && jsonData.previsao.length > 0) {
            const firstDay = jsonData.previsao[0];
            console.log(
              `   - Primeiro dia: ${firstDay.data} (AQI: ${firstDay.aqi})`
            );
            console.log(`   - Categoria: ${firstDay.categoria}`);
            console.log(`   - Risco: ${firstDay.risco_saude}`);
          }
        } catch (jsonError) {
          console.log(`❌ Erro ao fazer parse do JSON: ${jsonError.message}`);
          console.log(
            `📄 Resposta bruta: ${responseText.substring(0, 200)}...`
          );
        }
      } else {
        console.log("❌ FALHOU!");
        try {
          const errorData = JSON.parse(responseText);
          console.log("📊 Dados de erro:");
          console.log(`   - error: ${errorData.error}`);
          console.log(`   - message: ${errorData.message}`);
          if (errorData.details) {
            console.log(`   - details: ${errorData.details}`);
          }
        } catch (parseError) {
          console.log(`📄 Resposta de erro: ${responseText}`);
        }
      }

      // Verificar se o status corresponde ao esperado
      if (response.status === testCase.expectedStatus) {
        console.log("🎯 Status corresponde ao esperado!");
      } else {
        console.log(
          `⚠️  Status diferente do esperado (esperado: ${testCase.expectedStatus})`
        );
      }
    } catch (error) {
      console.log(`💥 ERRO CRÍTICO: ${error.message}`);
      console.log(`   Tipo: ${error.name}`);
      console.log(`   Stack: ${error.stack}`);
    }

    console.log("-".repeat(40));
  }

  console.log("\n🏁 TESTE COMPLETO FINALIZADO!");
  console.log("=".repeat(60));
}

// Executar o teste
testAPIComplete().catch(console.error);
