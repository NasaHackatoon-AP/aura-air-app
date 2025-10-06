// Script para testar as coordenadas da API externa
const testExternalAPICoordinates = async () => {
  console.log("🔍 Testando coordenadas da API externa...\n");

  // Coordenadas aproximadas de Nova Ponte, MG
  const novaPonteCoords = {
    lat: -19.15,
    lon: -47.68,
  };

  console.log(
    `📍 Testando coordenadas de Nova Ponte: ${novaPonteCoords.lat}, ${novaPonteCoords.lon}`
  );

  try {
    const response = await fetch(
      `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=${novaPonteCoords.lat}&lon=${novaPonteCoords.lon}&usuario_id=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(`❌ Erro na API externa: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log("✅ Dados recebidos da API externa:");
    console.log(`   Cidade retornada: ${data.clima?.cidade || "N/A"}`);
    console.log(`   Latitude: ${data.latitude}`);
    console.log(`   Longitude: ${data.longitude}`);
    console.log(`   AQI Original: ${data.aqi_original}`);
    console.log(`   AQI Personalizado: ${data.aqi_personalizado}`);
    console.log(`   Nível de Alerta: ${data.nivel_alerta}`);

    if (data.clima) {
      console.log(`\n🌤️ Dados climáticos:`);
      console.log(`   Cidade: ${data.clima.cidade}`);
      console.log(`   Temperatura: ${data.clima.temperatura}°C`);
      console.log(`   Umidade: ${data.clima.umidade}%`);
      console.log(`   Vento: ${data.clima.vento} km/h`);
      console.log(`   Descrição: ${data.clima.descricao}`);
    }

    // Verificar se a cidade retornada é diferente de Nova Ponte
    if (data.clima?.cidade && data.clima.cidade !== "Nova Ponte") {
      console.log(`\n⚠️ PROBLEMA IDENTIFICADO:`);
      console.log(`   Cidade solicitada: Nova Ponte`);
      console.log(`   Cidade retornada: ${data.clima.cidade}`);
      console.log(
        `   Isso indica que a API externa não está usando as coordenadas corretas`
      );
    } else {
      console.log(`\n✅ Cidade correta retornada: ${data.clima?.cidade}`);
    }
  } catch (error) {
    console.error("❌ Erro ao testar API externa:", error.message);
  }

  console.log("\n✅ Teste de coordenadas da API externa concluído!");
};

// Executar teste
testExternalAPICoordinates();
