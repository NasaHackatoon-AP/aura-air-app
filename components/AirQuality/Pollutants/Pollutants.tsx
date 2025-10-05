"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Loader2, AlertTriangle, Activity } from "lucide-react";
import { usePollutants } from "@/hooks/usePollutants";
import { useState } from "react";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function Pollutants() {
  const {
    data,
    isLoading,
    error,
    fetchPollutants,
    hasData,
    pollutants,
    getPollutantColor,
    getTimeSinceUpdate,
  } = usePollutants({ userId: MOCK_USER_ID });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPollutants();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading && !hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Poluentes Atmosféricos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Carregando dados de poluentes...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Poluentes Atmosféricos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="w-full mt-4"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Poluentes Atmosféricos
          </CardTitle>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
          >
            {isRefreshing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        {hasData && (
          <p className="text-sm text-muted-foreground">
            Última atualização: {getTimeSinceUpdate()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pollutants.map((pollutant) => (
            <div key={pollutant.nome} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {pollutant.nome.split(" ")[0]}{" "}
                    {/* Primeira palavra como símbolo */}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pollutant.nome}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {pollutant.concentracao}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {pollutant.unidade}
                    </span>
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Progress
                  value={
                    (pollutant.concentracao / pollutant.limite_recomendado) *
                    100
                  }
                  className="h-3"
                  style={
                    {
                      "--progress-background": getPollutantColor(
                        pollutant.status
                      ),
                    } as React.CSSProperties
                  }
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Limite: {pollutant.limite_recomendado} {pollutant.unidade}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      pollutant.status === "Bom"
                        ? "bg-green-100 text-green-800"
                        : pollutant.status === "Moderado"
                        ? "bg-yellow-100 text-yellow-800"
                        : pollutant.status === "Alto"
                        ? "bg-orange-100 text-orange-800"
                        : pollutant.status === "Muito Alto"
                        ? "bg-red-100 text-red-800"
                        : "bg-red-200 text-red-900"
                    }`}
                  >
                    {pollutant.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações adicionais se houver dados da API */}
        {data && (
          <div className="mt-6 pt-4 border-t">
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
                <p className="text-muted-foreground">Nível de Alerta</p>
                <p className="font-semibold capitalize">
                  {data.nivel_alerta || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
