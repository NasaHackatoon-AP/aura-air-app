"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, CloudSnow } from "lucide-react"

interface ForecastDay {
  day: string
  high: number
  low: number
  condition: string
  icon: "sun" | "cloud" | "rain" | "snow"
}

const mockForecast: ForecastDay[] = [
  { day: "Seg", high: 26, low: 18, condition: "Ensolarado", icon: "sun" },
  { day: "Ter", high: 24, low: 17, condition: "Nublado", icon: "cloud" },
  { day: "Qua", high: 22, low: 16, condition: "Chuva", icon: "rain" },
  { day: "Qui", high: 23, low: 15, condition: "Parcial", icon: "cloud" },
  { day: "Sex", high: 25, low: 17, condition: "Ensolarado", icon: "sun" },
  { day: "Sáb", high: 27, low: 19, condition: "Ensolarado", icon: "sun" },
  { day: "Dom", high: 26, low: 18, condition: "Nublado", icon: "cloud" },
]

const iconMap = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
}

export function WeatherForecast() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Previsão para 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {mockForecast.map((day, index) => {
            const Icon = iconMap[day.icon]
            return (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="font-semibold mb-2">{day.day}</p>
                <Icon className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground mb-1">{day.condition}</p>
                <div className="flex gap-2 text-sm">
                  <span className="font-semibold">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
