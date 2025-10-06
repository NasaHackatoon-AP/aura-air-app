"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Search, Loader2, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ibgeService, IBGECityAppFormat } from "@/services/ibgeService";

interface BrazilCitySelectorProps {
  currentCity: string;
  currentState: string;
  onLocationChange: (
    city: string,
    state: string,
    stateName: string,
    region: string,
    lat: number,
    lon: number
  ) => void;
}

export function BrazilCitySelector({
  currentCity,
  currentState,
  onLocationChange,
}: BrazilCitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<IBGECityAppFormat[]>([]);
  const [selectedCity, setSelectedCity] = useState<IBGECityAppFormat | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await ibgeService.searchCities(searchTerm, 20);
      setCities(result.cities);
      console.log(
        `🔍 IBGE: Busca por "${searchTerm}": ${result.cities.length} cidades encontradas`
      );
    } catch (error) {
      console.error("Erro na busca de cidades IBGE:", error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: IBGECityAppFormat) => {
    setSelectedCity(city);
  };

  const handleApplyLocation = () => {
    if (selectedCity) {
      onLocationChange(
        selectedCity.name,
        selectedCity.state,
        selectedCity.stateName,
        selectedCity.region,
        selectedCity.lat,
        selectedCity.lon
      );

      setIsOpen(false);
      setSearchTerm("");
      setCities([]);
      setSelectedCity(null);
      setHasSearched(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getRegionFlag = (region: string) => {
    const regionFlags: { [key: string]: string } = {
      Norte: "🌳",
      Nordeste: "☀️",
      "Centro-Oeste": "🌾",
      Sudeste: "🏙️",
      Sul: "🌲",
    };
    return regionFlags[region] || "🇧🇷";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-50"
          title="Alterar cidade brasileira"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Alterar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Selecionar Cidade Brasileira
          </DialogTitle>
          <DialogDescription>
            Busque por qualquer cidade do Brasil usando dados oficiais do IBGE
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Busca de cidades */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar cidade brasileira</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite o nome da cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchTerm.trim() || isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Lista de cidades encontradas */}
          {hasSearched && (
            <div className="space-y-2">
              <Label>Cidades encontradas</Label>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Buscando cidades...</span>
                  </div>
                ) : cities.length > 0 ? (
                  cities.map((city, index) => (
                    <div
                      key={`${city.id}-${index}`}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCity?.id === city.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {getRegionFlag(city.region)}
                          </span>
                          <div>
                            <div className="font-medium">{city.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {city.stateName} - {city.region}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {city.state}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma cidade encontrada
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cidade selecionada */}
          {selectedCity && (
            <div className="p-3 bg-primary/5 border border-primary rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {getRegionFlag(selectedCity.region)}
                </span>
                <div>
                  <div className="font-medium">{selectedCity.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCity.stateName} - {selectedCity.region}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyLocation} disabled={!selectedCity}>
              Aplicar Localização
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
