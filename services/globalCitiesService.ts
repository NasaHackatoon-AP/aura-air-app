// Serviço para buscar cidades globais usando API pública
export interface GlobalCity {
  name: string;
  country: string;
  countryCode: string;
  state: string;
  lat: number;
  lon: number;
  population?: number;
  uniqueId?: string;
}

export interface GlobalCitiesResponse {
  cities: GlobalCity[];
  total: number;
  hasMore: boolean;
}

class GlobalCitiesService {
  private cache = new Map<string, GlobalCitiesResponse>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas

  async searchCities(
    query: string,
    limit: number = 50
  ): Promise<GlobalCitiesResponse> {
    const cacheKey = `search_${query}_${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - (cached as any).timestamp < this.cacheExpiry) {
      return cached;
    }

    try {
      // Usar API do Nominatim (OpenStreetMap) - gratuita e confiável
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=${limit}&addressdetails=1&extratags=1`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const cities: GlobalCity[] = data
        .map((item: any, index: number) => ({
          name: item.name || item.display_name.split(",")[0],
          country: item.address?.country || "Unknown",
          countryCode: item.address?.country_code?.toUpperCase() || "XX",
          state: item.address?.state || item.address?.region || "",
          lat: parseFloat(item.lat) || 0,
          lon: parseFloat(item.lon) || 0,
          population: 0, // Nominatim não fornece população
          uniqueId: `${item.name || item.display_name.split(",")[0]}-${
            item.address?.country || "Unknown"
          }-${item.lat}-${item.lon}-${index}`,
        }))
        .filter(
          (city, index, self) =>
            // Remover duplicatas baseado em nome, país e coordenadas
            index ===
            self.findIndex(
              (c) =>
                c.name === city.name &&
                c.country === city.country &&
                Math.abs(c.lat - city.lat) < 0.001 &&
                Math.abs(c.lon - city.lon) < 0.001
            )
        );

      const result: GlobalCitiesResponse = {
        cities,
        total: cities.length,
        hasMore: cities.length === limit,
      };

      // Cache com timestamp
      (result as any).timestamp = Date.now();
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Erro ao buscar cidades globais:", error);

      // Fallback para cidades brasileiras principais
      return this.getFallbackCities(query);
    }
  }

  private getFallbackCities(query: string): GlobalCitiesResponse {
    const fallbackCities: GlobalCity[] = [
      {
        name: "São Paulo",
        country: "Brasil",
        countryCode: "BR",
        state: "SP",
        lat: -23.5505,
        lon: -46.6333,
        population: 12396372,
      },
      {
        name: "Rio de Janeiro",
        country: "Brasil",
        countryCode: "BR",
        state: "RJ",
        lat: -22.9068,
        lon: -43.1729,
        population: 6747815,
      },
      {
        name: "Brasília",
        country: "Brasil",
        countryCode: "BR",
        state: "DF",
        lat: -15.7801,
        lon: -47.9292,
        population: 3015268,
      },
      {
        name: "Salvador",
        country: "Brasil",
        countryCode: "BR",
        state: "BA",
        lat: -12.9714,
        lon: -38.5014,
        population: 2886698,
      },
      {
        name: "Fortaleza",
        country: "Brasil",
        countryCode: "BR",
        state: "CE",
        lat: -3.7172,
        lon: -38.5434,
        population: 2703391,
      },
      {
        name: "Belo Horizonte",
        country: "Brasil",
        countryCode: "BR",
        state: "MG",
        lat: -19.9167,
        lon: -43.9345,
        population: 2530701,
      },
      {
        name: "Manaus",
        country: "Brasil",
        countryCode: "BR",
        state: "AM",
        lat: -3.119,
        lon: -60.0217,
        population: 2255903,
      },
      {
        name: "Curitiba",
        country: "Brasil",
        countryCode: "BR",
        state: "PR",
        lat: -25.4244,
        lon: -49.2654,
        population: 1963726,
      },
      {
        name: "Recife",
        country: "Brasil",
        countryCode: "BR",
        state: "PE",
        lat: -8.0476,
        lon: -34.877,
        population: 1661017,
      },
      {
        name: "Porto Alegre",
        country: "Brasil",
        countryCode: "BR",
        state: "RS",
        lat: -30.0346,
        lon: -51.2177,
        population: 1492530,
      },
    ];

    const filtered = fallbackCities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    return {
      cities: filtered,
      total: filtered.length,
      hasMore: false,
    };
  }

  private getFallbackCitiesByCountry(
    countryCode: string
  ): GlobalCitiesResponse {
    const fallbackData: { [key: string]: GlobalCity[] } = {
      BR: [
        {
          name: "São Paulo",
          country: "Brasil",
          countryCode: "BR",
          state: "SP",
          lat: -23.5505,
          lon: -46.6333,
          population: 12396372,
        },
        {
          name: "Rio de Janeiro",
          country: "Brasil",
          countryCode: "BR",
          state: "RJ",
          lat: -22.9068,
          lon: -43.1729,
          population: 6747815,
        },
        {
          name: "Brasília",
          country: "Brasil",
          countryCode: "BR",
          state: "DF",
          lat: -15.7801,
          lon: -47.9292,
          population: 3015268,
        },
        {
          name: "Salvador",
          country: "Brasil",
          countryCode: "BR",
          state: "BA",
          lat: -12.9714,
          lon: -38.5014,
          population: 2886698,
        },
        {
          name: "Fortaleza",
          country: "Brasil",
          countryCode: "BR",
          state: "CE",
          lat: -3.7172,
          lon: -38.5434,
          population: 2703391,
        },
      ],
      US: [
        {
          name: "New York",
          country: "Estados Unidos",
          countryCode: "US",
          state: "NY",
          lat: 40.7128,
          lon: -74.006,
          population: 8336817,
        },
        {
          name: "Los Angeles",
          country: "Estados Unidos",
          countryCode: "US",
          state: "CA",
          lat: 34.0522,
          lon: -118.2437,
          population: 3979576,
        },
        {
          name: "Chicago",
          country: "Estados Unidos",
          countryCode: "US",
          state: "IL",
          lat: 41.8781,
          lon: -87.6298,
          population: 2693976,
        },
        {
          name: "Houston",
          country: "Estados Unidos",
          countryCode: "US",
          state: "TX",
          lat: 29.7604,
          lon: -95.3698,
          population: 2320268,
        },
        {
          name: "Phoenix",
          country: "Estados Unidos",
          countryCode: "US",
          state: "AZ",
          lat: 33.4484,
          lon: -112.074,
          population: 1680992,
        },
      ],
      AR: [
        {
          name: "Buenos Aires",
          country: "Argentina",
          countryCode: "AR",
          state: "CABA",
          lat: -34.6118,
          lon: -58.396,
          population: 3075646,
        },
        {
          name: "Córdoba",
          country: "Argentina",
          countryCode: "AR",
          state: "CBA",
          lat: -31.4201,
          lon: -64.1888,
          population: 1565112,
        },
        {
          name: "Rosario",
          country: "Argentina",
          countryCode: "AR",
          state: "SF",
          lat: -32.9442,
          lon: -60.6505,
          population: 1344092,
        },
        {
          name: "Mendoza",
          country: "Argentina",
          countryCode: "AR",
          state: "MZA",
          lat: -32.8908,
          lon: -68.8272,
          population: 115041,
        },
        {
          name: "La Plata",
          country: "Argentina",
          countryCode: "AR",
          state: "BA",
          lat: -34.9214,
          lon: -57.9544,
          population: 899523,
        },
      ],
    };

    const cities = fallbackData[countryCode] || [];

    return {
      cities,
      total: cities.length,
      hasMore: false,
    };
  }

  getCountryFlag(countryCode: string): string {
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
    };

    return flagEmojis[countryCode] || "🏳️";
  }
}

export const globalCitiesService = new GlobalCitiesService();
