"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun } from "lucide-react"

interface HourlyData {
  time: string
  temperature: number
  condition: string
  icon: "sun" | "cloud" | "rain"
  precipitation: number
}

const mockHourlyData: HourlyData[] = [
  { time: "Agora", temperature: 24, condition: "Nublado", icon: "cloud", precipitation: 0 },
  { time: "14:00", temperature: 25, condition: "Nublado", icon: "cloud", precipitation: 10 },
  { time: "15:00", temperature: 26, condition: "Sol", icon: "sun", precipitation: 0 },
  { time: "16:00", temperature: 25, condition: "Sol", icon: "sun", precipitation: 0 },
  { time: "17:00", temperature: 24, condition: "Nublado", icon: "cloud", precipitation: 20 },
  { time: "18:00", temperature: 23, condition: "Chuva", icon: "rain", precipitation: 60 },
  { time: "19:00", temperature: 22, condition: "Chuva", icon: "rain", precipitation: 80 },
  { time: "20:00", temperature: 21, condition: "Nublado", icon: "cloud", precipitation: 30 },
]

const iconMap = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
}

export function HourlyForecast() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Previsão Horária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {mockHourlyData.map((hour, index) => {
            const Icon = iconMap[hour.icon]
            return (
              <div key={index} className="flex flex-col items-center min-w-[80px] p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">{hour.time}</p>
                <Icon className="h-6 w-6 text-primary mb-2" />
                <p className="text-lg font-semibold mb-1">{hour.temperature}°</p>
                {hour.precipitation > 0 && <p className="text-xs text-secondary">{hour.precipitation}%</p>}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
