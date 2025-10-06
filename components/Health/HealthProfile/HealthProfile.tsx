"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Edit, AlertCircle, Loader2 } from "lucide-react";
import { MobileOptimizedDialog } from "@/components/Mobile/MobileOptimizedDialog/MobileOptimizedDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileRequest } from "@/types/healthProfile";
import { useModal } from "@/contexts/ModalContext";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function HealthProfile() {
  const {
    profile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    hasProfile,
  } = useHealthProfile({ userId: MOCK_USER_ID });

  const { openModal, closeModal } = useModal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    possui_asma: false,
    possui_dpoc: false,
    possui_alergias: false,
    fumante: false,
    sensibilidade_alta: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega dados do perfil quando o componente monta
  useEffect(() => {
    if (profile) {
      setFormData({
        possui_asma: profile.possui_asma,
        possui_dpoc: profile.possui_dpoc,
        possui_alergias: profile.possui_alergias,
        fumante: profile.fumante,
        sensibilidade_alta: profile.sensibilidade_alta,
      });
    }
  }, [profile]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    openModal("health-profile");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    closeModal("health-profile");
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const profileData: HealthProfileRequest = {
        usuario_id: MOCK_USER_ID,
        ...formData,
      };

      if (hasProfile) {
        await updateProfile(profileData);
      } else {
        await createProfile(profileData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof typeof formData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Perfil de Saúde</span>
            <span className="sm:hidden">Saúde</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasProfile && profile ? (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Condições de Saúde:
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.possui_asma && <Badge variant="outline">Asma</Badge>}
                {profile.possui_dpoc && <Badge variant="outline">DPOC</Badge>}
                {profile.possui_alergias && (
                  <Badge variant="outline">Alergias</Badge>
                )}
                {profile.fumante && (
                  <Badge variant="destructive">Fumante</Badge>
                )}
                {profile.sensibilidade_alta && (
                  <Badge variant="secondary">Alta Sensibilidade</Badge>
                )}
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
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Nenhum perfil de saúde registrado
            </p>
            <Button
              variant="outline"
              className="w-full bg-transparent text-base sm:text-base"
              onClick={handleOpenDialog}
            >
              <Heart className="h-4 w-4 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Criar Perfil</span>
              <span className="sm:hidden">Criar</span>
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialog para configurar perfil de saúde */}
      <MobileOptimizedDialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
        title="Perfil de Saúde"
        description="Configure suas condições de saúde para receber alertas personalizados"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="asma">Possui Asma</Label>
              <Switch
                id="asma"
                checked={formData.possui_asma}
                onCheckedChange={(checked) =>
                  handleFormChange("possui_asma", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dpoc">Possui DPOC</Label>
              <Switch
                id="dpoc"
                checked={formData.possui_dpoc}
                onCheckedChange={(checked) =>
                  handleFormChange("possui_dpoc", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="alergias">Possui Alergias</Label>
              <Switch
                id="alergias"
                checked={formData.possui_alergias}
                onCheckedChange={(checked) =>
                  handleFormChange("possui_alergias", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="fumante">É Fumante</Label>
              <Switch
                id="fumante"
                checked={formData.fumante}
                onCheckedChange={(checked) =>
                  handleFormChange("fumante", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sensibilidade">Alta Sensibilidade</Label>
              <Switch
                id="sensibilidade"
                checked={formData.sensibilidade_alta}
                onCheckedChange={(checked) =>
                  handleFormChange("sensibilidade_alta", checked)
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : hasProfile ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </div>
      </MobileOptimizedDialog>
    </Card>
  );
}
