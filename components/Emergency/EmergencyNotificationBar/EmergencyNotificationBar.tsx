"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
} from "lucide-react";
import { emergencyService, EmergencyAlert } from "@/services/emergencyService";

interface EmergencyNotificationBarProps {
  radius?: number; // km
}

export function EmergencyNotificationBar({
  radius = 100,
}: EmergencyNotificationBarProps) {
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Carrega alertas de emergência ativos
    const loadEmergencyAlerts = () => {
      const alerts = emergencyService.getActiveEmergencyAlerts();
      // Filtra por raio
      const nearbyAlerts = alerts.filter((alert) => alert.distance <= radius);
      setEmergencyAlerts(nearbyAlerts);
    };

    loadEmergencyAlerts();

    // Listener para novos alertas
    const removeListener = emergencyService.addListener((notification) => {
      if (notification.data && "distance" in notification.data) {
        loadEmergencyAlerts();
      }
    });

    // Atualiza a cada 30 segundos
    const interval = setInterval(loadEmergencyAlerts, 30000);

    return () => {
      removeListener();
      clearInterval(interval);
    };
  }, [radius]);

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Agora mesmo";
    } else if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} min`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `Há ${diffInHours}h`;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50 text-red-900";
      case "high":
        return "border-orange-500 bg-orange-50 text-orange-900";
      case "medium":
        return "border-yellow-500 bg-yellow-50 text-yellow-900";
      case "low":
        return "border-blue-500 bg-blue-50 text-blue-900";
      default:
        return "border-gray-500 bg-gray-50 text-gray-900";
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
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isVisible || emergencyAlerts.length === 0) {
    return null;
  }

  const criticalAlerts = emergencyAlerts.filter(
    (alert) => alert.severity === "critical"
  );
  const otherAlerts = emergencyAlerts.filter(
    (alert) => alert.severity !== "critical"
  );

  return (
    <Card
      className={`border-l-4 ${
        criticalAlerts.length > 0 ? "border-l-red-500" : "border-l-orange-500"
      } ${getSeverityColor(emergencyAlerts[0]?.severity || "medium")}`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSeverityIcon(emergencyAlerts[0]?.severity || "medium")}
              <div>
                <h3 className="font-semibold text-sm">
                  {criticalAlerts.length > 0
                    ? `${criticalAlerts.length} Emergência${
                        criticalAlerts.length > 1 ? "s" : ""
                      } Crítica${criticalAlerts.length > 1 ? "s" : ""}`
                    : `${emergencyAlerts.length} Alerta${
                        emergencyAlerts.length > 1 ? "s" : ""
                      } de Emergência`}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dentro de {radius}km da sua localização
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 w-7 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Alertas Críticos */}
          {criticalAlerts.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>ATENÇÃO:</strong> {criticalAlerts.length} emergência
                {criticalAlerts.length > 1 ? "s" : ""} crítica
                {criticalAlerts.length > 1 ? "s" : ""} detectada
                {criticalAlerts.length > 1 ? "s" : ""} na sua região!
              </AlertDescription>
            </Alert>
          )}

          {/* Lista de Alertas */}
          {isExpanded && (
            <div className="space-y-2">
              {emergencyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-2 bg-white/50 rounded border"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {alert.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {formatDistance(alert.distance)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </div>
                        {alert.affectedPopulation && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.affectedPopulation > 1000
                              ? `${Math.floor(
                                  alert.affectedPopulation / 1000
                                )}k`
                              : alert.affectedPopulation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resumo */}
          {!isExpanded && emergencyAlerts.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {criticalAlerts.length > 0 &&
                  `${criticalAlerts.length} crítico${
                    criticalAlerts.length > 1 ? "s" : ""
                  }`}
                {criticalAlerts.length > 0 && otherAlerts.length > 0 && " • "}
                {otherAlerts.length > 0 &&
                  `${otherAlerts.length} outro${
                    otherAlerts.length > 1 ? "s" : ""
                  }`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
