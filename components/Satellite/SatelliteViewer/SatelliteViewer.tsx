"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Satellite, Play, Pause, RotateCcw, Maximize2 } from "lucide-react"
import { useState } from "react"

interface SatelliteData {
  name: string
  type: string
  lastUpdate: string
  coverage: string
}

const mockSatellites: SatelliteData[] = [
  { name: "GOES-16", type: "Meteorológico", lastUpdate: "Há 15 min", coverage: "América do Sul" },
  { name: "Terra", type: "NASA EOS", lastUpdate: "Há 30 min", coverage: "Global" },
  { name: "Aqua", type: "NASA EOS", lastUpdate: "Há 45 min", coverage: "Global" },
]

export function SatelliteViewer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSatellite, setSelectedSatellite] = useState(0)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="h-5 w-5" />
          Visualização de Satélites NASA
        </CardTitle>
        <CardDescription>Imagens em tempo real de satélites meteorológicos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {mockSatellites.map((sat, index) => (
            <Button
              key={sat.name}
              variant={selectedSatellite === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSatellite(index)}
              className="bg-transparent"
            >
              {sat.name}
            </Button>
          ))}
        </div>

        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Satellite className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold mb-2">{mockSatellites[selectedSatellite].name}</p>
                <Badge variant="secondary" className="mb-2">
                  {mockSatellites[selectedSatellite].type}
                </Badge>
                <p className="text-sm text-muted-foreground">Cobertura: {mockSatellites[selectedSatellite].coverage}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Última atualização: {mockSatellites[selectedSatellite].lastUpdate}
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                A visualização AR com dados reais da NASA será implementada quando o backend estiver integrado com a API
                da NASA.
              </p>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setIsPlaying(!isPlaying)} className="bg-transparent">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="outline" className="bg-transparent">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Satélites Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">15 min</p>
            <p className="text-sm text-muted-foreground">Intervalo de Atualização</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">4K</p>
            <p className="text-sm text-muted-foreground">Resolução</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
