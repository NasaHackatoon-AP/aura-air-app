"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  Bell,
  MapPin,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { emergencyService } from "@/services/emergencyService";
import { useEmergencyConfig } from "@/hooks/useEmergencyConfig";

interface EmergencyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyConfigModal({
  isOpen,
  onClose,
}: EmergencyConfigModalProps) {
  const { config, isLoading, updateConfig, testNotification } =
    useEmergencyConfig();
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(
    config.isMonitoringEnabled
  );
  const [notificationRadius, setNotificationRadius] = useState([
    config.notificationRadius,
  ]);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(
    config.pushNotificationsEnabled
  );
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(
    config.criticalAlertsEnabled
  );

  useEffect(() => {
    setIsMonitoringEnabled(config.isMonitoringEnabled);
    setNotificationRadius([config.notificationRadius]);
    setPushNotificationsEnabled(config.pushNotificationsEnabled);
    setCriticalAlertsEnabled(config.criticalAlertsEnabled);
  }, [config]);

  const handleSaveConfig = async () => {
    try {
      await updateConfig({
        isMonitoringEnabled,
        notificationRadius: notificationRadius[0],
        pushNotificationsEnabled,
        criticalAlertsEnabled,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const handleTestNotification = () => {
    testNotification();
  };

  const getRadiusColor = (radius: number) => {
    if (radius <= 25) return "text-green-600";
    if (radius <= 50) return "text-yellow-600";
    if (radius <= 75) return "text-orange-600";
    return "text-red-600";
  };

  const getRadiusLabel = (radius: number) => {
    if (radius <= 25) return "Muito Local";
    if (radius <= 50) return "Regional";
    if (radius <= 75) return "Ampla";
    return "Muito Ampla";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Emergência
          </DialogTitle>
          <DialogDescription>
            Configure como você deseja receber alertas de emergência e desastres
            naturais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status do Sistema */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="font-medium">Monitoramento Ativo</span>
                </div>
                <Badge variant={isMonitoringEnabled ? "default" : "secondary"}>
                  {isMonitoringEnabled ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Ativo
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Inativo
                    </div>
                  )}
                </Badge>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  O monitoramento automático detecta desastres naturais e
                  alertas de emergência em tempo real.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Configurações Principais */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Configurações Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Monitoramento */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">
                      Monitoramento Automático
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recebe alertas de emergência automaticamente
                  </p>
                </div>
                <Switch
                  checked={isMonitoringEnabled}
                  onCheckedChange={setIsMonitoringEnabled}
                />
              </div>

              <Separator />

              {/* Notificações Push */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Notificações Push</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recebe notificações mesmo com o app fechado
                  </p>
                </div>
                <Switch
                  checked={pushNotificationsEnabled}
                  onCheckedChange={setPushNotificationsEnabled}
                />
              </div>

              <Separator />

              {/* Alertas Críticos */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Alertas Críticos</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Abre automaticamente o modal para alertas críticos
                  </p>
                </div>
                <Switch
                  checked={criticalAlertsEnabled}
                  onCheckedChange={setCriticalAlertsEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Raio de Notificação */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Raio de Notificação
              </CardTitle>
              <CardDescription>
                Defina a distância máxima para receber alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {notificationRadius[0]} km
                  </span>
                  <Badge
                    variant="outline"
                    className={getRadiusColor(notificationRadius[0])}
                  >
                    {getRadiusLabel(notificationRadius[0])}
                  </Badge>
                </div>

                <Slider
                  value={notificationRadius}
                  onValueChange={setNotificationRadius}
                  max={100}
                  min={5}
                  step={5}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 km</span>
                  <span>100 km</span>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Alertas dentro deste raio aparecerão como notificações na
                  tela.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Teste de Notificação */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Teste do Sistema</CardTitle>
              <CardDescription>
                Teste se as notificações estão funcionando corretamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleTestNotification}
                variant="outline"
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Enviar Notificação de Teste
              </Button>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
