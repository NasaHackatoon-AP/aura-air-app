import { AirQualityTest } from "@/components/AirQuality/AirQualityTest/AirQualityTest";
import { AirQualityIndex } from "@/components/AirQuality/AirQualityIndex/AirQualityIndex";
import { Pollutants } from "@/components/AirQuality/Pollutants/Pollutants";
import { PollutantsTest } from "@/components/AirQuality/PollutantsTest/PollutantsTest";
import { AirQualityHistory } from "@/components/AirQuality/AirQualityHistory/AirQualityHistory";
import { AirQualityHistoryTest } from "@/components/AirQuality/AirQualityHistoryTest/AirQualityHistoryTest";
import { CurrentConditions } from "@/components/Weather/CurrentConditions/CurrentConditions";
import { HourlyForecast } from "@/components/Weather/HourlyForecast/HourlyForecast";
import { WeatherDashboard } from "@/components/Weather/WeatherDashboard/WeatherDashboard";
import { WeatherAlerts } from "@/components/Weather/WeatherAlerts/WeatherAlerts";
import { WeatherAlertsTest } from "@/components/Weather/WeatherAlertsTest/WeatherAlertsTest";
import { PersonalizedHealthCard } from "@/components/Health/PersonalizedHealthCard/PersonalizedHealthCard";

export default function TestAirQualityPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Teste da API de Qualidade do Ar</h1>
        <p className="text-muted-foreground">
          Teste a integração com a API externa de qualidade do ar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Componente de Teste</h2>
          <AirQualityTest />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Card de Qualidade do Ar
          </h2>
          <AirQualityIndex />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Poluentes Atmosféricos</h2>
        <Pollutants />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Teste de Poluentes</h2>
        <PollutantsTest />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Histórico de Qualidade do Ar
        </h2>
        <AirQualityHistory />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Teste de Histórico</h2>
        <AirQualityHistoryTest />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Condições Atuais</h2>
        <CurrentConditions />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Previsão Horária</h2>
        <HourlyForecast />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Dashboard Climático Completo
        </h2>
        <WeatherDashboard />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Alertas Meteorológicos</h2>
        <WeatherAlerts />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Teste de Emergência - Alertas
        </h2>
        <WeatherAlertsTest />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Card Unificado de Saúde</h2>
        <PersonalizedHealthCard userId={1} />
      </div>
    </div>
  );
}
