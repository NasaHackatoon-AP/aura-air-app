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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import React, { useEffect, useState } from "react";
import { RefreshCw, Loader2, AlertTriangle, TrendingUp } from "lucide-react";
import { useAirQualityHistory } from "@/hooks/useAirQualityHistory";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold mb-2">{payload[0].payload.time}</p>
        <div className="space-y-1">
          <p className="text-xs flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="font-medium">IQA:</span>
            <span className="text-muted-foreground">{payload[0].value}</span>
          </p>
          <p className="text-xs flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#f97316" }}
            ></span>
            <span className="font-medium">PM2.5:</span>
            <span className="text-muted-foreground">
              {payload[1].value} μg/m³
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function AirQualityHistory() {
  const {
    data,
    historyData,
    isLoading,
    error,
    fetchAirQualityHistory,
    hasData,
    getTimeSinceUpdate,
    getNextUpdateTime,
  } = useAirQualityHistory({ userId: MOCK_USER_ID });

  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAirQualityHistory();
    } finally {
      setIsRefreshing(false);
    }
  };

  const chartMargin = {
    top: 20,
    right: isMobile ? 10 : 30,
    left: isMobile ? 10 : 30,
    bottom: 20,
  };

  const xAxisTickStyle = {
    fontSize: isMobile ? "10px" : "12px",
    fill: "hsl(var(--muted-foreground))",
  };

  const yAxisTickStyle = {
    fontSize: isMobile ? "10px" : "12px",
    fill: "hsl(var(--muted-foreground))",
  };

  const legendStyle = {
    fontSize: isMobile ? "10px" : "12px",
    color: "hsl(var(--muted-foreground))",
  };

  const activeDotConfig =
    (() => ({
      r: isMobile ? 5 : 6,
    }),
    [isMobile]);

  if (isLoading && !hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Histórico de Qualidade do Ar (24h)
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Acompanhe as variações de IQA e PM2.5 nas últimas 24 horas
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Carregando histórico...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Histórico de Qualidade do Ar (24h)
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Acompanhe as variações de IQA e PM2.5 nas últimas 24 horas
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
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

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Histórico de Qualidade do Ar (24h)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Acompanhe as variações de IQA e PM2.5 nas últimas 24 horas
            </CardDescription>
            {hasData && (
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
          >
            {isRefreshing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <AreaChart data={historyData} margin={chartMargin}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted opacity-30"
            />
            <XAxis
              dataKey="time"
              tick={xAxisTickStyle}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={yAxisTickStyle}
              stroke="hsl(var(--muted-foreground))"
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={legendStyle} iconType="circle" />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="hsl(var(--primary))"
              fill="url(#colorAqi)"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={activeDotConfig}
              name="IQA"
            />
            <Area
              type="monotone"
              dataKey="pm25"
              stroke="#f97316"
              fill="url(#colorPm25)"
              strokeWidth={2}
              dot={{ r: 4, fill: "#f97316" }}
              activeDot={activeDotConfig}
              name="PM2.5 (μg/m³)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Informações adicionais se houver dados da API */}
        {data && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cidade</p>
                <p className="font-semibold">{data.clima?.cidade || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">AQI Atual</p>
                <p className="font-semibold">
                  {data.aqi_personalizado || data.aqi_original || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Próxima Atualização</p>
                <p className="font-semibold">{getNextUpdateTime()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
