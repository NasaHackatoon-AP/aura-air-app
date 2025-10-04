"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Globe,
  Lock,
  Camera,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TouchOptimizedButton } from "@/components/Mobile/TouchOptimizedButton/TouchOptimizedButton";
import { ThemeToggle } from "@/components/Theme/ThemeToggle/ThemeToggle";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useUserProfile } from "@/hooks/useUserProfile";
import { emergencyService } from "@/services/emergencyService";
import { toast } from "sonner";

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings, isLoading } =
    useUserSettings();
  const { profile } = useUserProfile();
  const [updateInterval, setUpdateInterval] = useState([
    settings.updateInterval,
  ]);
  const [notificationRadius, setNotificationRadius] = useState([
    settings.notificationRadius,
  ]);

  const handleResetSettings = () => {
    resetSettings();
    setUpdateInterval([15]);
    setNotificationRadius([100]);
    toast.success("Configurações restauradas para o padrão!");
  };

  const handleChangePassword = () => {
    toast.info("Funcionalidade de alterar senha será implementada em breve!");
  };

  const handleChangePhoto = () => {
    toast.info("Funcionalidade de alterar foto será implementada em breve!");
  };

  const handleTestNotification = () => {
    emergencyService.createSystemAlert(
      "🧪 TESTE DE NOTIFICAÇÃO",
      "Este é um teste do sistema de notificações de emergência.",
      "medium"
    );
    toast.success("Notificação de teste enviada!");
  };

  const getRadiusLabel = (radius: number) => {
    if (radius <= 25) return "Local";
    if (radius <= 50) return "Regional";
    if (radius <= 75) return "Ampla";
    return "Muito Ampla";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Link href="/dashboard">
                <TouchOptimizedButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </TouchOptimizedButton>
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold truncate">Configurações</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Gerencie suas preferências e configurações
                </p>
              </div>
            </div>
            <ThemeToggle size="icon" className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 sm:pb-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Informações básicas e preferências pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 overflow-hidden max-h-none">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full"
                  onClick={handleChangePhoto}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-medium text-sm sm:text-base truncate">{profile.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {profile.location}
                </p>
                <Button variant="outline" size="sm" className="mt-2 h-8 text-xs sm:text-sm">
                  <Upload className="h-3 w-3 mr-1" />
                  Alterar Foto
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Nome</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.name}</p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs sm:text-sm">
                Editar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Localização</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {profile.location}
                </p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs sm:text-sm">
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
              Segurança
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Email</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.email}</p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs sm:text-sm">
                Editar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Alterar Senha</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Atualize sua senha de acesso
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangePassword}
                className="flex-shrink-0 h-8 text-xs sm:text-sm"
              >
                Alterar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              Notificações
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Notificações Gerais</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receber alertas sobre qualidade do ar e clima
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", checked)
                }
                className="flex-shrink-0"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Alertas de Emergência</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Notificações sobre desastres naturais e riscos
                </p>
              </div>
              <Switch
                checked={settings.emergencyAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("emergencyAlerts", checked)
                }
                className="flex-shrink-0"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Notificações Push</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receber notificações mesmo com o app fechado
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("pushNotifications", checked)
                }
                className="flex-shrink-0"
              />
            </div>
            <Separator />
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm sm:text-base">Intervalo de Atualização</p>
                <Badge variant="secondary" className="text-xs">{updateInterval[0]} min</Badge>
              </div>
              <Slider
                value={updateInterval}
                onValueChange={(value) => {
                  setUpdateInterval(value);
                  updateSetting("updateInterval", value[0]);
                }}
                max={60}
                min={5}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Frequência com que os dados são atualizados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Configurações de Emergência
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configure alertas de emergência e monitoramento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Monitoramento Ativo</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sistema de monitoramento de emergências
                </p>
              </div>
              <Switch
                checked={settings.isMonitoringEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("isMonitoringEnabled", checked)
                }
                className="flex-shrink-0"
              />
            </div>
            <Separator />
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-medium text-sm sm:text-base">Raio de Monitoramento</p>
                <Badge variant="secondary" className="text-xs">
                  {notificationRadius[0]} km - {getRadiusLabel(notificationRadius[0])}
                </Badge>
              </div>
              <Slider
                value={notificationRadius}
                onValueChange={(value) => {
                  setNotificationRadius(value);
                  updateSetting("notificationRadius", value[0]);
                }}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Distância para receber alertas de emergência
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Notificações Push de Emergência</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receber notificações push para emergências
                </p>
              </div>
              <Switch
                checked={settings.pushNotificationsEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("pushNotificationsEnabled", checked)
                }
                className="flex-shrink-0"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Alertas Críticos</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receber notificações para emergências críticas
                </p>
              </div>
              <Switch
                checked={settings.criticalAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("criticalAlerts", checked)
                }
                className="flex-shrink-0"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Testar Notificações</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enviar uma notificação de teste
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                className="flex-shrink-0 h-8 text-xs sm:text-sm"
              >
                Testar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              Configurações do App
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Preferências de interface e comportamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Idioma</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Português (Brasil)
                </p>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs sm:text-sm">
                Alterar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">Versão do App</p>
                <p className="text-xs sm:text-sm text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="w-full sm:w-auto h-10 sm:h-9"
          >
            Restaurar Padrões
          </Button>
        </div>
      </main>
    </div>
  );
}
