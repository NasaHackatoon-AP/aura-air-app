"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  AlertCircle,
  TestTube,
  Zap,
} from "lucide-react";

interface EmergencyScenario {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  data: {
    temperatura: number;
    umidade: number;
    vento: number;
    descricao: string;
    chuva_mm: number;
    aqi_personalizado: number;
  };
}

const emergencyScenarios: EmergencyScenario[] = [
  {
    id: "storm",
    name: "Tempestade Severa",
    description: "Simula uma tempestade com chuva forte e ventos intensos",
    icon: <CloudRain className="h-5 w-5 text-blue-600" />,
    data: {
      temperatura: 22,
      umidade: 95,
      vento: 25,
      descricao: "chuva forte",
      chuva_mm: 45,
      aqi_personalizado: 85,
    },
  },
  {
    id: "heatwave",
    name: "Onda de Calor",
    description: "Simula uma onda de calor extrema com alta temperatura",
    icon: <Thermometer className="h-5 w-5 text-red-600" />,
    data: {
      temperatura: 42,
      umidade: 75,
      vento: 3,
      descricao: "ensolarado",
      chuva_mm: 0,
      aqi_personalizado: 95,
    },
  },
  {
    id: "coldwave",
    name: "Frente Fria",
    description: "Simula uma frente fria com temperaturas muito baixas",
    icon: <Thermometer className="h-5 w-5 text-blue-500" />,
    data: {
      temperatura: 5,
      umidade: 85,
      vento: 20,
      descricao: "nublado",
      chuva_mm: 8,
      aqi_personalizado: 60,
    },
  },
  {
    id: "pollution",
    name: "Poluição Extrema",
    description: "Simula condições de poluição atmosférica severa",
    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
    data: {
      temperatura: 28,
      umidade: 45,
      vento: 2,
      descricao: "nublado",
      chuva_mm: 0,
      aqi_personalizado: 180,
    },
  },
  {
    id: "uv-extreme",
    name: "Índice UV Extremo",
    description: "Simula condições de índice UV muito alto",
    icon: <Sun className="h-5 w-5 text-yellow-600" />,
    data: {
      temperatura: 35,
      umidade: 30,
      vento: 8,
      descricao: "céu limpo",
      chuva_mm: 0,
      aqi_personalizado: 70,
    },
  },
];

export function WeatherAlertsTest() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleEmergencyTest = async (scenario: EmergencyScenario) => {
    setIsTesting(true);
    setActiveScenario(scenario.id);

    try {
      console.log(`🚨 Teste de Emergência: ${scenario.name}`);
      console.log("Dados simulados:", scenario.data);

      // Chamar API de teste para forçar dados específicos
      const response = await fetch("/api/weather-conditions-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: scenario.id,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const testData = await response.json();
      console.log("📊 Dados de teste recebidos:", testData);

      // Simular delay para mostrar o processo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Gerar alertas baseados nos dados de teste
      const alerts = generateAlertsFromScenario(testData.clima);
      console.log("🚨 Alertas gerados:", alerts);

      // Simular reset após 8 segundos
      setTimeout(() => {
        setActiveScenario(null);
        setIsTesting(false);
      }, 8000);
    } catch (error) {
      console.error("❌ Erro no teste de emergência:", error);
      setIsTesting(false);
      setActiveScenario(null);
    }
  };

  const generateAlertsFromScenario = (data: any) => {
    const alerts = [];

    // Chuva forte
    if (
      data.umidade > 80 ||
      data.descricao.includes("chuva") ||
      data.chuva_mm > 0
    ) {
      alerts.push({
        type: "rain",
        title: "Alerta de Chuva Forte",
        severity: "warning",
        description:
          "Possibilidade de chuva forte entre 18h e 21h. Recomenda-se evitar áreas de alagamento.",
      });
    }

    // Calor intenso
    if (data.temperatura > 35) {
      alerts.push({
        type: "temperature",
        title: "Alerta de Calor Intenso",
        severity: "danger",
        description: `Temperatura elevada de ${data.temperatura}°C. Risco de desidratação e insolação.`,
      });
    }

    // Frio intenso
    if (data.temperatura < 10) {
      alerts.push({
        type: "temperature",
        title: "Alerta de Frio Intenso",
        severity: "warning",
        description: `Temperatura baixa de ${data.temperatura}°C. Risco de hipotermia.`,
      });
    }

    // Vento forte
    if (data.vento > 15) {
      alerts.push({
        type: "wind",
        title: "Alerta de Vento Forte",
        severity: "warning",
        description: `Ventos fortes de até ${data.vento} km/h. Cuidado com objetos soltos e árvores.`,
      });
    }

    // Qualidade do ar
    if (data.aqi_personalizado > 100) {
      alerts.push({
        type: "air_quality",
        title: "Alerta de Qualidade do Ar",
        severity: "danger",
        description: `Qualidade do ar prejudicial (AQI: ${data.aqi_personalizado}). Evite atividades ao ar livre.`,
      });
    }

    return alerts;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-purple-600" />
          Teste de Emergência - Alertas Meteorológicos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Simule situações de emergência para testar os alertas meteorológicos
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isTesting && (
            <Alert className="border-orange-200 bg-orange-50">
              <Zap className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Teste de emergência ativo!</strong> Simulando condições
                extremas...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  activeScenario === scenario.id
                    ? "border-red-300 bg-red-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {scenario.icon}
                  <div>
                    <h3 className="font-semibold text-sm">{scenario.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Temp:</span>
                      <span className="font-medium ml-1">
                        {scenario.data.temperatura}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Umidade:</span>
                      <span className="font-medium ml-1">
                        {scenario.data.umidade}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vento:</span>
                      <span className="font-medium ml-1">
                        {scenario.data.vento} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">AQI:</span>
                      <span className="font-medium ml-1">
                        {scenario.data.aqi_personalizado}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleEmergencyTest(scenario)}
                  disabled={isTesting}
                  variant={
                    activeScenario === scenario.id ? "destructive" : "outline"
                  }
                  size="sm"
                  className="w-full"
                >
                  {activeScenario === scenario.id ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-pulse" />
                      Teste Ativo
                    </>
                  ) : (
                    <>
                      <TestTube className="mr-2 h-4 w-4" />
                      Simular Emergência
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {activeScenario && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">
                  Situação de Emergência Ativa
                </h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Os alertas meteorológicos estão sendo gerados baseados nos dados
                simulados. Verifique o card "Alertas Meteorológicos" para ver os
                alertas em tempo real.
              </p>
              <div className="text-xs text-red-600">
                ⏱️ O teste será resetado automaticamente em alguns segundos...
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Como usar:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Clique em "Simular Emergência" para ativar um cenário</li>
                <li>Observe os alertas sendo gerados no card principal</li>
                <li>O teste será resetado automaticamente</li>
                <li>
                  Use para testar diferentes tipos de alertas meteorológicos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
