"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Cloud,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Loader2,
  MapPin,
  Calendar,
  Activity,
} from "lucide-react";
import { useAQIForecast } from "@/hooks/useAQIForecast";
import { AQI_COLORS } from "@/types/aqiForecast";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function AQIForecast() {
  const { forecast, isLoading, error, fetchForecast, hasForecast } =
    useAQIForecast({ userId: MOCK_USER_ID });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchForecast();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return AQI_COLORS["Bom"];
    if (aqi <= 100) return AQI_COLORS["Moderado"];
    if (aqi <= 150) return AQI_COLORS["Insalubre para grupos sensíveis"];
    if (aqi <= 200) return AQI_COLORS["Insalubre"];
    if (aqi <= 300) return AQI_COLORS["Muito insalubre"];
    return AQI_COLORS["Perigoso"];
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Bom";
    if (aqi <= 100) return "Moderado";
    if (aqi <= 150) return "Insalubre para grupos sensíveis";
    if (aqi <= 200) return "Insalubre";
    if (aqi <= 300) return "Muito insalubre";
    return "Perigoso";
  };

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Previsão de AQI</span>
            <span className="sm:hidden">AQI</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
            <CardTitle className="text-lg sm:text-xl">
              <span className="hidden sm:inline">Previsão de AQI</span>
              <span className="sm:hidden">AQI</span>
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription className="text-sm">
          Previsão personalizada para 15 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">API de AQI Indisponível</p>
                <p className="text-sm">
                  Não foi possível conectar com o serviço de previsão de
                  qualidade do ar.
                </p>
                <p className="text-xs opacity-75">{error}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!hasForecast && !isLoading && (
          <div className="text-center py-8">
            <Cloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhuma previsão disponível
            </p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Buscar Previsão
                </>
              )}
            </Button>
          </div>
        )}

        {forecast && (
          <>
            {/* Informações da localização */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {forecast.cidade}, {forecast.estado}
              </span>
              <Badge variant="outline" className="ml-auto">
                {forecast.precisao}% precisão
              </Badge>
            </div>

            {/* Previsão de 15 dias com scroll horizontal */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Previsão para 15 Dias</h3>
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {forecast.previsao.map((day, index) => (
                    <Card
                      key={index}
                      className="min-w-[120px] flex-shrink-0 p-3 bg-slate-800 border-slate-700"
                    >
                      <div className="space-y-2 text-center">
                        {/* Dia da semana */}
                        <div className="text-xs font-medium text-white">
                          {new Date(day.data).toLocaleDateString("pt-BR", {
                            weekday: "short",
                          })}
                        </div>

                        {/* Ícone de AQI */}
                        <div className="flex justify-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: getAQIColor(day.aqi) }}
                          >
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* Categoria do AQI */}
                        <div className="text-xs text-slate-300">
                          {getAQICategory(day.aqi)}
                        </div>

                        {/* Valor do AQI */}
                        <div
                          className="text-lg font-bold"
                          style={{ color: getAQIColor(day.aqi) }}
                        >
                          {day.aqi}
                        </div>

                        {/* Recomendação resumida */}
                        {day.recomendacoes.length > 0 && (
                          <div className="text-xs text-slate-400 line-clamp-2">
                            {day.recomendacoes[0].length > 30
                              ? day.recomendacoes[0].substring(0, 30) + "..."
                              : day.recomendacoes[0]}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Indicadores de scroll */}
                <div className="flex justify-center mt-2 gap-1">
                  {Array.from({
                    length: Math.ceil(forecast.previsao.length / 4),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-slate-600"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico de tendência */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Tendência de AQI</h3>
              <div className="flex items-end gap-1 h-20">
                {forecast.previsao.slice(0, 15).map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.min((day.aqi / 300) * 100, 100)}%`,
                        backgroundColor: getAQIColor(day.aqi),
                        minHeight: "4px",
                      }}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {day.aqi}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Última Atualização</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(forecast.ultima_atualizacao).toLocaleString(
                      "pt-BR"
                    )}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fonte dos Dados</h4>
                <div className="text-sm text-muted-foreground">
                  {forecast.fonte_dados}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
