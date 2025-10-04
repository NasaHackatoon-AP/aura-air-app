"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, MapPin, Bell, X } from "lucide-react";
import { useAlerts } from "@/contexts/AlertContext";
import { useAlertNotifications } from "@/hooks/useAlertNotifications";

export function AlertNotification() {
  const { showAlerts, isModalOpen } = useAlerts();
  const { hasCriticalAlerts, totalAlerts, disasterAlerts, healthAlerts } =
    useAlertNotifications();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || totalAlerts === 0 || isModalOpen) {
    return null;
  }

  const getAlertIcon = () => {
    if (hasCriticalAlerts) {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    if (healthAlerts.length > 0) {
      return <Heart className="h-5 w-5 text-red-500" />;
    }
    return <MapPin className="h-5 w-5 text-orange-500" />;
  };

  const getAlertMessage = () => {
    if (hasCriticalAlerts) {
      return "Alerta crítico ativo!";
    }
    if (totalAlerts === 1) {
      return "1 alerta ativo";
    }
    return `${totalAlerts} alertas ativos`;
  };

  const getAlertColor = () => {
    if (hasCriticalAlerts) {
      return "border-red-200 bg-red-50";
    }
    if (healthAlerts.length > 0) {
      return "border-red-200 bg-red-50";
    }
    return "border-orange-200 bg-orange-50";
  };

  return (
    <Card className={`border-l-4 border-l-orange-500 ${getAlertColor()}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {getAlertIcon()}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {getAlertMessage()}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {disasterAlerts.length > 0 && healthAlerts.length > 0
                  ? `${disasterAlerts.length} desastres, ${healthAlerts.length} riscos à saúde`
                  : disasterAlerts.length > 0
                  ? "Desastres naturais próximos"
                  : "Riscos à sua saúde"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {hasCriticalAlerts && (
              <Badge
                variant="destructive"
                className="text-xs hidden sm:inline-flex"
              >
                CRÍTICO
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={showAlerts}
              className="h-7 sm:h-8 text-xs px-2 sm:px-3"
            >
              <Bell className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Ver Alertas</span>
              <span className="sm:hidden">Ver</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
