"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X, AlertTriangle } from "lucide-react"

interface Recommendation {
  id: string
  activity: string
  status: "safe" | "caution" | "avoid"
  description: string
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    activity: "Caminhada Leve",
    status: "safe",
    description: "Seguro para atividades leves ao ar livre",
  },
  {
    id: "2",
    activity: "Exercício Intenso",
    status: "caution",
    description: "Evite exercícios intensos, especialmente ao ar livre",
  },
  {
    id: "3",
    activity: "Janelas Abertas",
    status: "safe",
    description: "Seguro manter janelas abertas para ventilação",
  },
  {
    id: "4",
    activity: "Atividades ao Ar Livre",
    status: "caution",
    description: "Limite o tempo ao ar livre durante o pico de poluição",
  },
]

const statusConfig = {
  safe: {
    icon: CheckCircle,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  caution: {
    icon: AlertTriangle,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  avoid: {
    icon: X,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
}

export function HealthRecommendations() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Recomendações de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {mockRecommendations.map((rec) => {
            const config = statusConfig[rec.status]
            const Icon = config.icon
            return (
              <div key={rec.id} className={`p-4 rounded-lg ${config.bgColor}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                  <div>
                    <p className="font-semibold mb-1">{rec.activity}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
