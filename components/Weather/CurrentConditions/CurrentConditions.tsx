"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Loader2,
  AlertTriangle,
  Cloud,
  Droplets,
  Wind,
  Eye,
  Sun,
  Thermometer,
} from "lucide-react";
import { useWeatherConditions } from "@/hooks/useWeatherConditions";
import { useState } from "react";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function CurrentConditions() {
  const {
    data,
    isLoading,
    error,
    fetchWeatherConditions,
    hasData,
    getTimeSinceUpdate,
    getNextUpdateTime,
  } = useWeatherConditions({ userId: MOCK_USER_ID });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchWeatherConditions();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes("limpo") || description.includes("ensolarado")) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else if (
      description.includes("nublado") ||
      description.includes("nuvens")
    ) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else if (description.includes("chuva")) {
      return <Droplets className="h-8 w-8 text-blue-500" />;
    }
    return <Cloud className="h-8 w-8 text-gray-400" />;
  };

  const getUVLevel = (uvIndex: number): { level: string; color: string } => {
    if (uvIndex <= 2) return { level: "Baixo", color: "text-green-500" };
    if (uvIndex <= 5) return { level: "Moderado", color: "text-yellow-500" };
    if (uvIndex <= 7) return { level: "Alto", color: "text-orange-500" };
    if (uvIndex <= 10) return { level: "Muito Alto", color: "text-red-500" };
    return { level: "Extremo", color: "text-purple-500" };
  };

  if (isLoading && !hasData) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Condições Atuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Carregando condições climáticas...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Condições Atuais
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

  if (!data) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Condições Atuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum dado climático disponível.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const uvInfo = getUVLevel(data.indice_uv);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Condições Atuais
            </CardTitle>
            <CardDescription>Dados climáticos em tempo real</CardDescription>
            {hasData && (
              <p className="text-xs text-muted-foreground mt-1">
                Última atualização: {getTimeSinceUpdate()}
              </p>
            )}
          </div>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Temperatura Principal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold">
                {Math.round(data.temperatura)}°C
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Sensação térmica: {data.sensacao_termica}°C
                </p>
                <p className="text-sm font-medium capitalize">
                  {data.descricao}
                </p>
                <p className="text-sm text-muted-foreground">{data.cidade}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {getWeatherIcon(data.descricao)}
            </div>
          </div>

          {/* Métricas Detalhadas */}
          <div className="grid grid-cols-3 gap-4">
            {/* Coluna Esquerda */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Umidade</p>
                  <p className="text-lg font-semibold">{data.umidade}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-600 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pressão</p>
                  <p className="text-lg font-semibold">{data.pressao} hPa</p>
                </div>
              </div>
            </div>

            {/* Coluna Central */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Vento</p>
                  <p className="text-lg font-semibold">{data.vento} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Índice UV</p>
                  <p className="text-lg font-semibold">
                    {data.indice_uv}{" "}
                    <span className={`text-sm ${uvInfo.color}`}>
                      ({uvInfo.level})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Visibilidade</p>
                  <p className="text-lg font-semibold">
                    {data.visibilidade} km
                  </p>
                </div>
              </div>
              {data.chuva_mm > 0 && (
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Precipitação
                    </p>
                    <p className="text-lg font-semibold">{data.chuva_mm} mm</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Próxima Atualização</p>
                <p className="font-semibold">{getNextUpdateTime()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fonte dos Dados</p>
                <p className="font-semibold">API Externa + Cálculos</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
