"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Activity,
  Loader2,
  AlertTriangle,
  RefreshCcw,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAQIForecast } from "@/hooks/useAQIForecast";
import { AQI_COLORS, AQI_LIMITS } from "@/types/aqiForecast";
import { Button } from "@/components/ui/button";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

const iconMap = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
};

export function WeatherForecast() {
  const { forecast, isLoading, error, hasForecast, fetchForecast } =
    useAQIForecast({
      userId: MOCK_USER_ID,
    });

  const getAQIColor = (aqi: number) => {
    if (aqi <= AQI_LIMITS.GOOD.max) return AQI_COLORS.Bom;
    if (aqi <= AQI_LIMITS.MODERATE.max) return AQI_COLORS.Moderado;
    if (aqi <= AQI_LIMITS.UNHEALTHY_SENSITIVE.max)
      return AQI_COLORS["Insalubre para grupos sensíveis"];
    if (aqi <= AQI_LIMITS.UNHEALTHY.max) return AQI_COLORS.Insalubre;
    if (aqi <= AQI_LIMITS.VERY_UNHEALTHY.max)
      return AQI_COLORS["Muito insalubre"];
    return AQI_COLORS.Perigoso;
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= AQI_LIMITS.GOOD.max) return "Bom";
    if (aqi <= AQI_LIMITS.MODERATE.max) return "Moderado";
    if (aqi <= AQI_LIMITS.UNHEALTHY_SENSITIVE.max)
      return "Insalubre para grupos sensíveis";
    if (aqi <= AQI_LIMITS.UNHEALTHY.max) return "Insalubre";
    if (aqi <= AQI_LIMITS.VERY_UNHEALTHY.max) return "Muito insalubre";
    return "Perigoso";
  };

  const getWeatherIcon = (aqi: number) => {
    if (aqi <= 50) return "sun";
    if (aqi <= 100) return "cloud";
    if (aqi <= 150) return "cloud";
    if (aqi <= 200) return "rain";
    if (aqi <= 300) return "rain";
    return "rain";
  };

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Previsão para 15 Dias</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Previsão para 15 Dias</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <div>
              <p className="font-semibold text-destructive mb-1">
                API de AQI Indisponível
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Não foi possível conectar com o serviço de previsão de qualidade
                do ar.
              </p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasForecast) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Previsão para 15 Dias</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Cloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma previsão disponível
            </p>
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
              <Activity className="h-5 w-5" />
              Previsão de Qualidade do Ar - 15 Dias
            </CardTitle>
            {forecast && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {forecast.cidade}, {forecast.estado}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {forecast.precisao}% precisão
                </div>
                <div className="text-xs">Fonte: {forecast.fonte_dados}</div>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchForecast}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {forecast?.previsao.map((day, index) => {
              const weatherIcon = getWeatherIcon(day.aqi);
              const Icon = iconMap[weatherIcon as keyof typeof iconMap];
              const aqiColor = getAQIColor(day.aqi);
              const aqiCategory = getAQICategory(day.aqi);

              return (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors h-full">
                    {/* Data */}
                    <div className="text-center mb-3">
                      <p className="font-semibold text-sm">
                        {new Date(day.data).toLocaleDateString("pt-BR", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(day.data).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Ícone de AQI */}
                    <div className="flex items-center justify-center mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: aqiColor }}
                      >
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Valor do AQI */}
                    <div className="text-center mb-2">
                      <span
                        className="font-bold text-lg"
                        style={{ color: aqiColor }}
                      >
                        {day.aqi}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        AQI
                      </span>
                    </div>

                    {/* Categoria do AQI */}
                    <p className="text-xs text-muted-foreground mb-2 text-center font-medium">
                      {aqiCategory}
                    </p>

                    {/* Risco de Saúde */}
                    <div className="text-center mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        Risco: {day.risco_saude}
                      </span>
                    </div>

                    {/* Recomendação resumida */}
                    {day.recomendacoes.length > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {day.recomendacoes[0].length > 35
                            ? day.recomendacoes[0].substring(0, 35) + "..."
                            : day.recomendacoes[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
