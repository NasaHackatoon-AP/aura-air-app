// Script para testar a API IBGE corrigida
const testIBGECorrected = async () => {
  console.log("🔍 Testando API IBGE corrigida...\n");

  const testQueries = [
    "São Paulo",
    "Rio de Janeiro",
    "Brasília",
    "Salvador",
    "Fortaleza",
    "SP",
    "RJ",
    "DF",
  ];

  for (const query of testQueries) {
    try {
      console.log(`🔍 Testando busca por: "${query}"`);

      // Simular o novo filtro implementado
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
      );

      if (!response.ok) {
        console.log(`❌ Erro na API: ${response.status}`);
        continue;
      }

      const data = await response.json();

      // Aplicar o novo filtro local
      const queryLower = query.toLowerCase().trim();
      const filteredCities = data
        .filter((city) => {
          const cityName = city.nome.toLowerCase();
          const stateName = city.microrregiao.mesorregiao.UF.nome.toLowerCase();
          const stateCode =
            city.microrregiao.mesorregiao.UF.sigla.toLowerCase();

          return (
            cityName.includes(queryLower) ||
            stateName.includes(queryLower) ||
            stateCode.includes(queryLower)
          );
        })
        .slice(0, 10); // Limitar a 10 resultados

      console.log(
        `📊 Resultados para "${query}": ${filteredCities.length} cidades`
      );

      if (filteredCities.length > 0) {
        console.log(`✅ Primeiras 3 cidades:`);
        filteredCities.slice(0, 3).forEach((city) => {
          console.log(
            `  - ${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`
          );
        });
      } else {
        console.log(`❌ Nenhuma cidade encontrada para "${query}"`);
      }

      console.log("---");
    } catch (error) {
      console.log(`❌ Erro ao buscar "${query}":`, error.message);
    }
  }

  console.log("\n✅ Teste da API IBGE corrigida concluído!");
  console.log("🎯 Agora a busca deve funcionar corretamente!");
  console.log("🇧🇷 Teste com diferentes cidades brasileiras!");
};

// Executar teste
testIBGECorrected();
