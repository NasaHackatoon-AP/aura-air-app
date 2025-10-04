export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

export interface DisasterAlert {
  id: string;
  type:
    | "earthquake"
    | "flood"
    | "wildfire"
    | "hurricane"
    | "tornado"
    | "drought"
    | "heatwave"
    | "storm";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: Location;
  distance: number; // em km
  estimatedArrival?: string; // ISO string
  affectedRadius: number; // em km
  source: string;
  timestamp: string;
  isActive: boolean;
}

export interface HealthCondition {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  affectedSystems: string[];
}

export interface HealthRiskAlert {
  id: string;
  condition: HealthCondition;
  riskLevel: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  recommendations: string[];
  affectedBy: {
    airQuality?: {
      aqi: number;
      pollutants: string[];
    };
    weather?: {
      temperature?: number;
      humidity?: number;
      pressure?: number;
    };
    disaster?: {
      type: string;
      distance: number;
    };
  };
  timestamp: string;
  isActive: boolean;
}

export interface AlertPreferences {
  disasterAlerts: boolean;
  healthAlerts: boolean;
  maxDistance: number; // km
  severityThreshold: "low" | "medium" | "high" | "critical";
  conditions: string[]; // IDs das condições de saúde
}

export type AlertType = DisasterAlert | HealthRiskAlert;
