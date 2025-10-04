"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, Wind, Droplets, Eye, Gauge } from "lucide-react";

interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
}

const mockWeatherData: WeatherData = {
  temperature: 24,
  feelsLike: 26,
  condition: "Parcialmente Nublado",
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  pressure: 1013,
  uvIndex: 6,
};

export function WeatherOverview() {
  const data = mockWeatherData;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Condições Atuais</span>
          <span className="sm:hidden">Clima</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {data.temperature}°C
            </div>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Sensação térmica: {data.feelsLike}°C
            </p>
            <p className="text-base sm:text-lg mt-2 truncate">
              {data.condition}
            </p>
          </div>
          <Sun className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-primary flex-shrink-0 ml-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Umidade
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Vento
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.windSpeed} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Visibilidade
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.visibility} km
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Pressão
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.pressure} hPa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 col-span-2 sm:col-span-1">
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Índice UV
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.uvIndex} (Alto)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
