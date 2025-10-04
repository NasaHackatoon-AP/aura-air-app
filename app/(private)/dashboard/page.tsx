import { WeatherOverview } from "@/components/Weather/WeatherOverview/WeatherOverview"
import { WeatherForecast } from "@/components/Weather/WeatherForecast/WeatherForecast"
import { HourlyForecast } from "@/components/Weather/HourlyForecast/HourlyForecast"
import { WeatherAlerts } from "@/components/Weather/WeatherAlerts/WeatherAlerts"
import { AirQualityIndex } from "@/components/AirQuality/AirQualityIndex/AirQualityIndex"
import { Pollutants } from "@/components/AirQuality/Pollutants/Pollutants"
import { AirQualityHistory } from "@/components/AirQuality/AirQualityHistory/AirQualityHistory"
import { HealthAlerts } from "@/components/Health/HealthAlerts/HealthAlerts"
import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile"
import { HealthRecommendations } from "@/components/Health/HealthRecommendations/HealthRecommendations"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Satellite } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AirHealth Monitor</h1>
            <p className="text-sm text-muted-foreground">São Paulo, Brasil</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/satellite">
              <Button variant="ghost" size="icon">
                <Satellite className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <HealthAlerts />

        <WeatherAlerts />

        <div className="grid gap-6 lg:grid-cols-3">
          <WeatherOverview />
          <HourlyForecast />
        </div>

        <WeatherForecast />

        <div className="grid gap-6 lg:grid-cols-3">
          <AirQualityIndex />
          <HealthProfile />
        </div>

        <Pollutants />

        <div className="grid gap-6 lg:grid-cols-3">
          <HealthRecommendations />
        </div>

        <AirQualityHistory />
      </main>
    </div>
  )
}
