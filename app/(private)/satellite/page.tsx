import { SatelliteViewer } from "@/components/Satellite/SatelliteViewer/SatelliteViewer";
import { SatelliteMap } from "@/components/Satellite/SatelliteMap/SatelliteMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SatellitePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 bg-transparent text-sm sm:text-base"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Voltar ao Dashboard</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Visualização de Satélites
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Imagens e dados em tempo real da NASA
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SatelliteViewer />
          </div>
          <SatelliteMap />
        </div>
      </main>
    </div>
  );
}
