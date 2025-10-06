// Script para diagnosticar problemas com a API de AQI
const API_BASE_URL =
  "https://gustavo-production-08e9.up.railway.app/airquality/aqi/previsao";

async function debugAQIAPI() {
  console.log("🔍 Iniciando diagnóstico da API de AQI...\n");

  const testUserId = 1;
  const fullUrl = `${API_BASE_URL}/${testUserId}`;

  console.log(`📡 URL da API: ${fullUrl}`);
  console.log(`👤 User ID: ${testUserId}\n`);

  try {
    console.log("1️⃣ Testando conexão básica...");
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AirAuraApp/1.0",
        Accept: "application/json",
      },
    });

    console.log(`📊 Status Code: ${response.status}`);
    console.log(`📋 Status Text: ${response.statusText}`);
    console.log(`🌐 Headers:`);

    // Log de todos os headers
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`);
    }

    console.log(`\n2️⃣ Verificando Content-Type...`);
    const contentType = response.headers.get("content-type");
    console.log(`📄 Content-Type: ${contentType}`);

    if (contentType && contentType.includes("application/json")) {
      console.log("✅ Content-Type indica JSON");
    } else {
      console.log("❌ Content-Type NÃO é JSON");
    }

    console.log(`\n3️⃣ Tentando ler o corpo da resposta...`);
    const responseText = await response.text();
    console.log(`📝 Tamanho da resposta: ${responseText.length} caracteres`);
    console.log(`📄 Primeiros 200 caracteres:`);
    console.log(responseText.substring(0, 200));

    if (responseText.length > 200) {
      console.log("... (truncado)");
    }

    console.log(`\n4️⃣ Verificando se é HTML...`);
    if (responseText.includes("<html") || responseText.includes("<!DOCTYPE")) {
      console.log("❌ Resposta contém HTML (página de erro)");

      // Tentar extrair informações do HTML
      if (responseText.includes("500")) {
        console.log("🔍 Erro 500 detectado no HTML");
      }
      if (responseText.includes("Internal Server Error")) {
        console.log("🔍 'Internal Server Error' detectado");
      }
      if (responseText.includes("Railway")) {
        console.log("🔍 Página de erro do Railway detectada");
      }
    } else {
      console.log("✅ Resposta não parece ser HTML");
    }

    console.log(`\n5️⃣ Tentando fazer parse como JSON...`);
    try {
      const jsonData = JSON.parse(responseText);
      console.log("✅ JSON válido!");
      console.log("📊 Dados recebidos:");
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (jsonError) {
      console.log("❌ Erro ao fazer parse do JSON:");
      console.log(`   ${jsonError.message}`);
    }

    console.log(`\n6️⃣ Testando diferentes endpoints...`);

    // Testar endpoint base
    console.log("   Testando endpoint base...");
    try {
      const baseResponse = await fetch(API_BASE_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log(`   Status: ${baseResponse.status}`);
      const baseText = await baseResponse.text();
      console.log(`   Resposta: ${baseText.substring(0, 100)}...`);
    } catch (baseError) {
      console.log(`   Erro: ${baseError.message}`);
    }

    // Testar com POST
    console.log("   Testando com POST...");
    try {
      const postResponse = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: testUserId }),
      });
      console.log(`   Status: ${postResponse.status}`);
      const postText = await postResponse.text();
      console.log(`   Resposta: ${postText.substring(0, 100)}...`);
    } catch (postError) {
      console.log(`   Erro: ${postError.message}`);
    }
  } catch (error) {
    console.error("❌ Erro durante o diagnóstico:");
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
  }

  console.log("\n🏁 Diagnóstico concluído!");
}

// Executar o diagnóstico
debugAQIAPI();
