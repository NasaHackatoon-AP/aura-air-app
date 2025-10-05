// Teste simples da API
const API_BASE_URL =
  "https://gustavo-production-08e9.up.railway.app/airquality/perfil";

async function testSimple() {
  console.log("🧪 Teste Simples da API...\n");

  try {
    // Testar GET com query parameter
    console.log("1️⃣ Testando GET com query parameter...");
    const getResponse = await fetch(`${API_BASE_URL}?usuario_id=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", getResponse.status);
    const getData = await getResponse.json();
    console.log("Response:", JSON.stringify(getData, null, 2));

    if (getResponse.ok) {
      console.log("✅ GET com query parameter funcionou!\n");
    } else {
      console.log("❌ GET com query parameter falhou!\n");
    }
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testSimple();
