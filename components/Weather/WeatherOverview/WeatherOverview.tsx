"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, Wind, Droplets, Eye, Gauge } from "lucide-react"

interface WeatherData {
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  uvIndex: number
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
}

export function WeatherOverview() {
  const data = mockWeatherData

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Condições Atuais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-5xl font-bold">{data.temperature}°C</div>
            <p className="text-muted-foreground mt-1">Sensação térmica: {data.feelsLike}°C</p>
            <p className="text-lg mt-2">{data.condition}</p>
          </div>
          <Sun className="h-16 w-16 text-primary" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Umidade</p>
              <p className="font-semibold">{data.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Wind className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Vento</p>
              <p className="font-semibold">{data.windSpeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Visibilidade</p>
              <p className="font-semibold">{data.visibility} km</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Pressão</p>
              <p className="font-semibold">{data.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Índice UV</p>
              <p className="font-semibold">{data.uvIndex} (Alto)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
