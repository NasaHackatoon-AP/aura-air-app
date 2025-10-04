"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info, AlertCircle } from "lucide-react"

interface WeatherAlert {
  id: string
  severity: "warning" | "info" | "danger"
  title: string
  description: string
  time: string
}

const mockAlerts: WeatherAlert[] = [
  {
    id: "1",
    severity: "warning",
    title: "Alerta de Chuva Forte",
    description: "Possibilidade de chuva forte entre 18h e 21h. Recomenda-se evitar áreas de alagamento.",
    time: "Hoje, 18:00 - 21:00",
  },
  {
    id: "2",
    severity: "info",
    title: "Índice UV Alto",
    description: "O índice UV está alto. Use protetor solar e evite exposição prolongada ao sol.",
    time: "Hoje, 12:00 - 16:00",
  },
]

const severityConfig = {
  danger: {
    icon: AlertCircle,
    variant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    variant: "default" as const,
  },
  info: {
    icon: Info,
    variant: "default" as const,
  },
}

export function WeatherAlerts() {
  if (mockAlerts.length === 0) {
    return null
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Alertas Meteorológicos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockAlerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon
          return (
            <Alert key={alert.id} variant={config.variant}>
              <Icon className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>
                {alert.description}
                <p className="text-xs mt-2 opacity-70">{alert.time}</p>
              </AlertDescription>
            </Alert>
          )
        })}
      </CardContent>
    </Card>
  )
}
