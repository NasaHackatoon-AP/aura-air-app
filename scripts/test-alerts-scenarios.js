// Script para testar cenários que geram alertas
const testAlertScenarios = () => {
  console.log("🧪 Testando Cenários de Alertas...\n");

  const scenarios = [
    {
      name: "Chuva Forte",
      data: {
        temperatura: 25,
        umidade: 85,
        vento: 8,
        descricao: "chuva forte",
        chuva_mm: 15,
      },
    },
    {
      name: "Calor Intenso",
      data: {
        temperatura: 38,
        umidade: 60,
        vento: 5,
        descricao: "ensolarado",
        chuva_mm: 0,
      },
    },
    {
      name: "Vento Forte",
      data: {
        temperatura: 22,
        umidade: 45,
        vento: 18,
        descricao: "nublado",
        chuva_mm: 0,
      },
    },
    {
      name: "Frio Intenso",
      data: {
        temperatura: 8,
        umidade: 70,
        vento: 12,
        descricao: "nublado",
        chuva_mm: 0,
      },
    },
    {
      name: "Qualidade do Ar Ruim",
      data: {
        temperatura: 30,
        umidade: 50,
        vento: 3,
        descricao: "nublado",
        chuva_mm: 0,
        aqi_personalizado: 120,
      },
    },
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`📊 Cenário ${index + 1}: ${scenario.name}`);
    console.log("Dados:", JSON.stringify(scenario.data, null, 2));

    // Verificar alertas
    const {
      temperatura,
      umidade,
      vento,
      descricao,
      chuva_mm,
      aqi_personalizado,
    } = scenario.data;

    console.log("🚨 Alertas que seriam gerados:");

    // Chuva forte
    if (umidade > 80 || descricao.includes("chuva") || chuva_mm > 0) {
      console.log("  ✅ Alerta de Chuva Forte");
    }

    // Calor intenso
    if (temperatura > 35) {
      console.log("  ✅ Alerta de Calor Intenso");
    }

    // Frio intenso
    if (temperatura < 10) {
      console.log("  ✅ Alerta de Frio Intenso");
    }

    // Vento forte
    if (vento > 15) {
      console.log("  ✅ Alerta de Vento Forte");
    }

    // Qualidade do ar
    if (aqi_personalizado && aqi_personalizado > 100) {
      console.log("  ✅ Alerta de Qualidade do Ar");
    }

    // Índice UV (simulado para meio-dia)
    const hour = 12; // meio-dia
    let baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8;
    if (descricao.includes("ensolarado")) {
      baseUV *= 1.2;
    }
    const uvIndex = Math.max(0, Math.round(baseUV));
    if (uvIndex >= 6) {
      console.log("  ✅ Alerta de Índice UV Alto");
    }

    console.log("\n");
  });

  console.log("✅ Todos os cenários testados!");
};

// Executar teste
testAlertScenarios();
