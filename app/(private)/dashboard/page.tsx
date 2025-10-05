"use client";

import { WeatherOverview } from "@/components/Weather/WeatherOverview/WeatherOverview";
import { WeatherForecast } from "@/components/Weather/WeatherForecast/WeatherForecast";
import { HourlyForecast } from "@/components/Weather/HourlyForecast/HourlyForecast";
import { WeatherAlerts } from "@/components/Weather/WeatherAlerts/WeatherAlerts";
import { AirQualityIndex } from "@/components/AirQuality/AirQualityIndex/AirQualityIndex";
import { Pollutants } from "@/components/AirQuality/Pollutants/Pollutants";
import { AirQualityHistory } from "@/components/AirQuality/AirQualityHistory/AirQualityHistory";
import { PersonalizedHealthCard } from "@/components/Health/PersonalizedHealthCard/PersonalizedHealthCard";
// import { EmergencyTestPanel } from "@/components/Emergency/EmergencyTestPanel/EmergencyTestPanel";
import { EmergencyNotificationBar } from "@/components/Emergency/EmergencyNotificationBar/EmergencyNotificationBar";
import { AlertNotification } from "@/components/Alerts/AlertNotification/AlertNotification";
import { MobileOptimizedGrid } from "@/components/Mobile/MobileOptimizedGrid/MobileOptimizedGrid";
import { TouchOptimizedButton } from "@/components/Mobile/TouchOptimizedButton/TouchOptimizedButton";
import { ThemeToggle } from "@/components/Theme/ThemeToggle/ThemeToggle";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Settings,
  LogOut,
  Satellite,
  User,
  Wind,
  Home,
  Bell,
} from "lucide-react";
import logo from "../../../public/airaurealogo.png";
import Image from "next/image";

export default function DashboardPage() {
  const { profile } = useUserProfile();

  const handleLogout = () => {
    try {
      // Clear mock auth and user data
      localStorage.removeItem("user");
      localStorage.removeItem("user-profile");
      // Optionally clear other app caches if needed in the future
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      // Redirect to login
      window.location.href = "/login";
    }
  };

  const dockItems = [
    {
      title: "Início",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard",
    },
    {
      title: "Qualidade do Ar",
      icon: (
        <Wind className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard#air-quality",
    },
    {
      title: "Satélite",
      icon: (
        <Satellite className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/satellite",
    },
    {
      title: "Alertas",
      icon: (
        <Bell className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard#alerts",
    },
    {
      title: "Configurações",
      icon: (
        <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/settings",
    },
    {
      title: "Sair",
      icon: (
        <LogOut className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b bg-card relative overflow-visible">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Image src={logo} alt="Air Aura Logo" className="h-15 w-15" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {profile.location}
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 relative z-50">
              {/* Theme Toggle */}
              <ThemeToggle size="icon" className="h-7 w-7 sm:h-10 sm:w-10" />

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-lg ring-2 ring-white/20 dark:ring-black/20">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white font-semibold" />
                </div>
                <span className="hidden sm:inline text-sm font-medium truncate max-w-20">
                  {profile.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <EmergencyNotificationBar radius={100} />
        <AlertNotification />

        {/* <EmergencyTestPanel /> */}

        {/* 1) Condições atuais + 2) Previsão horária */}
        <MobileOptimizedGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <WeatherOverview />
          <HourlyForecast />
        </MobileOptimizedGrid>

        {/* 3) Card Unificado de Saúde */}
        <PersonalizedHealthCard userId={1} />

        {/* 5) Previsão para 7 Dias */}
        <WeatherForecast />

        {/* 6) Alertas Meteorológicos */}
        <WeatherAlerts />

        {/* 7) Índice de Qualidade do Ar */}
        <AirQualityIndex />

        {/* 8) Poluentes Atmosféricos */}
        <Pollutants />

        {/* 9) Histórico de Qualidade do Ar */}
        <AirQualityHistory />
      </main>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center pb-4 sm:pb-8 pointer-events-none z-50">
        <div className="pointer-events-auto">
          <FloatingDock items={dockItems} />
        </div>
      </div>
    </div>
  );
}
