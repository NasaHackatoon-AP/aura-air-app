// Script para testar no console do navegador
// Cole este código no console do navegador (F12)

console.log("🧪 Testando Alertas Meteorológicos no Navegador...");

// Função para testar a API
const testWeatherAlertsAPI = async () => {
  try {
    console.log("📡 Testando API...");

    const response = await fetch("/api/weather-conditions?userId=1");
    const data = await response.json();

    console.log("✅ API funcionando:", data);

    // Analisar dados para alertas
    const { clima } = data;
    console.log("🔍 Dados climáticos:", clima);

    // Verificar condições
    const alerts = [];

    if (
      clima.umidade > 80 ||
      clima.descricao.includes("chuva") ||
      clima.chuva_mm > 0
    ) {
      alerts.push("🌧️ Alerta de Chuva Forte");
    }

    if (clima.temperatura > 35) {
      alerts.push("🌡️ Alerta de Calor Intenso");
    }

    if (clima.temperatura < 10) {
      alerts.push("❄️ Alerta de Frio Intenso");
    }

    if (clima.vento > 15) {
      alerts.push("💨 Alerta de Vento Forte");
    }

    const aqi = data.aqi_personalizado || data.aqi_original;
    if (aqi > 100) {
      alerts.push("🌫️ Alerta de Qualidade do Ar");
    }

    // Índice UV
    const hour = new Date().getHours();
    let baseUV = 0;
    if (hour >= 6 && hour <= 18) {
      baseUV = Math.sin(((hour - 6) * Math.PI) / 12) * 8;
    }
    if (
      clima.descricao.includes("limpo") ||
      clima.descricao.includes("ensolarado")
    ) {
      baseUV *= 1.2;
    }
    const uvIndex = Math.max(0, Math.round(baseUV));
    if (uvIndex >= 6) {
      alerts.push("☀️ Alerta de Índice UV Alto");
    }

    console.log("🚨 Alertas que seriam gerados:", alerts);

    if (alerts.length === 0) {
      console.log("✅ Nenhum alerta ativo - condições normais");
    }
  } catch (error) {
    console.error("❌ Erro:", error);
  }
};

// Executar teste
testWeatherAlertsAPI();

console.log("💡 Para testar novamente, execute: testWeatherAlertsAPI()");
