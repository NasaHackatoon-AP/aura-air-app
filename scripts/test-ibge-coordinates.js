// Script para testar as coordenadas do IBGE para Nova Ponte
const testIBGECoordinates = async () => {
  console.log("🔍 Testando coordenadas do IBGE para Nova Ponte...\n");

  try {
    // Buscar dados específicos de Nova Ponte no IBGE
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3145000"
    );

    if (!response.ok) {
      console.log(`❌ Erro na API IBGE: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log("✅ Dados do IBGE para Nova Ponte:");
    console.log(`   Nome: ${data.nome}`);
    console.log(`   ID: ${data.id}`);
    console.log(
      `   Estado: ${data.microrregiao?.mesorregiao?.UF?.nome || "N/A"}`
    );
    console.log(
      `   Sigla: ${data.microrregiao?.mesorregiao?.UF?.sigla || "N/A"}`
    );

    // Testar geocoding reverso com coordenadas do IBGE
    console.log("\n🔍 Testando geocoding reverso...");

    // Coordenadas aproximadas de Nova Ponte (baseadas em pesquisa)
    const testCoords = [
      { lat: -19.15, lon: -47.68, source: "Aproximadas" },
      { lat: -19.16, lon: -47.69, source: "Ajustadas" },
      { lat: -19.14, lon: -47.67, source: "Alternativas" },
    ];

    for (const coord of testCoords) {
      console.log(
        `\n📍 Testando coordenadas ${coord.source}: ${coord.lat}, ${coord.lon}`
      );

      try {
        const apiResponse = await fetch(
          `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=${coord.lat}&lon=${coord.lon}&usuario_id=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          console.log(
            `   ✅ Cidade retornada: ${apiData.clima?.cidade || "N/A"}`
          );
          console.log(
            `   ✅ Coordenadas: ${apiData.latitude}, ${apiData.longitude}`
          );

          if (apiData.clima?.cidade === "Nova Ponte") {
            console.log(`   🎯 SUCESSO! Cidade correta encontrada!`);
            break;
          } else {
            console.log(`   ⚠️ Cidade incorreta: ${apiData.clima?.cidade}`);
          }
        } else {
          console.log(`   ❌ Erro na API: ${apiResponse.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }

    // Testar com coordenadas de outras cidades para comparação
    console.log("\n🔍 Testando com outras cidades para comparação...");

    const otherCities = [
      { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
      { name: "Belo Horizonte", lat: -19.9167, lon: -43.9345 },
      { name: "Uberlândia", lat: -18.9186, lon: -48.2772 },
    ];

    for (const city of otherCities) {
      console.log(`\n📍 Testando ${city.name}: ${city.lat}, ${city.lon}`);

      try {
        const apiResponse = await fetch(
          `https://gustavo-production-08e9.up.railway.app/airmonitor/monitor/aqi?lat=${city.lat}&lon=${city.lon}&usuario_id=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          console.log(
            `   ✅ Cidade retornada: ${apiData.clima?.cidade || "N/A"}`
          );
          console.log(
            `   ✅ Coordenadas: ${apiData.latitude}, ${apiData.longitude}`
          );
        } else {
          console.log(`   ❌ Erro na API: ${apiResponse.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Erro ao testar coordenadas do IBGE:", error.message);
  }

  console.log("\n✅ Teste de coordenadas do IBGE concluído!");
};

// Executar teste
testIBGECoordinates();
