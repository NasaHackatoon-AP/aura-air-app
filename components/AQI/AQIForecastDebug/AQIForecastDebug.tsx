"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Terminal,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useAQIForecast } from "@/hooks/useAQIForecast";

const MOCK_USER_ID = 1;

export function AQIForecastDebug() {
  const { forecast, isLoading, error, fetchForecast, hasForecast } =
    useAQIForecast({
      userId: MOCK_USER_ID,
      autoFetch: false, // Desabilita autoFetch para controle manual
    });

  const [testResults, setTestResults] = useState<{
    fetch?: { success: boolean; message: string; data?: any };
  }>({});
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    setTestResults({});

    try {
      await fetchForecast();
      setTestResults({
        fetch: {
          success: true,
          message: "Previsão carregada com sucesso!",
          data: forecast,
        },
      });
    } catch (err: any) {
      setTestResults({
        fetch: {
          success: false,
          message: `Erro ao carregar previsão: ${
            err.message || "Erro desconhecido"
          }`,
        },
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Debug da API de Previsão AQI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={runTest} disabled={isTesting} className="flex-1">
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Testar Carregamento
          </Button>
        </div>

        {/* Resultados dos testes */}
        <div className="space-y-2">
          {testResults.fetch && (
            <Alert
              variant={testResults.fetch.success ? "default" : "destructive"}
            >
              {testResults.fetch.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testResults.fetch.success ? "Sucesso" : "Erro"}
              </AlertTitle>
              <AlertDescription>{testResults.fetch.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Status atual */}
        <div className="space-y-2">
          <h3 className="font-semibold">Status Atual:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Loading: {isLoading ? "✅ Sim" : "❌ Não"}</div>
            <div>Has Forecast: {hasForecast ? "✅ Sim" : "❌ Não"}</div>
            <div>Error: {error ? "❌ Sim" : "✅ Não"}</div>
            <div>Forecast Data: {forecast ? "✅ Sim" : "❌ Não"}</div>
          </div>
        </div>

        {/* Dados da previsão */}
        {forecast && (
          <div className="mt-4 p-4 border rounded-md bg-muted">
            <h3 className="font-semibold mb-2">
              Dados da Previsão (ID: {forecast.usuario_id})
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Cidade:</strong> {forecast.cidade}, {forecast.estado}
              </div>
              <div>
                <strong>Fonte:</strong> {forecast.fonte_dados}
              </div>
              <div>
                <strong>Precisão:</strong> {forecast.precisao}%
              </div>
              <div>
                <strong>Dias de previsão:</strong>{" "}
                {forecast.previsao?.length || 0}
              </div>
              <div>
                <strong>Última atualização:</strong>{" "}
                {new Date(forecast.ultima_atualizacao).toLocaleString("pt-BR")}
              </div>
            </div>

            {forecast.previsao && forecast.previsao.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold mb-2">Primeiros 3 dias:</h4>
                <div className="space-y-1 text-xs">
                  {forecast.previsao.slice(0, 3).map((day, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {new Date(day.data).toLocaleDateString("pt-BR")}
                      </span>
                      <span>
                        AQI: {day.aqi} ({day.categoria})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Erro detalhado */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erro Detalhado</AlertTitle>
            <AlertDescription>
              <div className="space-y-1">
                <div>
                  <strong>Mensagem:</strong> {error}
                </div>
                <div>
                  <strong>Timestamp:</strong>{" "}
                  {new Date().toLocaleString("pt-BR")}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Dados brutos para debug */}
        {forecast && (
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">
              Dados Brutos (JSON)
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(forecast, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
