// Script para testar a busca por "Nova Ponte" no IBGE
const testNovaPonteSearch = async () => {
  console.log("🔍 Testando busca por 'Nova Ponte' no IBGE...\n");

  try {
    console.log("1. Testando API IBGE diretamente...");
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
    );

    if (!response.ok) {
      console.log(`❌ Erro na API IBGE: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log(`📊 Total de municípios: ${data.length}`);

    // Filtrar por "Nova Ponte"
    const novaPonteCities = data.filter((city) =>
      city.nome.toLowerCase().includes("nova ponte")
    );

    console.log(
      `\n🔍 Cidades com 'Nova Ponte' encontradas: ${novaPonteCities.length}`
    );

    if (novaPonteCities.length > 0) {
      novaPonteCities.forEach((city, index) => {
        console.log(`\n${index + 1}. ${city.nome}`);
        console.log(
          `   Estado: ${city.microrregiao?.mesorregiao?.UF?.nome || "N/A"}`
        );
        console.log(
          `   Sigla: ${city.microrregiao?.mesorregiao?.UF?.sigla || "N/A"}`
        );
        console.log(`   ID: ${city.id}`);
      });
    } else {
      console.log("❌ Nenhuma cidade 'Nova Ponte' encontrada");
    }

    // Testar geocoding para Nova Ponte
    console.log("\n2. Testando geocoding para Nova Ponte...");
    const geocodingResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=Nova Ponte, MG, Brasil&limit=1&countrycodes=br`
    );

    if (geocodingResponse.ok) {
      const geocodingData = await geocodingResponse.json();
      console.log(`📍 Resultados do geocoding: ${geocodingData.length}`);

      if (geocodingData.length > 0) {
        console.log(`✅ Coordenadas encontradas:`);
        console.log(`   Latitude: ${geocodingData[0].lat}`);
        console.log(`   Longitude: ${geocodingData[0].lon}`);
        console.log(`   Endereço: ${geocodingData[0].display_name}`);
      } else {
        console.log("❌ Nenhuma coordenada encontrada para Nova Ponte");
      }
    }

    // Testar busca por "Pedrinópolis"
    console.log("\n3. Testando busca por 'Pedrinópolis'...");
    const pedrinopolisCities = data.filter(
      (city) =>
        city.nome.toLowerCase().includes("pedrinópolis") ||
        city.nome.toLowerCase().includes("pedrinopolis")
    );

    console.log(
      `🔍 Cidades com 'Pedrinópolis' encontradas: ${pedrinopolisCities.length}`
    );

    if (pedrinopolisCities.length > 0) {
      pedrinopolisCities.forEach((city, index) => {
        console.log(`\n${index + 1}. ${city.nome}`);
        console.log(
          `   Estado: ${city.microrregiao?.mesorregiao?.UF?.nome || "N/A"}`
        );
        console.log(
          `   Sigla: ${city.microrregiao?.mesorregiao?.UF?.sigla || "N/A"}`
        );
        console.log(`   ID: ${city.id}`);
      });
    }
  } catch (error) {
    console.error("❌ Erro ao testar busca:", error.message);
  }

  console.log("\n✅ Teste de busca por Nova Ponte concluído!");
};

// Executar teste
testNovaPonteSearch();
