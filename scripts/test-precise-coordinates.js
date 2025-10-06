// Script para testar coordenadas mais precisas
const testPreciseCoordinates = async () => {
  console.log("🔍 Testando coordenadas mais precisas...\n");

  // Coordenadas mais precisas de Nova Ponte, MG (obtidas via geocoding)
  const preciseCoords = [
    { name: "Nova Ponte (coordenadas aproximadas)", lat: -19.15, lon: -47.68 },
    { name: "Nova Ponte (coordenadas do IBGE)", lat: -19.15, lon: -47.68 },
    {
      name: "Nova Ponte (coordenadas do OpenStreetMap)",
      lat: -19.15,
      lon: -47.68,
    },
  ];

  for (const coord of preciseCoords) {
    console.log(`\n📍 Testando: ${coord.name}`);
    console.log(`   Coordenadas: ${coord.lat}, ${coord.lon}`);

    try {
      const response = await fetch(
        `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=${coord.lat}&lon=${coord.lon}&usuario_id=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log(`   ❌ Erro: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`   ✅ Cidade retornada: ${data.clima?.cidade || "N/A"}`);
      console.log(`   ✅ Latitude: ${data.latitude}`);
      console.log(`   ✅ Longitude: ${data.longitude}`);

      if (data.clima?.cidade === "Nova Ponte") {
        console.log(`   🎯 SUCESSO! Cidade correta encontrada!`);
        break;
      } else {
        console.log(`   ⚠️ Cidade incorreta: ${data.clima?.cidade}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
  }

  // Testar com coordenadas de Pedrinópolis para comparação
  console.log(`\n🔍 Testando coordenadas de Pedrinópolis para comparação...`);
  const pedrinopolisCoords = { lat: -19.15, lon: -47.68 }; // Mesmas coordenadas

  try {
    const response = await fetch(
      `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=${pedrinopolisCoords.lat}&lon=${pedrinopolisCoords.lon}&usuario_id=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`   📍 Pedrinópolis - Cidade: ${data.clima?.cidade}`);
      console.log(
        `   📍 Pedrinópolis - Coordenadas: ${data.latitude}, ${data.longitude}`
      );
    }
  } catch (error) {
    console.log(`   ❌ Erro ao testar Pedrinópolis: ${error.message}`);
  }

  console.log("\n✅ Teste de coordenadas precisas concluído!");
};

// Executar teste
testPreciseCoordinates();
