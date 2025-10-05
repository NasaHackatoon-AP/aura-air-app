"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAirQuality } from "@/hooks/useAirQuality";
import { RefreshCw, Loader2, CheckCircle, XCircle } from "lucide-react";

export function AirQualityTest() {
  const [testUserId, setTestUserId] = useState(1);

  const {
    data,
    isLoading,
    error,
    fetchAirQuality,
    hasData,
    getAQICategory,
    getAQIColor,
    getTimeSinceUpdate,
  } = useAirQuality({
    userId: testUserId,
    autoFetch: false, // Desabilitar auto-fetch para teste manual
  });

  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await fetchAirQuality();
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Teste da API de Qualidade do Ar
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
                <strong>Sucesso!</strong> Dados carregados da API externa
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
                    <span>Categoria:</span>
                    <Badge className={getAQIColor(data.aqi_personalizado)}>
                      {getAQICategory(data.aqi_personalizado)}
                    </Badge>
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
                    <span>Umidade:</span>
                    <span>
                      {data.clima?.umidade ? `${data.clima.umidade}%` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vento:</span>
                    <span>
                      {data.clima?.vento ? `${data.clima.vento} km/h` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descrição:</span>
                    <span>{data.clima?.descricao || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Informações de Atualização</h3>
              <div className="text-sm text-muted-foreground">
                <p>Última atualização: {getTimeSinceUpdate()}</p>
                <p>
                  Coordenadas: {data.latitude}, {data.longitude}
                </p>
                <p>User ID: {data.usuario_id}</p>
              </div>
            </div>
          </div>
        )}

        {!hasData && !error && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Clique em "Testar API" para carregar dados da API externa</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
