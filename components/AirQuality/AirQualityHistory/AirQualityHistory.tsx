"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";

const mockHistoryData = [
  { time: "00:00", aqi: 42, pm25: 10 },
  { time: "03:00", aqi: 38, pm25: 9 },
  { time: "06:00", aqi: 45, pm25: 12 },
  { time: "09:00", aqi: 52, pm25: 15 },
  { time: "12:00", aqi: 48, pm25: 13 },
  { time: "15:00", aqi: 45, pm25: 12 },
  { time: "18:00", aqi: 50, pm25: 14 },
  { time: "21:00", aqi: 43, pm25: 11 },
  { time: "Agora", aqi: 45, pm25: 12 },
];

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">
          Histórico de Qualidade do Ar (24h)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Acompanhe as variações de IQA e PM2.5 nas últimas 24 horas
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <AreaChart
            data={mockHistoryData}
            margin={{
              top: 5,
              right: isMobile ? 5 : 20,
              left: isMobile ? -20 : 0,
              bottom: 5,
            }}
          >
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
              tick={{ fontSize: isMobile ? 10 : 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12 }}
              stroke="hsl(var(--muted-foreground))"
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: isMobile ? "11px" : "12px" }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="hsl(var(--primary))"
              fill="url(#colorAqi)"
              strokeWidth={2.5}
              name="IQA"
              dot={{ r: isMobile ? 3 : 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: isMobile ? 5 : 6 }}
            />
            <Area
              type="monotone"
              dataKey="pm25"
              stroke="#f97316"
              fill="url(#colorPm25)"
              strokeWidth={2.5}
              name="PM2.5 (μg/m³)"
              dot={{ r: isMobile ? 3 : 4, fill: "#f97316" }}
              activeDot={{ r: isMobile ? 5 : 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
