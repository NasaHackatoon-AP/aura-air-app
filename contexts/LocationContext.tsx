"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface LocationData {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (location: LocationData) => void;
  updateLocation: (
    city: string,
    state: string,
    country: string,
    countryCode: string,
    lat: number,
    lon: number
  ) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocationState] = useState<LocationData>({
    city: "São Paulo",
    state: "SP",
    country: "Brasil",
    countryCode: "BR",
    latitude: -23.5505,
    longitude: -46.6333,
  });

  // Carregar localização salva do localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocationState(parsedLocation);
        console.log(
          "📍 Localização carregada do localStorage:",
          parsedLocation
        );
      } catch (error) {
        console.error("Erro ao carregar localização salva:", error);
      }
    }
  }, []);

  // Salvar localização no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("userLocation", JSON.stringify(location));
    console.log("💾 Localização salva no localStorage:", location);
  }, [location]);

  const setLocation = (newLocation: LocationData) => {
    console.log("🌍 Localização atualizada:", newLocation);
    setLocationState(newLocation);
  };

  const updateLocation = (
    city: string,
    state: string,
    country: string,
    countryCode: string,
    lat: number,
    lon: number
  ) => {
    const newLocation: LocationData = {
      city,
      state,
      country,
      countryCode,
      latitude: lat,
      longitude: lon,
    };

    console.log("🔄 Atualizando localização:", newLocation);
    setLocationState(newLocation);
  };

  const value: LocationContextType = {
    location,
    setLocation,
    updateLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation deve ser usado dentro de um LocationProvider");
  }
  return context;
}
