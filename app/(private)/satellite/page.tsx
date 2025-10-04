import { SatelliteViewer } from "@/components/Satellite/SatelliteViewer/SatelliteViewer"
import { SatelliteMap } from "@/components/Satellite/SatelliteMap/SatelliteMap"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SatellitePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-2 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Visualização de Satélites</h1>
          <p className="text-sm text-muted-foreground">Imagens e dados em tempo real da NASA</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SatelliteViewer />
          </div>
          <SatelliteMap />
        </div>
      </main>
    </div>
  )
}
