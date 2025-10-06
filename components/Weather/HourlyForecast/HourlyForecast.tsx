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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCw,
  Loader2,
  AlertTriangle,
  Cloud,
  Sun,
  CloudRain,
  CloudFog,
} from "lucide-react";
import { useHourlyForecast } from "@/hooks/useHourlyForecast";
import { useState } from "react";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function HourlyForecast() {
  const {
    data,
    isLoading,
    error,
    fetchHourlyForecast,
    hasData,
    getTimeSinceUpdate,
    getNextUpdateTime,
  } = useHourlyForecast({ userId: MOCK_USER_ID });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchHourlyForecast();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getWeatherIcon = (iconName: string, size: string = "h-6 w-6") => {
    const iconClass = `${size} text-blue-500`;

    switch (iconName) {
      case "sun":
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case "cloud":
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case "cloud-rain":
        return <CloudRain className={`${iconClass} text-blue-600`} />;
      case "cloud-fog":
        return <CloudFog className={`${iconClass} text-gray-400`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-400`} />;
    }
  };

  const getPrecipitationColor = (precipitation: number): string => {
    if (precipitation === 0) return "text-muted-foreground";
    if (precipitation <= 30) return "text-blue-400";
    if (precipitation <= 60) return "text-blue-500";
    return "text-blue-600";
  };

  if (isLoading && !hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Previsão Horária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Carregando previsão horária...
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
            <Cloud className="h-5 w-5" />
            Previsão Horária
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

  if (!hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Previsão Horária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma previsão horária disponível.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Previsão Horária
            </CardTitle>
            <CardDescription>Previsão das próximas 24 horas</CardDescription>
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
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {data.slice(0, 12).map((forecast, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-20 text-center space-y-2"
              >
                {/* Hora */}
                <div className="text-sm font-medium text-muted-foreground">
                  {forecast.time}
                </div>

                {/* Ícone do clima */}
                <div className="flex justify-center">
                  {getWeatherIcon(forecast.icon, "h-6 w-6")}
                </div>

                {/* Temperatura */}
                <div className="text-lg font-semibold">
                  {Math.round(forecast.temperature)}°
                </div>

                {/* Probabilidade de precipitação */}
                <div className="text-xs">
                  <span
                    className={getPrecipitationColor(forecast.precipitation)}
                  >
                    {forecast.precipitation}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Informações adicionais */}
        <div className="pt-4 border-t mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Próxima Atualização</p>
              <p className="font-semibold">{getNextUpdateTime()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fonte dos Dados</p>
              <p className="font-semibold">API Externa + Algoritmos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
