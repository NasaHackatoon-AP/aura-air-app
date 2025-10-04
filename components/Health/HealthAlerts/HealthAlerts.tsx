"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface HealthAlert {
  id: string
  severity: "critical" | "warning" | "info" | "safe"
  condition: string
  title: string
  description: string
  recommendations: string[]
}

const mockHealthAlerts: HealthAlert[] = [
  {
    id: "1",
    severity: "warning",
    condition: "Asma",
    title: "Qualidade do Ar Moderada",
    description: "Os níveis de PM2.5 estão moderados. Pessoas com asma podem sentir desconforto respiratório leve.",
    recommendations: [
      "Evite exercícios intensos ao ar livre",
      "Mantenha medicação de resgate por perto",
      "Considere usar máscara ao sair",
    ],
  },
  {
    id: "2",
    severity: "info",
    condition: "Geral",
    title: "Índice UV Alto",
    description: "O índice UV está alto hoje. Proteção solar é recomendada.",
    recommendations: ["Use protetor solar FPS 30+", "Evite exposição entre 10h-16h", "Use óculos de sol e chapéu"],
  },
]

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
  },
  safe: {
    icon: CheckCircle,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5",
  },
}

export function HealthAlerts() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-destructive" />
          Alertas de Saúde Personalizados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockHealthAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-chart-5" />
            <p>Nenhum alerta de saúde no momento</p>
            <p className="text-sm mt-1">As condições estão favoráveis para sua saúde</p>
          </div>
        ) : (
          mockHealthAlerts.map((alert) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon
            return (
              <div key={alert.id} className={`p-4 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {alert.condition}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recomendações:</p>
                      <ul className="space-y-1">
                        {alert.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
