import { AQIForecastDebug } from "@/components/AQI/AQIForecastDebug/AQIForecastDebug";
import { WeatherForecast } from "@/components/Weather/WeatherForecast/WeatherForecast";

export default function TestAQIDebugPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Debug da API de Previsão AQI</h1>
        <p className="text-muted-foreground mt-2">
          Use esta página para diagnosticar problemas com a API de previsão de
          qualidade do ar.
        </p>
      </div>

      <div className="space-y-6">
        <AQIForecastDebug />
        <WeatherForecast />
      </div>
    </div>
  );
}
