"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wind } from "lucide-react"
import { cn } from "@/lib/utils"

interface AQIData {
  value: number
  category: string
  color: string
  description: string
}

const mockAQIData: AQIData = {
  value: 45,
  category: "Bom",
  color: "text-chart-5",
  description: "A qualidade do ar é considerada satisfatória e a poluição do ar representa pouco ou nenhum risco.",
}

function getAQIColor(value: number): string {
  if (value <= 50) return "bg-chart-5"
  if (value <= 100) return "bg-chart-4"
  if (value <= 150) return "bg-chart-3"
  if (value <= 200) return "bg-chart-2"
  if (value <= 300) return "bg-destructive"
  return "bg-destructive"
}

export function AirQualityIndex() {
  const data = mockAQIData
  const progressColor = getAQIColor(data.value)

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Índice de Qualidade do Ar (IQA)
        </CardTitle>
        <CardDescription>Medição em tempo real da qualidade do ar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="text-6xl font-bold">{data.value}</div>
          <div className="pb-2">
            <p className={cn("text-2xl font-semibold", data.color)}>{data.category}</p>
            <p className="text-sm text-muted-foreground">de 500</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={(data.value / 500) * 100} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
            <span>300</span>
            <span>500</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{data.description}</p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Atualizado</p>
            <p className="font-semibold">Há 5 minutos</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Próxima atualização</p>
            <p className="font-semibold">Em 25 minutos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
