// Script para debugar a estrutura da API IBGE
const debugIBGEStructure = async () => {
  console.log("🔍 Debugando estrutura da API IBGE...\n");

  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
    );

    if (!response.ok) {
      console.log(`❌ Erro na API: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log(`📊 Total de municípios: ${data.length}`);

    if (data.length > 0) {
      console.log("\n🔍 Estrutura do primeiro município:");
      console.log(JSON.stringify(data[0], null, 2));

      console.log("\n🔍 Estrutura do segundo município:");
      console.log(JSON.stringify(data[1], null, 2));

      // Procurar por São Paulo
      const saoPaulo = data.find((city) => city.nome === "São Paulo");
      if (saoPaulo) {
        console.log("\n🔍 Estrutura de São Paulo:");
        console.log(JSON.stringify(saoPaulo, null, 2));
      } else {
        console.log("\n❌ São Paulo não encontrado");
      }

      // Procurar por Rio de Janeiro
      const rio = data.find((city) => city.nome === "Rio de Janeiro");
      if (rio) {
        console.log("\n🔍 Estrutura do Rio de Janeiro:");
        console.log(JSON.stringify(rio, null, 2));
      } else {
        console.log("\n❌ Rio de Janeiro não encontrado");
      }
    }
  } catch (error) {
    console.log("❌ Erro ao buscar dados:", error.message);
  }

  console.log("\n✅ Debug da estrutura IBGE concluído!");
};

// Executar debug
debugIBGEStructure();
