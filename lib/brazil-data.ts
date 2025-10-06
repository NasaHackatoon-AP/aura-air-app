export interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

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
      };
    };
  };
}

// Cached data to avoid repeated API calls
let statesCache: IBGEState[] | null = null;
let citiesCache: Map<string, IBGECity[]> = new Map();

export const fetchStates = async (): Promise<IBGEState[]> => {
  if (statesCache) {
    return statesCache;
  }

  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    statesCache = await response.json();
    return statesCache!;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const fetchCitiesByState = async (stateCode: string): Promise<IBGECity[]> => {
  if (citiesCache.has(stateCode)) {
    return citiesCache.get(stateCode)!;
  }

  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cities for state ${stateCode}`);
    }
    const cities = await response.json();
    citiesCache.set(stateCode, cities);
    return cities;
  } catch (error) {
    console.error(`Error fetching cities for state ${stateCode}:`, error);
    return [];
  }
};