"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Loader2,
  AlertTriangle,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  AlertCircle,
  Info,
} from "lucide-react";
import { useWeatherAlerts } from "@/hooks/useWeatherAlerts";
import { useState } from "react";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function WeatherAlerts() {
  const {
    alerts,
    isLoading,
    error,
    fetchWeatherAlerts,
    hasAlerts,
    getTimeSinceUpdate,
  } = useWeatherAlerts({ userId: MOCK_USER_ID });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchWeatherAlerts();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAlertIcon = (iconName: string) => {
    const iconClass = "h-5 w-5";

    switch (iconName) {
      case "cloud-rain":
        return <CloudRain className={`${iconClass} text-blue-600`} />;
      case "sun":
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case "wind":
        return <Wind className={`${iconClass} text-gray-600`} />;
      case "thermometer":
        return <Thermometer className={`${iconClass} text-red-500`} />;
      case "alert-triangle":
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "danger":
        return "border-red-200 bg-red-50 text-red-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "danger":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading && !hasAlerts) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alertas Meteorológicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Carregando alertas meteorológicos...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alertas Meteorológicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="w-full mt-4"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasAlerts) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertas Meteorológicos
              </CardTitle>
              <CardDescription>
                Alertas baseados nas condições atuais
              </CardDescription>
              <p className="text-xs text-muted-foreground mt-1">
                Última atualização: {getTimeSinceUpdate()}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              variant="outline"
              size="sm"
              title="Atualizar alertas meteorológicos"
              className="hover:bg-gray-50"
            >
              {isRefreshing || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Sun className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">Nenhum alerta ativo</p>
              <p className="text-sm">Condições meteorológicas normais</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Alertas Meteorológicos
            </CardTitle>
            <CardDescription>
              Alertas baseados nas condições atuais
            </CardDescription>
            {hasAlerts && (
              <p className="text-xs text-muted-foreground mt-1">
                Última atualização: {getTimeSinceUpdate()}
              </p>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
            title="Atualizar alertas meteorológicos"
            className="hover:bg-gray-50"
          >
            {isRefreshing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getSeverityColor(
                alert.severity
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getAlertIcon(alert.icon)}
                    <h3 className="font-semibold text-sm">{alert.title}</h3>
                  </div>
                  <p className="text-sm mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {alert.timeframe}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {alert.recommendations.slice(0, 2).map((rec, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-white/50 rounded-full"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações adicionais */}
        <div className="pt-4 border-t mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total de Alertas</p>
              <p className="font-semibold">{alerts.length} ativo(s)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fonte dos Dados</p>
              <p className="font-semibold">API Externa + Algoritmos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
