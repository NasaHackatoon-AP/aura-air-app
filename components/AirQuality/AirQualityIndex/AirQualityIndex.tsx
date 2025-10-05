"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wind, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAirQuality } from "@/hooks/useAirQuality";
import { useState } from "react";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function AirQualityIndex() {
  const {
    data,
    isLoading,
    error,
    fetchAirQuality,
    hasData,
    getAQICategory,
    getAQIColor,
    getAQIDescription,
    getTimeSinceUpdate,
    getNextUpdateTime,
  } = useAirQuality({ userId: MOCK_USER_ID });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAirQuality();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Dados de fallback se não houver dados da API
  const aqiValue = data?.aqi_personalizado || data?.aqi_original || 0;
  const category = getAQICategory(aqiValue);
  const color = getAQIColor(aqiValue);
  const description = getAQIDescription(aqiValue);

  // Função para obter cor do progresso baseada no AQI
  const getProgressColor = (value: number): string => {
    if (value <= 50) return "bg-green-500";
    if (value <= 100) return "bg-yellow-500";
    if (value <= 150) return "bg-orange-500";
    if (value <= 200) return "bg-red-500";
    if (value <= 300) return "bg-purple-500";
    return "bg-red-700";
  };

  if (isLoading && !hasData) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">
              Índice de Qualidade do Ar (IQA)
            </span>
            <span className="sm:hidden">Qualidade do Ar</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Medição em tempo real da qualidade do ar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Carregando dados...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">
              Índice de Qualidade do Ar (IQA)
            </span>
            <span className="sm:hidden">Qualidade do Ar</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Medição em tempo real da qualidade do ar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="w-full"
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
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">
                Índice de Qualidade do Ar (IQA)
              </span>
              <span className="sm:hidden">Qualidade do Ar</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Medição em tempo real da qualidade do ar
            </CardDescription>
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
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="flex items-end gap-3 sm:gap-4">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            {aqiValue}
          </div>
          <div className="pb-1 sm:pb-2">
            <p className={cn("text-xl sm:text-2xl font-semibold", color)}>
              {category}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">de 500</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress
            value={(aqiValue / 500) * 100}
            className="h-3"
            style={
              {
                "--progress-background": getProgressColor(aqiValue),
              } as React.CSSProperties
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
            <span>300</span>
            <span>500</span>
          </div>
        </div>

        <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Informações adicionais se houver dados da API */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cidade</p>
              <p className="font-semibold text-base">
                {data.clima?.cidade || "São Paulo"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Temperatura</p>
              <p className="font-semibold text-base">
                {data.clima?.temperatura
                  ? `${Math.round(data.clima.temperatura)}°C`
                  : "N/A"}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
          <div>
            <p className="text-sm sm:text-sm text-muted-foreground mb-1">
              Atualizado
            </p>
            <p className="font-semibold text-base sm:text-base">
              {getTimeSinceUpdate()}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-sm text-muted-foreground mb-1">
              Próxima atualização
            </p>
            <p className="font-semibold text-base sm:text-base">
              {getNextUpdateTime()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
