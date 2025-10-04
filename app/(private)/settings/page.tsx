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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <TouchOptimizedButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </TouchOptimizedButton>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Configurações</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas preferências e configurações
                </p>
              </div>
            </div>
            <ThemeToggle size="icon" className="h-8 w-8" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Informações básicas e preferências pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 overflow-hidden max-h-none">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
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
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {profile.location}
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="h-3 w-3 mr-1" />
                  Alterar Foto
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nome</p>
                <p className="text-sm text-muted-foreground">{profile.name}</p>
              </div>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Localização</p>
                <p className="text-sm text-muted-foreground">
                  {profile.location}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha de acesso
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangePassword}
              >
                Alterar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações Gerais</p>
                <p className="text-sm text-muted-foreground">
                  Receber alertas sobre qualidade do ar e clima
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de Emergência</p>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre desastres naturais e riscos
                </p>
              </div>
              <Switch
                checked={settings.emergencyAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("emergencyAlerts", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações Push</p>
                <p className="text-sm text-muted-foreground">
                  Receber notificações mesmo com o app fechado
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("pushNotifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Intervalo de Atualização</p>
                <Badge variant="secondary">{updateInterval[0]} min</Badge>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configurações de Emergência
            </CardTitle>
            <CardDescription>
              Configure alertas de emergência e monitoramento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monitoramento Ativo</p>
                <p className="text-sm text-muted-foreground">
                  Sistema de monitoramento de emergências
                </p>
              </div>
              <Switch
                checked={settings.isMonitoringEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("isMonitoringEnabled", checked)
                }
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Raio de Monitoramento</p>
                <Badge variant="secondary">
                  {notificationRadius[0]} km -{" "}
                  {getRadiusLabel(notificationRadius[0])}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações Push de Emergência</p>
                <p className="text-sm text-muted-foreground">
                  Receber notificações push para emergências
                </p>
              </div>
              <Switch
                checked={settings.pushNotificationsEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("pushNotificationsEnabled", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas Críticos</p>
                <p className="text-sm text-muted-foreground">
                  Receber notificações para emergências críticas
                </p>
              </div>
              <Switch
                checked={settings.criticalAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("criticalAlerts", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Testar Notificações</p>
                <p className="text-sm text-muted-foreground">
                  Enviar uma notificação de teste
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
              >
                Testar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações do App
            </CardTitle>
            <CardDescription>
              Preferências de interface e comportamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Idioma</p>
                <p className="text-sm text-muted-foreground">
                  Português (Brasil)
                </p>
              </div>
              <Button variant="outline" size="sm">
                Alterar
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Versão do App</p>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleResetSettings}>
            Restaurar Padrões
          </Button>
        </div>
      </main>
    </div>
  );
}
