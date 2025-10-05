"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Edit } from "lucide-react";
import { MobileOptimizedDialog } from "@/components/Mobile/MobileOptimizedDialog/MobileOptimizedDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlerts } from "@/contexts/AlertContext";

interface UserHealthProfile {
  hasCondition: boolean;
  conditionId?: string;
  riskLevel: "low" | "moderate" | "high";
  sensitivePollutants: string[];
}

const HEALTH_STORAGE_KEY = "user-health-condition";
const NO_CONDITION_VALUE = "none";

const healthOptions = [
  { id: "asthma", label: "Asma" },
  { id: "copd", label: "DPOC" },
  { id: "heart-disease", label: "Doença Cardíaca" },
  { id: "diabetes", label: "Diabetes" },
];

const getLabelForCondition = (id?: string) =>
  healthOptions.find((o) => o.id === id)?.label ?? "";

const mockProfile: UserHealthProfile = {
  hasCondition: true,
  conditionId: "asthma",
  riskLevel: "moderate",
  sensitivePollutants: ["PM2.5", "PM10", "O₃"],
};

const riskColors = {
  low: "bg-chart-5 text-chart-5-foreground",
  moderate: "bg-chart-4 text-chart-4-foreground",
  high: "bg-destructive text-destructive-foreground",
};

const riskLabels = {
  low: "Baixo Risco",
  moderate: "Risco Moderado",
  high: "Alto Risco",
};

export function HealthProfile() {
  const { updateHealthConditions } = useAlerts();

  const [profile, setProfile] = useState<UserHealthProfile>(mockProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>(
    mockProfile.conditionId ?? NO_CONDITION_VALUE
  );

  // Carrega condição salva
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HEALTH_STORAGE_KEY);
      if (saved !== null) {
        const conditionId = saved || NO_CONDITION_VALUE;
        setProfile((prev) => ({
          ...prev,
          hasCondition: conditionId !== NO_CONDITION_VALUE,
          conditionId:
            conditionId === NO_CONDITION_VALUE ? undefined : conditionId,
        }));
        setSelectedCondition(conditionId);
      }
    } catch (e) {
      // noop
    }
  }, []);

  const conditionLabel = useMemo(
    () => getLabelForCondition(profile.conditionId),
    [profile.conditionId]
  );

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSave = async () => {
    try {
      // Persistência local
      if (selectedCondition === NO_CONDITION_VALUE) {
        localStorage.removeItem(HEALTH_STORAGE_KEY);
        setProfile((p) => ({
          ...p,
          hasCondition: false,
          conditionId: undefined,
        }));
        await updateHealthConditions([]);
      } else {
        localStorage.setItem(HEALTH_STORAGE_KEY, selectedCondition);
        setProfile((p) => ({
          ...p,
          hasCondition: true,
          conditionId: selectedCondition,
        }));
        await updateHealthConditions([selectedCondition]);
      }
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Perfil de Saúde</span>
          <span className="sm:hidden">Saúde</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Suas informações de saúde
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {profile.hasCondition ? (
          <>
            <div>
              <p className="text-sm sm:text-sm text-muted-foreground mb-2">
                Condição
              </p>
              <Badge variant="outline" className="text-base sm:text-base">
                {conditionLabel}
              </Badge>
            </div>

            <div>
              <p className="text-sm sm:text-sm text-muted-foreground mb-2">
                Nível de Risco Atual
              </p>
              <Badge
                className={`${
                  riskColors[profile.riskLevel]
                } text-base sm:text-base`}
              >
                {riskLabels[profile.riskLevel]}
              </Badge>
            </div>

            <div>
              <p className="text-sm sm:text-sm text-muted-foreground mb-2">
                Poluentes Sensíveis
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {profile.sensitivePollutants.map((pollutant) => (
                  <Badge
                    key={pollutant}
                    variant="secondary"
                    className="text-sm sm:text-sm"
                  >
                    {pollutant}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-3 sm:mt-4 bg-transparent text-base sm:text-base"
              onClick={handleOpenDialog}
            >
              <Edit className="h-4 w-4 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Editar Perfil</span>
              <span className="sm:hidden">Editar</span>
            </Button>
          </>
        ) : (
          <div className="text-center py-3 sm:py-4">
            <p className="text-sm sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Nenhuma condição de saúde registrada
            </p>
            <Button
              variant="outline"
              className="w-full bg-transparent text-base sm:text-base"
              onClick={handleOpenDialog}
            >
              <Heart className="h-4 w-4 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Adicionar Condição</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialog para selecionar condição de saúde */}
      <MobileOptimizedDialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
        title="Condição de Saúde"
        description="Escolha sua condição para receber alertas personalizados"
      >
        <div className="space-y-3">
          <Select
            value={selectedCondition}
            onValueChange={(v) => setSelectedCondition(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione sua condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_CONDITION_VALUE}>Sem condição</SelectItem>
              {healthOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </MobileOptimizedDialog>
    </Card>
  );
}
