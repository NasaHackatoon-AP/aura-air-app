"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MobileOptimizedDialog } from "@/components/Mobile/MobileOptimizedDialog/MobileOptimizedDialog";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, MapPin, Clock, Shield, Heart, X } from "lucide-react";
import { DisasterAlert, HealthRiskAlert } from "@/types/alerts";

interface AlertModalProps {
  alerts: (DisasterAlert | HealthRiskAlert)[];
  isOpen: boolean;
  onClose: () => void;
  onDismiss: (alertId: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "high":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "medium":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "low":
      return <AlertTriangle className="h-4 w-4 text-green-600" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />;
  }
};

const formatDistance = (distance: number) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Agora mesmo";
  } else if (diffInHours < 24) {
    return `Há ${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
  }
};

const DisasterAlertCard = ({
  alert,
  onDismiss,
}: {
  alert: DisasterAlert;
  onDismiss: (id: string) => void;
}) => (
  <Card className="border-l-4 border-l-orange-500">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getSeverityIcon(alert.severity)}
          <CardTitle className="text-base sm:text-lg truncate">
            {alert.title}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(alert.id)}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
          {alert.severity.toUpperCase()}
        </Badge>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {formatDistance(alert.distance)} de distância
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTimestamp(alert.timestamp)}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-3">{alert.description}</CardDescription>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Localização:</span>
          <span>
            {alert.location.city}, {alert.location.state}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Raio de impacto:</span>
          <span>{alert.affectedRadius}km</span>
        </div>
        {alert.estimatedArrival && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chegada estimada:</span>
            <span>
              {new Date(alert.estimatedArrival).toLocaleString("pt-BR")}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fonte:</span>
          <span>{alert.source}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const HealthRiskAlertCard = ({
  alert,
  onDismiss,
}: {
  alert: HealthRiskAlert;
  onDismiss: (id: string) => void;
}) => (
  <Card className="border-l-4 border-l-red-500">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          <CardTitle className="text-base sm:text-lg truncate">
            {alert.title}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(alert.id)}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <Badge className={`${getSeverityColor(alert.riskLevel)} text-xs`}>
          {alert.riskLevel.toUpperCase()}
        </Badge>
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span className="truncate">{alert.condition.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTimestamp(alert.timestamp)}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-3">{alert.description}</CardDescription>

      {alert.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Recomendações:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {alert.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2 text-sm">
        {alert.affectedBy.airQuality && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Qualidade do ar:</span>
            <span>AQI {alert.affectedBy.airQuality.aqi}</span>
          </div>
        )}
        {alert.affectedBy.weather && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Condições climáticas:</span>
            <span>
              {alert.affectedBy.weather.temperature &&
                `${alert.affectedBy.weather.temperature}°C`}
              {alert.affectedBy.weather.humidity &&
                `, ${alert.affectedBy.weather.humidity}% umidade`}
            </span>
          </div>
        )}
        {alert.affectedBy.disaster && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Desastre próximo:</span>
            <span>
              {alert.affectedBy.disaster.type} (
              {formatDistance(alert.affectedBy.disaster.distance)})
            </span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export function AlertModal({
  alerts,
  isOpen,
  onClose,
  onDismiss,
}: AlertModalProps) {
  const disasterAlerts = alerts.filter(
    (alert): alert is DisasterAlert => "type" in alert
  );
  const healthAlerts = alerts.filter(
    (alert): alert is HealthRiskAlert => "condition" in alert
  );

  return (
    <MobileOptimizedDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Alertas de Segurança"
      description="Alertas importantes sobre desastres naturais e riscos à sua saúde na sua região"
    >
      <div className="space-y-4">
        {disasterAlerts.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Desastres Naturais ({disasterAlerts.length})
            </h3>
            <div className="space-y-3">
              {disasterAlerts.map((alert) => (
                <DisasterAlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={onDismiss}
                />
              ))}
            </div>
          </div>
        )}

        {healthAlerts.length > 0 && (
          <div>
            {disasterAlerts.length > 0 && <Separator className="my-6" />}
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Riscos à Saúde ({healthAlerts.length})
            </h3>
            <div className="space-y-3">
              {healthAlerts.map((alert) => (
                <HealthRiskAlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={onDismiss}
                />
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-700">
              Nenhum alerta ativo
            </h3>
            <p className="text-muted-foreground">
              Sua região está segura no momento!
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onClose} variant="outline">
          Fechar
        </Button>
      </div>
    </MobileOptimizedDialog>
  );
}
