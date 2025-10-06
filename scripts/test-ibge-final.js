// Script para testar a correção final do IBGE
const testIBGEFinal = async () => {
  console.log("🔧 Testando correção final do IBGE...\n");

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

      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
      );

      if (!response.ok) {
        console.log(`❌ Erro na API: ${response.status}`);
        continue;
      }

      const data = await response.json();

      // Aplicar o filtro corrigido
      const queryLower = query.toLowerCase().trim();
      const filteredCities = data
        .filter((city) => {
          const cityName = city.nome.toLowerCase();

          // Verificar se microrregiao existe antes de acessar
          if (
            !city.microrregiao ||
            !city.microrregiao.mesorregiao ||
            !city.microrregiao.mesorregiao.UF
          ) {
            return cityName.includes(queryLower);
          }

          const stateName = city.microrregiao.mesorregiao.UF.nome.toLowerCase();
          const stateCode =
            city.microrregiao.mesorregiao.UF.sigla.toLowerCase();

          return (
            cityName.includes(queryLower) ||
            stateName.includes(queryLower) ||
            stateCode.includes(queryLower)
          );
        })
        .slice(0, 5); // Limitar a 5 resultados

      console.log(
        `📊 Resultados para "${query}": ${filteredCities.length} cidades`
      );

      if (filteredCities.length > 0) {
        console.log(`✅ Cidades encontradas:`);
        filteredCities.forEach((city) => {
          const stateInfo = city.microrregiao?.mesorregiao?.UF
            ? `${city.microrregiao.mesorregiao.UF.sigla}`
            : "N/A";
          console.log(`  - ${city.nome}, ${stateInfo}`);
        });
      } else {
        console.log(`❌ Nenhuma cidade encontrada para "${query}"`);
      }

      console.log("---");
    } catch (error) {
      console.log(`❌ Erro ao buscar "${query}":`, error.message);
    }
  }

  console.log("\n✅ Teste da correção final concluído!");
  console.log("🎯 Agora a busca deve funcionar corretamente!");
  console.log("🇧🇷 Teste com diferentes cidades brasileiras!");
  console.log("\n🧪 Para testar na aplicação:");
  console.log("1. Acesse: http://localhost:3001/dashboard");
  console.log("2. Clique em 'Alterar' no card de Condições Atuais");
  console.log("3. Digite 'São Paulo' e verifique os resultados");
  console.log("4. Teste com outras cidades: Rio, Brasília, Salvador");
};

// Executar teste
testIBGEFinal();
