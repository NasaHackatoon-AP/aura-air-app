"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Edit } from "lucide-react"

interface UserHealthProfile {
  hasCondition: boolean
  condition?: string
  riskLevel: "low" | "moderate" | "high"
  sensitivePollutants: string[]
}

const mockProfile: UserHealthProfile = {
  hasCondition: true,
  condition: "Asma",
  riskLevel: "moderate",
  sensitivePollutants: ["PM2.5", "PM10", "O₃"],
}

const riskColors = {
  low: "bg-chart-5 text-chart-5-foreground",
  moderate: "bg-chart-4 text-chart-4-foreground",
  high: "bg-destructive text-destructive-foreground",
}

const riskLabels = {
  low: "Baixo Risco",
  moderate: "Risco Moderado",
  high: "Alto Risco",
}

export function HealthProfile() {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Perfil de Saúde
        </CardTitle>
        <CardDescription>Suas informações de saúde</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockProfile.hasCondition ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Condição</p>
              <Badge variant="outline" className="text-base">
                {mockProfile.condition}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Nível de Risco Atual</p>
              <Badge className={riskColors[mockProfile.riskLevel]}>{riskLabels[mockProfile.riskLevel]}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Poluentes Sensíveis</p>
              <div className="flex flex-wrap gap-2">
                {mockProfile.sensitivePollutants.map((pollutant) => (
                  <Badge key={pollutant} variant="secondary">
                    {pollutant}
                  </Badge>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">Nenhuma condição de saúde registrada</p>
            <Button variant="outline" className="w-full bg-transparent">
              <Heart className="h-4 w-4 mr-2" />
              Adicionar Condição
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
