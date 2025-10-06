"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Cloud,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import { BrazilCitySelector } from "../BrazilCitySelector/BrazilCitySelector";
import { useLocation } from "@/contexts/LocationContext";
import { useState } from "react";

// Mock user ID - em produção, viria do contexto de autenticação
const MOCK_USER_ID = 1;

export function WeatherOverview() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { location, updateLocation: updateGlobalLocation } = useLocation();

  const {
    data,
    isLoading,
    error,
    fetchCurrentWeather,
    updateLocation,
    hasData,
    getTimeSinceUpdate,
  } = useCurrentWeather({
    userId: MOCK_USER_ID,
    latitude: location.latitude,
    longitude: location.longitude,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchCurrentWeather();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLocationChange = (
    city: string,
    state: string,
    stateName: string,
    region: string,
    lat: number,
    lon: number
  ) => {
    console.log(
      `🌍 WeatherOverview: Mudando localização para ${city}, ${state} (${stateName}) - ${lat}, ${lon}`
    );

    // Atualizar localização global com dados da cidade brasileira selecionada
    updateGlobalLocation(city, state, "Brasil", "BR", lat, lon);

    // Atualizar dados meteorológicos
    updateLocation(lat, lon);
  };

  if (isLoading && !hasData) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Condições Atuais</span>
            <span className="sm:hidden">Clima</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Skeleton className="h-12 w-20 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Condições Atuais</span>
              <span className="sm:hidden">Clima</span>
            </CardTitle>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              title="Atualizar condições atuais"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Condições Atuais</span>
            <span className="sm:hidden">Clima</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Não foi possível carregar as condições atuais</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sol") || conditionLower.includes("limpo")) {
      return (
        <Sun className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-yellow-500 flex-shrink-0 ml-2" />
      );
    } else if (conditionLower.includes("nublado")) {
      return (
        <Cloud className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-gray-500 flex-shrink-0 ml-2" />
      );
    } else if (conditionLower.includes("chuva")) {
      return (
        <Droplets className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-500 flex-shrink-0 ml-2" />
      );
    }
    return (
      <Sun className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-primary flex-shrink-0 ml-2" />
    );
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return "Baixo";
    if (uvIndex <= 5) return "Moderado";
    if (uvIndex <= 7) return "Alto";
    if (uvIndex <= 10) return "Muito Alto";
    return "Extremo";
  };

  const getCountryFlag = (countryCode: string) => {
    const flagEmojis: { [key: string]: string } = {
      BR: "🇧🇷",
      US: "🇺🇸",
      CA: "🇨🇦",
      MX: "🇲🇽",
      AR: "🇦🇷",
      CL: "🇨🇱",
      CO: "🇨🇴",
      PE: "🇵🇪",
      UY: "🇺🇾",
      PY: "🇵🇾",
      BO: "🇧🇴",
      VE: "🇻🇪",
      GY: "🇬🇾",
      SR: "🇸🇷",
      GF: "🇬🇫",
      FR: "🇫🇷",
      DE: "🇩🇪",
      GB: "🇬🇧",
      ES: "🇪🇸",
      IT: "🇮🇹",
      PT: "🇵🇹",
      NL: "🇳🇱",
      BE: "🇧🇪",
      CH: "🇨🇭",
      AT: "🇦🇹",
      SE: "🇸🇪",
      NO: "🇳🇴",
      DK: "🇩🇰",
      FI: "🇫🇮",
      PL: "🇵🇱",
      CZ: "🇨🇿",
      HU: "🇭🇺",
      RO: "🇷🇴",
      BG: "🇧🇬",
      HR: "🇭🇷",
      SI: "🇸🇮",
      SK: "🇸🇰",
      EE: "🇪🇪",
      LV: "🇱🇻",
      LT: "🇱🇹",
      IE: "🇮🇪",
      IS: "🇮🇸",
      LU: "🇱🇺",
      MT: "🇲🇹",
      CY: "🇨🇾",
      GR: "🇬🇷",
      TR: "🇹🇷",
      RU: "🇷🇺",
      UA: "🇺🇦",
      BY: "🇧🇾",
      MD: "🇲🇩",
      GE: "🇬🇪",
      AM: "🇦🇲",
      AZ: "🇦🇿",
      KZ: "🇰🇿",
      UZ: "🇺🇿",
      KG: "🇰🇬",
      TJ: "🇹🇯",
      TM: "🇹🇲",
      AF: "🇦🇫",
      PK: "🇵🇰",
      IN: "🇮🇳",
      BD: "🇧🇩",
      LK: "🇱🇰",
      NP: "🇳🇵",
      BT: "🇧🇹",
      MV: "🇲🇻",
      CN: "🇨🇳",
      JP: "🇯🇵",
      KR: "🇰🇷",
      KP: "🇰🇵",
      MN: "🇲🇳",
      TW: "🇹🇼",
      HK: "🇭🇰",
      MO: "🇲🇴",
      SG: "🇸🇬",
      MY: "🇲🇾",
      TH: "🇹🇭",
      VN: "🇻🇳",
      LA: "🇱🇦",
      KH: "🇰🇭",
      MM: "🇲🇲",
      ID: "🇮🇩",
      PH: "🇵🇭",
      BN: "🇧🇳",
      TL: "🇹🇱",
      AU: "🇦🇺",
      NZ: "🇳🇿",
      FJ: "🇫🇯",
      PG: "🇵🇬",
      SB: "🇸🇧",
      VU: "🇻🇺",
      NC: "🇳🇨",
      PF: "🇵🇫",
      WS: "🇼🇸",
      TO: "🇹🇴",
      KI: "🇰🇮",
      TV: "🇹🇻",
      NR: "🇳🇷",
      FM: "🇫🇲",
      MH: "🇲🇭",
      PW: "🇵🇼",
      AS: "🇦🇸",
      GU: "🇬🇺",
      MP: "🇲🇵",
      VI: "🇻🇮",
      PR: "🇵🇷",
      ZA: "🇿🇦",
      EG: "🇪🇬",
      LY: "🇱🇾",
      TN: "🇹🇳",
      DZ: "🇩🇿",
      MA: "🇲🇦",
      SD: "🇸🇩",
      SS: "🇸🇸",
      ET: "🇪🇹",
      ER: "🇪🇷",
      DJ: "🇩🇯",
      SO: "🇸🇴",
      KE: "🇰🇪",
      UG: "🇺🇬",
      TZ: "🇹🇿",
      RW: "🇷🇼",
      BI: "🇧🇮",
      MW: "🇲🇼",
      ZM: "🇿🇲",
      ZW: "🇿🇼",
      BW: "🇧🇼",
      NA: "🇳🇦",
      SZ: "🇸🇿",
      LS: "🇱🇸",
      MZ: "🇲🇿",
      MG: "🇲🇬",
      MU: "🇲🇺",
      SC: "🇸🇨",
      KM: "🇰🇲",
      YT: "🇾🇹",
      RE: "🇷🇪",
      ZA: "🇿🇦",
      GH: "🇬🇭",
      TG: "🇹🇬",
      BJ: "🇧🇯",
      NE: "🇳🇪",
      BF: "🇧🇫",
      ML: "🇲🇱",
      SN: "🇸🇳",
      GM: "🇬🇲",
      GW: "🇬🇼",
      GN: "🇬🇳",
      SL: "🇸🇱",
      LR: "🇱🇷",
      CI: "🇨🇮",
      GH: "🇬🇭",
      TG: "🇹🇬",
      BJ: "🇧🇯",
      NE: "🇳🇪",
      BF: "🇧🇫",
      ML: "🇲🇱",
      SN: "🇸🇳",
      GM: "🇬🇲",
      GW: "🇬🇼",
      GN: "🇬🇳",
      SL: "🇸🇱",
      LR: "🇱🇷",
      CI: "🇨🇮",
      NG: "🇳🇬",
      CM: "🇨🇲",
      TD: "🇹🇩",
      CF: "🇨🇫",
      CD: "🇨🇩",
      CG: "🇨🇬",
      GA: "🇬🇦",
      GQ: "🇬🇶",
      ST: "🇸🇹",
      AO: "🇦🇴",
      NA: "🇳🇦",
      ZA: "🇿🇦",
      BW: "🇧🇼",
      SZ: "🇸🇿",
      LS: "🇱🇸",
      MZ: "🇲🇿",
      MG: "🇲🇬",
      MU: "🇲🇺",
      SC: "🇸🇨",
      KM: "🇰🇲",
      YT: "🇾🇹",
      RE: "🇷🇪",
    };

    return flagEmojis[countryCode] || "🏳️";
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Condições Atuais</span>
              <span className="sm:hidden">Clima</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {getTimeSinceUpdate()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <BrazilCitySelector
                currentCity={data.city}
                currentState={data.state}
                onLocationChange={handleLocationChange}
              />
            )}
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              variant="outline"
              size="sm"
              title="Atualizar condições atuais"
              className="hover:bg-gray-50"
            >
              {isRefreshing || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary">
                {data.city}
              </h2>
              <span className="text-sm sm:text-base text-muted-foreground font-medium">
                {data.state}
              </span>
              <div className="flex items-center gap-1">
                <img
                  src={`https://flagcdn.com/w20/${data.countryCode.toLowerCase()}.png`}
                  alt={`Bandeira do ${data.country}`}
                  className="w-5 h-3 sm:w-6 sm:h-4 rounded-sm object-cover"
                  onError={(e) => {
                    // Fallback para emoji da bandeira se a imagem falhar
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling!.style.display =
                      "inline";
                  }}
                />
                <span
                  className="text-lg sm:text-xl"
                  style={{ display: "none" }}
                >
                  {getCountryFlag(data.countryCode)}
                </span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {data.temperature}°C
            </div>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Sensação térmica: {data.feelsLike}°C
            </p>
            <p className="text-base sm:text-lg mt-2 truncate">
              {data.condition}
            </p>
          </div>
          {getWeatherIcon(data.condition)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Umidade
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Vento
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.windSpeed} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Visibilidade
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.visibility} km
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Pressão
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.pressure} hPa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 col-span-2 sm:col-span-1">
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm sm:text-sm text-muted-foreground truncate">
                Índice UV
              </p>
              <p className="font-semibold text-base sm:text-base">
                {data.uvIndex} ({getUVLevel(data.uvIndex)})
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
