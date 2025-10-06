"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePollutants } from "@/hooks/usePollutants";
import {
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";

export function PollutantsTest() {
  const [testUserId, setTestUserId] = useState(1);

  const {
    data,
    isLoading,
    error,
    fetchPollutants,
    hasData,
    pollutants,
    getPollutantColor,
    getTimeSinceUpdate,
  } = usePollutants({
    userId: testUserId,
    autoFetch: false, // Desabilitar auto-fetch para teste manual
  });

  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await fetchPollutants();
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Teste da API de Poluentes Atmosféricos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={testUserId}
            onChange={(e) => setTestUserId(parseInt(e.target.value) || 1)}
            className="px-3 py-2 border rounded-md"
            placeholder="User ID"
            min="1"
          />
          <Button
            onClick={handleTest}
            disabled={isTesting || isLoading}
            className="flex items-center gap-2"
          >
            {isTesting || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Testar API
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Erro:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {hasData && data && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sucesso!</strong> Dados de poluentes carregados da API
                externa
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Dados de AQI</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>AQI Original:</span>
                    <Badge variant="outline">{data.aqi_original}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>AQI Personalizado:</span>
                    <Badge variant="outline">{data.aqi_personalizado}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Nível de Alerta:</span>
                    <Badge variant="secondary">{data.nivel_alerta}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Dados Climáticos</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cidade:</span>
                    <span>{data.clima?.cidade || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperatura:</span>
                    <span>
                      {data.clima?.temperatura
                        ? `${Math.round(data.clima.temperatura)}°C`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última atualização:</span>
                    <span>{getTimeSinceUpdate()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Poluentes Calculados</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pollutants.map((pollutant) => (
                  <div
                    key={pollutant.nome}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">
                          {pollutant.nome.split(" ")[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pollutant.nome}
                        </p>
                      </div>
                      <Badge
                        className={
                          pollutant.status === "Bom"
                            ? "bg-green-100 text-green-800"
                            : pollutant.status === "Moderado"
                            ? "bg-yellow-100 text-yellow-800"
                            : pollutant.status === "Alto"
                            ? "bg-orange-100 text-orange-800"
                            : pollutant.status === "Muito Alto"
                            ? "bg-red-100 text-red-800"
                            : "bg-red-200 text-red-900"
                        }
                      >
                        {pollutant.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Concentração:</span>
                        <span className="font-semibold">
                          {pollutant.concentracao} {pollutant.unidade}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Limite:</span>
                        <span>
                          {pollutant.limite_recomendado} {pollutant.unidade}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (pollutant.concentracao /
                                pollutant.limite_recomendado) *
                                100,
                              100
                            )}%`,
                            backgroundColor: getPollutantColor(pollutant.status)
                              .replace("bg-", "#")
                              .replace("-500", ""),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!hasData && !error && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              Clique em "Testar API" para carregar dados de poluentes da API
              externa
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
