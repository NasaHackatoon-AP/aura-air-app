// Script para testar diferentes formatos de endpoint da API de AQI
const API_BASE_URL =
  "https://gustavo-production-08e9.up.railway.app/airquality/aqi/previsao";

async function testAQIEndpoints() {
  console.log("🔍 Testando diferentes formatos de endpoint...\n");

  const testCases = [
    {
      name: "GET com ID no path (atual)",
      url: `${API_BASE_URL}/1`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "GET com query parameter",
      url: `${API_BASE_URL}?usuario_id=1`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "GET com query parameter (string)",
      url: `${API_BASE_URL}?usuario_id=1&format=json`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "POST com body",
      url: API_BASE_URL,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: 1 }),
    },
    {
      name: "POST com body (formato alternativo)",
      url: API_BASE_URL,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1 }),
    },
  ];

  for (const testCase of testCases) {
    console.log(`🧪 ${testCase.name}`);
    console.log(`   URL: ${testCase.url}`);
    console.log(`   Method: ${testCase.method}`);

    try {
      const response = await fetch(testCase.url, {
        method: testCase.method,
        headers: testCase.headers,
        body: testCase.body,
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get("content-type")}`);

      const responseText = await response.text();
      console.log(
        `   Resposta: ${responseText.substring(0, 100)}${
          responseText.length > 100 ? "..." : ""
        }`
      );

      if (response.status === 200) {
        console.log("   ✅ SUCESSO! Este formato funciona!");
        try {
          const jsonData = JSON.parse(responseText);
          console.log("   📊 Dados JSON válidos:");
          console.log(`   - Tipo: ${typeof jsonData}`);
          console.log(`   - Chaves: ${Object.keys(jsonData).join(", ")}`);
          if (jsonData.previsao) {
            console.log(`   - Dias de previsão: ${jsonData.previsao.length}`);
          }
        } catch (jsonError) {
          console.log(`   ❌ JSON inválido: ${jsonError.message}`);
        }
      } else {
        console.log(`   ❌ Falhou com status ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }

    console.log("");
  }

  console.log("🏁 Teste de endpoints concluído!");
}

testAQIEndpoints();
