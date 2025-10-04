"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Pollutant {
  name: string
  symbol: string
  value: number
  unit: string
  max: number
  status: "good" | "moderate" | "poor"
}

const mockPollutants: Pollutant[] = [
  { name: "Material Particulado 2.5", symbol: "PM2.5", value: 12, unit: "μg/m³", max: 35, status: "good" },
  { name: "Material Particulado 10", symbol: "PM10", value: 28, unit: "μg/m³", max: 150, status: "good" },
  { name: "Ozônio", symbol: "O₃", value: 45, unit: "ppb", max: 100, status: "good" },
  { name: "Dióxido de Nitrogênio", symbol: "NO₂", value: 18, unit: "ppb", max: 100, status: "good" },
  { name: "Dióxido de Enxofre", symbol: "SO₂", value: 5, unit: "ppb", max: 75, status: "good" },
  { name: "Monóxido de Carbono", symbol: "CO", value: 0.4, unit: "ppm", max: 9, status: "good" },
]

const statusColors = {
  good: "bg-chart-5",
  moderate: "bg-chart-4",
  poor: "bg-destructive",
}

export function Pollutants() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Poluentes Atmosféricos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPollutants.map((pollutant) => (
            <div key={pollutant.symbol} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{pollutant.symbol}</p>
                  <p className="text-xs text-muted-foreground">{pollutant.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {pollutant.value}{" "}
                    <span className="text-sm font-normal text-muted-foreground">{pollutant.unit}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={(pollutant.value / pollutant.max) * 100} className={statusColors[pollutant.status]} />
                <p className="text-xs text-muted-foreground">
                  Limite: {pollutant.max} {pollutant.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
