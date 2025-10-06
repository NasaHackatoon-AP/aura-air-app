// Serviço para buscar dados do IBGE (Instituto Brasileiro de Geografia e Estatística)
export interface IBGECity {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
}

export interface IBGECityResponse {
  cities: IBGECityAppFormat[];
  total: number;
  hasMore: boolean;
}

export interface IBGECityAppFormat {
  id: number;
  name: string;
  state: string;
  stateName: string;
  region: string;
  regionCode: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

class IBGEService {
  private cache = new Map<string, IBGECityResponse>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas

  async searchCities(
    query: string,
    limit: number = 50
  ): Promise<IBGECityResponse> {
    const cacheKey = `search_${query}_${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - (cached as any).timestamp < this.cacheExpiry) {
      return cached;
    }

    try {
      console.log(`🔍 IBGE: Buscando cidades para "${query}"`);

      // API do IBGE para buscar municípios - sem filtro na URL, vamos filtrar localmente
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`
      );

      if (!response.ok) {
        throw new Error(`API IBGE error: ${response.status}`);
      }

      const data: IBGECity[] = await response.json();
      console.log(`📊 IBGE: ${data.length} cidades encontradas`);

      // Filtrar e limitar resultados com busca mais inteligente
      const queryLower = query.toLowerCase().trim();
      const filteredCities = data
        .filter((city) => {
          const cityName = city.nome.toLowerCase();

          // Verificar se microrregiao existe antes de acessar
          if (
            !city.microrregiao ||
            !city.microrregiao.mesorregiao ||
            !city.microrregiao.mesorregiao.UF
          ) {
            return cityName.includes(queryLower);
          }

          const stateName = city.microrregiao.mesorregiao.UF.nome.toLowerCase();
          const stateCode =
            city.microrregiao.mesorregiao.UF.sigla.toLowerCase();

          // Busca por nome da cidade, estado ou sigla
          return (
            cityName.includes(queryLower) ||
            stateName.includes(queryLower) ||
            stateCode.includes(queryLower)
          );
        })
        .slice(0, limit);

      // Converter cidades para formato da aplicação com coordenadas precisas
      const convertedCities = await Promise.all(
        filteredCities.map((city) => this.convertIBGECityToAppFormat(city))
      );

      const result: IBGECityResponse = {
        cities: convertedCities,
        total: convertedCities.length,
        hasMore: convertedCities.length === limit,
      };

      // Cache com timestamp
      (result as any).timestamp = Date.now();
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Erro ao buscar cidades do IBGE:", error);

