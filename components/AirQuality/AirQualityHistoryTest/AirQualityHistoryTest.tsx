"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAirQualityHistory } from "@/hooks/useAirQualityHistory";
import {
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

export function AirQualityHistoryTest() {
  const [testUserId, setTestUserId] = useState(1);

  const {
    data,
    historyData,
    isLoading,
    error,
    fetchAirQualityHistory,
    hasData,
    getTimeSinceUpdate,
    getNextUpdateTime,
  } = useAirQualityHistory({
    userId: testUserId,
    autoFetch: false, // Desabilitar auto-fetch para teste manual
  });

  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await fetchAirQualityHistory();
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Teste da API de Histórico de Qualidade do Ar
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
                <strong>Sucesso!</strong> Dados históricos carregados da API
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
              <h3 className="font-semibold">Dados Históricos Gerados (24h)</h3>
              <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                {historyData.map((point, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {point.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {index === historyData.length - 1
                          ? "Atual"
                          : "Histórico"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>IQA:</span>
                        <span className="font-semibold">{point.aqi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PM2.5:</span>
                        <span className="font-semibold">
                          {point.pm25} μg/m³
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-primary"
                        style={{
                          width: `${Math.min((point.aqi / 100) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cidade</p>
                  <p className="font-semibold">{data.clima?.cidade || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">AQI Atual</p>
                  <p className="font-semibold">
                    {data.aqi_personalizado || data.aqi_original || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Próxima Atualização</p>
                  <p className="font-semibold">{getNextUpdateTime()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasData && !error && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              Clique em "Testar API" para carregar dados históricos da API
              externa
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
