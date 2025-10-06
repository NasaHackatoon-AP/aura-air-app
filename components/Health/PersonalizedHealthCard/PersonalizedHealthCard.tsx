"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Settings,
  Heart,
  User,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { usePersonalizedHealthAlerts } from "@/hooks/usePersonalizedHealthAlerts";
import { HealthProfile } from "@/components/Health/HealthProfile/HealthProfile";

interface PersonalizedHealthCardProps {
  userId: number;
  onEditProfile?: () => void;
}

export function PersonalizedHealthCard({
  userId,
  onEditProfile,
}: PersonalizedHealthCardProps) {
  const [showProfile, setShowProfile] = useState(false);

  const { data, isLoading, error, fetchAlerts, hasData, getTimeSinceUpdate } =
    usePersonalizedHealthAlerts({
      userId,
      autoFetch: true,
      refreshInterval: 300000, // 5 minutos
    });

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      setShowProfile(!showProfile);
    }
  };

  const handleRefresh = () => {
    fetchAlerts();
  };

  if (showProfile) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Perfil de Saúde
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfile(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </Button>
        </CardHeader>
        <CardContent>
          <HealthProfile userId={userId} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Alertas de Saúde Personalizados
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditProfile}
            className="text-muted-foreground hover:text-foreground"
            title="Editar perfil de saúde"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && !data && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Erro ao carregar alertas: {error}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && data && (
          <>
            {/* Status do Perfil */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.hasProfile
                    ? "Perfil configurado"
                    : "Nenhum perfil registrado"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getTimeSinceUpdate()}
              </div>
            </div>

            {/* Condições de Saúde */}
            {data.profileConditions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {data.profileConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            )}

            {/* Alertas Personalizados */}
            {data.alerts.length > 0 ? (
              <div className="space-y-3">
                {data.alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className={`border-l-4 ${
                      alert.severity === "critical" || alert.severity === "high"
                        ? "border-red-500 bg-red-50"
                        : alert.severity === "moderate"
                        ? "border-orange-500 bg-orange-50"
                        : "border-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{alert.icon}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <h4 className="font-semibold text-sm">
                            {alert.title}
                          </h4>
                          {alert.healthCondition && (
                            <Badge variant="outline" className="text-xs">
                              {alert.healthCondition}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Recomendações:
                          </p>
                          <ul className="text-xs space-y-1">
                            {alert.recommendations.map((rec, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="text-muted-foreground">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Nenhum alerta ativo no momento
                </p>
                <p className="text-xs text-muted-foreground">
                  Suas condições de saúde estão sendo monitoradas
                </p>
              </div>
            )}

            {/* Ação para configurar perfil se não existir */}
            {!data.hasProfile && (
              <div className="border-t pt-4">
                <div className="text-center space-y-2">
                  <Info className="h-6 w-6 text-blue-600 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Configure seu perfil de saúde para receber alertas
                    personalizados
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditProfile}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Configurar Perfil
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && !error && !data && (
          <div className="text-center py-8 space-y-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar os dados
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