      // Fallback para cidades brasileiras principais
      return this.getFallbackCities(query);
    }
  }

  async getCityById(cityId: number): Promise<IBGECity | null> {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cityId}`
      );

      if (!response.ok) {
        throw new Error(`API IBGE error: ${response.status}`);
      }

      const city: IBGECity = await response.json();
      return city;
    } catch (error) {
      console.error("Erro ao buscar cidade por ID:", error);
      return null;
    }
  }

  async getAllStates(): Promise<
    Array<{ id: number; sigla: string; nome: string }>
  > {
    try {
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );

      if (!response.ok) {
        throw new Error(`API IBGE error: ${response.status}`);
      }

      const states = await response.json();
      return states;
    } catch (error) {
      console.error("Erro ao buscar estados:", error);
      return [];
    }
  }

  // Converter dados do IBGE para formato usado pela aplicação
  async convertIBGECityToAppFormat(ibgeCity: IBGECity) {
    // Tentar obter coordenadas precisas via geocoding
    const preciseCoords = await this.getCityCoordinates(
      ibgeCity.nome,
      ibgeCity.microrregiao.mesorregiao.UF.sigla
    );

    return {
      id: ibgeCity.id,
      name: ibgeCity.nome,
      state: ibgeCity.microrregiao.mesorregiao.UF.sigla,
      stateName: ibgeCity.microrregiao.mesorregiao.UF.nome,
      region: ibgeCity.microrregiao.mesorregiao.UF.regiao.nome,
      regionCode: ibgeCity.microrregiao.mesorregiao.UF.regiao.sigla,
      country: "Brasil",
      countryCode: "BR",
      // Usar coordenadas precisas se disponíveis, senão usar aproximadas do estado
      lat:
        preciseCoords.lat ||
        this.getStateLatitude(ibgeCity.microrregiao.mesorregiao.UF.sigla),
      lon:
        preciseCoords.lon ||
        this.getStateLongitude(ibgeCity.microrregiao.mesorregiao.UF.sigla),
    };
  }

  // Obter coordenadas precisas da cidade via geocoding
  private async getCityCoordinates(
    cityName: string,
    stateCode: string
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      // Usar Nominatim (OpenStreetMap) para geocoding
      const query = `${cityName}, ${stateCode}, Brasil`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1&countrycodes=br`
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (error) {
      console.error(`Erro ao obter coordenadas para ${cityName}:`, error);
      return null;
    }
  }

  // Coordenadas aproximadas por estado (centro do estado)
  private getStateLatitude(stateCode: string): number {
    const stateCoordinates: { [key: string]: number } = {
      AC: -8.77,
      AL: -9.57,
      AP: 1.41,
      AM: -3.47,
      BA: -12.96,
      CE: -7.24,
      DF: -15.78,
      ES: -19.19,
      GO: -16.64,
      MA: -2.55,
      MT: -12.64,
      MS: -20.51,
      MG: -18.1,
      PA: -5.53,
      PB: -7.24,
      PR: -24.89,
      PE: -8.28,
      PI: -8.28,
      RJ: -22.84,
      RN: -5.22,
      RS: -30.03,
      RO: -11.22,
      RR: 1.99,
      SC: -27.1,
      SP: -23.55,
      SE: -10.57,
      TO: -10.18,
    };
    return stateCoordinates[stateCode] || -23.55; // Default para SP
  }

  private getStateLongitude(stateCode: string): number {
    const stateCoordinates: { [key: string]: number } = {
      AC: -70.55,
      AL: -36.82,
      AP: -51.77,
      AM: -62.09,
      BA: -38.5,
      CE: -39.02,
      DF: -47.86,
      ES: -40.31,
      GO: -49.31,
      MA: -44.3,
      MT: -55.42,
      MS: -54.54,
      MG: -44.38,
      PA: -52.58,
      PB: -36.78,
      PR: -51.55,
      PE: -35.55,
      PI: -42.28,
      RJ: -43.15,
      RN: -36.78,
      RS: -51.22,
      RO: -62.8,
      RR: -61.33,
      SC: -48.55,
      SP: -46.63,
      SE: -37.45,
      TO: -48.33,
    };
    return stateCoordinates[stateCode] || -46.63; // Default para SP
  }

  private getFallbackCities(query: string): IBGECityResponse {
    const fallbackCities: IBGECity[] = [
      {
        id: 3550308,
        nome: "São Paulo",
        microrregiao: {
          id: 35061,
          nome: "São Paulo",
          mesorregiao: {
            id: 3515,
            nome: "Metropolitana de São Paulo",
            UF: {
              id: 35,
              sigla: "SP",
              nome: "São Paulo",
              regiao: {
                id: 3,
                sigla: "SE",
                nome: "Sudeste",
              },
            },
          },
        },
      },
      {
        id: 3304557,
        nome: "Rio de Janeiro",
        microrregiao: {
          id: 33018,
          nome: "Rio de Janeiro",
          mesorregiao: {
            id: 3305,
            nome: "Metropolitana do Rio de Janeiro",
            UF: {
              id: 33,
              sigla: "RJ",
              nome: "Rio de Janeiro",
              regiao: {
                id: 3,
                sigla: "SE",
                nome: "Sudeste",
              },
            },
          },
        },
      },
      {
        id: 5300108,
        nome: "Brasília",
        microrregiao: {
          id: 53001,
          nome: "Brasília",
          mesorregiao: {
            id: 5301,
            nome: "Distrito Federal",
            UF: {
              id: 53,
              sigla: "DF",
              nome: "Distrito Federal",
              regiao: {
                id: 5,
                sigla: "CO",
                nome: "Centro-Oeste",
              },
            },
          },
        },
      },
    ];

    const filtered = fallbackCities.filter((city) =>
      city.nome.toLowerCase().includes(query.toLowerCase())
    );

    return {
      cities: filtered,
      total: filtered.length,
      hasMore: false,
    };
  }
}

export const ibgeService = new IBGEService();
