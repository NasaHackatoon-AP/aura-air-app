'use client';

import { useState, useEffect } from 'react';
import { IBGEState, IBGECity, fetchStates, fetchCitiesByState } from '@/lib/brazil-data';

export const useBrazilLocation = () => {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        setError(null);
        const statesData = await fetchStates();
        setStates(statesData);
      } catch (err) {
        setError('Erro ao carregar estados');
        console.error('Error loading states:', err);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Function to load cities by state
  const loadCitiesByState = async (stateCode: string) => {
    try {
      setLoadingCities(true);
      setError(null);
      const citiesData = await fetchCitiesByState(stateCode);
      setCities(citiesData);
    } catch (err) {
      setError('Erro ao carregar cidades');
      console.error('Error loading cities:', err);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  return {
    states,
    cities,
    loadingStates,
    loadingCities,
    error,
    loadCitiesByState,
  };
};