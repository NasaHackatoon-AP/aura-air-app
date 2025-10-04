"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Satellite } from "lucide-react"

interface SatellitePosition {
  name: string
  latitude: number
  longitude: number
  altitude: number
  status: "active" | "inactive"
}

const mockPositions: SatellitePosition[] = [
  { name: "GOES-16", latitude: -23.55, longitude: -46.63, altitude: 35786, status: "active" },
  { name: "Terra", latitude: -15.79, longitude: -47.89, altitude: 705, status: "active" },
  { name: "Aqua", latitude: -10.33, longitude: -48.33, altitude: 705, status: "active" },
]

export function SatelliteMap() {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Posição dos Satélites
        </CardTitle>
        <CardDescription>Localização em tempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-muted rounded-lg mb-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Mapa de rastreamento</p>
              <p className="text-xs text-muted-foreground">Será implementado com API da NASA</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {mockPositions.map((sat) => (
            <div key={sat.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Satellite className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{sat.name}</p>
                  <Badge variant={sat.status === "active" ? "default" : "secondary"} className="text-xs">
                    {sat.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Alt: {sat.altitude.toLocaleString()} km</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
