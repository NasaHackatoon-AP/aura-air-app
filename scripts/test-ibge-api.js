// Script para testar a API do IBGE diretamente
const testIBGEAPI = async () => {
  console.log("🔍 Testando API do IBGE diretamente...\n");

  const testQueries = [
    "São Paulo",
    "Rio de Janeiro",
    "Brasília",
    "Salvador",
    "Fortaleza",
    "Belo Horizonte",
    "Manaus",
    "Curitiba",
    "Recife",
    "Porto Alegre",
  ];

  for (const query of testQueries) {
    try {
      console.log(`🔍 Testando busca por: "${query}"`);

      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome&filter=nome:${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        console.log(`❌ Erro na API: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`📊 Resultados para "${query}": ${data.length} cidades`);

      if (data.length > 0) {
        console.log(
          `✅ Primeira cidade: ${data[0].nome}, ${data[0].microrregiao.mesorregiao.UF.sigla}`
        );
      } else {
        console.log(`❌ Nenhuma cidade encontrada para "${query}"`);
      }

      console.log("---");
    } catch (error) {
      console.log(`❌ Erro ao buscar "${query}":`, error.message);
    }
  }

  console.log("\n🔍 Testando busca sem filtro:");
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`📊 Total de municípios disponíveis: ${data.length}`);

      // Mostrar algumas cidades principais
      const mainCities = data.filter((city) =>
        [
          "São Paulo",
          "Rio de Janeiro",
          "Brasília",
          "Salvador",
          "Fortaleza",
        ].includes(city.nome)
      );

      console.log("🏙️ Cidades principais encontradas:");
      mainCities.forEach((city) => {
        console.log(
          `  - ${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`
        );
      });
    }
  } catch (error) {
    console.log("❌ Erro ao buscar todas as cidades:", error.message);
  }

  console.log("\n🔍 Testando busca com filtro diferente:");
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome&filter=nome:SP"
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`📊 Cidades com 'SP' no nome: ${data.length}`);

      if (data.length > 0) {
        console.log("🏙️ Primeiras 5 cidades:");
        data.slice(0, 5).forEach((city) => {
          console.log(
            `  - ${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`
          );
        });
      }
    }
  } catch (error) {
    console.log("❌ Erro ao buscar cidades com 'SP':", error.message);
  }

  console.log("\n✅ Teste da API IBGE concluído!");
};

// Executar teste
testIBGEAPI();
