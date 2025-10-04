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
import { EmergencyNotificationBar } from "@/components/Emergency/EmergencyNotificationBar/EmergencyNotificationBar";
import { AlertNotification } from "@/components/Alerts/AlertNotification/AlertNotification";
import { MobileOptimizedGrid } from "@/components/Mobile/MobileOptimizedGrid/MobileOptimizedGrid";
import { TouchOptimizedButton } from "@/components/Mobile/TouchOptimizedButton/TouchOptimizedButton";
import { ThemeToggle } from "@/components/Theme/ThemeToggle/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  Satellite,
  User,
  ChevronDown,
  Wind,
} from "lucide-react";
import Link from "next/link";
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

              {/* Theme Toggle */}
              <ThemeToggle size="icon" className="h-7 w-7 sm:h-10 sm:w-10" />

              {/* User Profile Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <TouchOptimizedButton
                    variant="ghost"
                    className="h-8 w-8 sm:h-10 sm:w-auto sm:px-3 gap-2 hover:bg-muted/50 transition-all duration-200"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-lg ring-2 ring-white/20 dark:ring-black/20">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-white font-semibold" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium truncate max-w-20">
                      {profile.name}
                    </span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 hidden sm:inline opacity-70" />
                  </TouchOptimizedButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  side="bottom"
                  sideOffset={12}
                  alignOffset={-10}
                  avoidCollisions={true}
                  collisionPadding={16}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
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
    </div>
  );
}
