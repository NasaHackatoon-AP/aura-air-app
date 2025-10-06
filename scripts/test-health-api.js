// Script para testar a API de perfil de saúde diretamente
const API_BASE_URL =
  "https://gustavo-production-08e9.up.railway.app/airquality/perfil";

async function testHealthAPI() {
  console.log("🧪 Testando API de Perfil de Saúde...\n");

  const testData = {
    usuario_id: 1,
    possui_asma: true,
    possui_dpoc: false,
    possui_alergias: true,
    fumante: false,
    sensibilidade_alta: true,
  };

  try {
    // 1. Testar POST (criar perfil)
    console.log("1️⃣ Testando POST (criar perfil)...");
    const createResponse = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Status:", createResponse.status);
    const createData = await createResponse.json();
    console.log("Response:", JSON.stringify(createData, null, 2));

    if (createResponse.ok) {
      console.log("✅ POST bem-sucedido!\n");
    } else {
      console.log("❌ POST falhou!\n");
    }

    // 2. Testar GET (buscar perfil)
    console.log("2️⃣ Testando GET (buscar perfil)...");
    const getResponse = await fetch(`${API_BASE_URL}/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", getResponse.status);
    const getData = await getResponse.json();
    console.log("Response:", JSON.stringify(getData, null, 2));

    if (getResponse.ok) {
      console.log("✅ GET bem-sucedido!\n");
    } else {
      console.log("❌ GET falhou!\n");
    }

    // 3. Testar PUT (atualizar perfil)
    console.log("3️⃣ Testando PUT (atualizar perfil)...");
    const updateData = {
      ...testData,
      possui_asma: false,
      fumante: true,
    };

    const updateResponse = await fetch(`${API_BASE_URL}/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    console.log("Status:", updateResponse.status);
    const updateResult = await updateResponse.json();
    console.log("Response:", JSON.stringify(updateResult, null, 2));

    if (updateResponse.ok) {
      console.log("✅ PUT bem-sucedido!\n");
    } else {
      console.log("❌ PUT falhou!\n");
    }

    // 4. Testar DELETE (deletar perfil)
    console.log("4️⃣ Testando DELETE (deletar perfil)...");
    const deleteResponse = await fetch(`${API_BASE_URL}/1`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", deleteResponse.status);
    const deleteData = await deleteResponse.json();
    console.log("Response:", JSON.stringify(deleteData, null, 2));

    if (deleteResponse.ok) {
      console.log("✅ DELETE bem-sucedido!\n");
    } else {
      console.log("❌ DELETE falhou!\n");
    }
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

// Executar o teste
testHealthAPI();
