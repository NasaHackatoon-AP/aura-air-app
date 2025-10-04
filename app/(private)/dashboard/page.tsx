"use client";

import { WeatherOverview } from "@/components/Weather/WeatherOverview/WeatherOverview";
import { WeatherForecast } from "@/components/Weather/WeatherForecast/WeatherForecast";
import { HourlyForecast } from "@/components/Weather/HourlyForecast/HourlyForecast";
import { WeatherAlerts } from "@/components/Weather/WeatherAlerts/WeatherAlerts";
import { AirQualityIndex } from "@/components/AirQuality/AirQualityIndex/AirQualityIndex";
import { Pollutants } from "@/components/AirQuality/Pollutants/Pollutants";
import { AirQualityHistory } from "@/components/AirQuality/AirQualityHistory/AirQualityHistory";
import { HealthAlerts } from "@/components/Health/HealthAlerts/HealthAlerts";
import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile";
import { HealthRecommendations } from "@/components/Health/HealthRecommendations/HealthRecommendations";
import { EmergencyTestPanel } from "@/components/Emergency/EmergencyTestPanel/EmergencyTestPanel";
import { EmergencyConfigModal } from "@/components/Emergency/EmergencyConfigModal/EmergencyConfigModal";
import { EmergencyNotificationBar } from "@/components/Emergency/EmergencyNotificationBar/EmergencyNotificationBar";
import { AlertNotification } from "@/components/Alerts/AlertNotification/AlertNotification";
import { MobileOptimizedGrid } from "@/components/Mobile/MobileOptimizedGrid/MobileOptimizedGrid";
import { TouchOptimizedButton } from "@/components/Mobile/TouchOptimizedButton/TouchOptimizedButton";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Satellite, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [isEmergencyConfigOpen, setIsEmergencyConfigOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                AirHealth Monitor
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                São Paulo, Brasil
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Link href="/satellite">
                <TouchOptimizedButton
                  variant="ghost"
                  size="icon"
                  title="Visualização por Satélite"
                  className="h-7 w-7 sm:h-10 sm:w-10"
                >
                  <Satellite className="h-3 w-3 sm:h-5 sm:w-5" />
                </TouchOptimizedButton>
              </Link>
              <TouchOptimizedButton
                variant="ghost"
                size="icon"
                onClick={() => setIsEmergencyConfigOpen(true)}
                title="Configurações de Emergência"
                className="h-7 w-7 sm:h-10 sm:w-10"
              >
                <Shield className="h-3 w-3 sm:h-5 sm:w-5" />
              </TouchOptimizedButton>
              <TouchOptimizedButton
                variant="ghost"
                size="icon"
                title="Configurações"
                className="h-7 w-7 sm:h-10 sm:w-10"
              >
                <Settings className="h-3 w-3 sm:h-5 sm:w-5" />
              </TouchOptimizedButton>
              <TouchOptimizedButton
                variant="ghost"
                size="icon"
                title="Sair"
                className="h-7 w-7 sm:h-10 sm:w-10"
              >
                <LogOut className="h-3 w-3 sm:h-5 sm:w-5" />
              </TouchOptimizedButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <EmergencyNotificationBar radius={100} />

        <AlertNotification />

        <EmergencyTestPanel />

        <HealthAlerts />

        <WeatherAlerts />

        <MobileOptimizedGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <WeatherOverview />
          <HourlyForecast />
        </MobileOptimizedGrid>

        <WeatherForecast />

        <MobileOptimizedGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <AirQualityIndex />
          <HealthProfile />
        </MobileOptimizedGrid>

        <Pollutants />

        <MobileOptimizedGrid cols={{ mobile: 1, tablet: 1, desktop: 3 }}>
          <HealthRecommendations />
        </MobileOptimizedGrid>

        <AirQualityHistory />
      </main>

      {/* Modal de Configurações de Emergência */}
      <EmergencyConfigModal
        isOpen={isEmergencyConfigOpen}
        onClose={() => setIsEmergencyConfigOpen(false)}
      />
    </div>
  );
}
