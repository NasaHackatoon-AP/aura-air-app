"use client";

import { CurrentConditions } from "@/components/Weather/CurrentConditions/CurrentConditions";
import { HourlyForecast } from "@/components/Weather/HourlyForecast/HourlyForecast";

export function WeatherDashboard() {
  return (
    <div className="space-y-6">
      {/* Condições Atuais */}
      <CurrentConditions />

      {/* Previsão Horária */}
      <HourlyForecast />
    </div>
  );
}
