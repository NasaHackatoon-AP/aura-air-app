"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

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
]

export function AirQualityHistory() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Histórico de Qualidade do Ar (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockHistoryData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" strokeWidth={2} name="IQA" />
            <Line type="monotone" dataKey="pm25" stroke="hsl(var(--secondary))" strokeWidth={2} name="PM2.5" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
