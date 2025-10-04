import {
  DisasterAlert,
  HealthRiskAlert,
  Location,
  AlertPreferences,
} from "@/types/alerts";

// Mock data para desastres naturais
const mockDisasterAlerts: DisasterAlert[] = [
  {
    id: "disaster-1",
    type: "heatwave",
    severity: "high",
    title: "Onda de Calor Intensa",
    description:
      "Temperaturas extremas previstas para os próximos 3 dias. Risco de desidratação e insolação.",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
    },
    distance: 15.2,
    estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
    affectedRadius: 50,
    source: "INMET - Instituto Nacional de Meteorologia",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
    isActive: true,
  },
  {
    id: "disaster-2",
    type: "flood",
    severity: "medium",
    title: "Alerta de Enchente",
    description:
      "Chuvas intensas podem causar alagamentos em áreas baixas da região metropolitana.",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
    },
    distance: 8.5,
    affectedRadius: 25,
    source: "CEMADEN - Centro Nacional de Monitoramento e Alertas",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    isActive: true,
  },
  {
    id: "disaster-3",
    type: "storm",
    severity: "low",
    title: "Tempestade com Ventos Fortes",
    description: "Ventos de até 80 km/h previstos para a tarde de hoje.",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
    },
    distance: 5.1,
    affectedRadius: 15,
    source: "INMET - Instituto Nacional de Meteorologia",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
    isActive: true,
  },
];

// Mock data para condições de saúde
const mockHealthConditions = [
  {
    id: "asthma",
    name: "Asma",
    severity: "moderate" as const,
    affectedSystems: ["respiratory"],
  },
  {
    id: "copd",
    name: "DPOC",
    severity: "severe" as const,
    affectedSystems: ["respiratory"],
  },
  {
    id: "heart-disease",
    name: "Doença Cardíaca",
    severity: "severe" as const,
    affectedSystems: ["cardiovascular"],
  },
  {
    id: "diabetes",
    name: "Diabetes",
    severity: "moderate" as const,
    affectedSystems: ["metabolic"],
  },
];

// Mock data para alertas de saúde
const mockHealthAlerts: HealthRiskAlert[] = [
  {
    id: "health-1",
    condition: mockHealthConditions[0], // Asma
    riskLevel: "high",
    title: "Risco Elevado para Asma",
    description:
      "A qualidade do ar está prejudicada devido à poluição e condições climáticas. Pessoas com asma devem evitar atividades ao ar livre.",
    recommendations: [
      "Evite atividades físicas ao ar livre",
      "Mantenha as janelas fechadas",
      "Use máscara se necessário sair",
      "Monitore seus sintomas regularmente",
      "Mantenha o inalador sempre por perto",
    ],
    affectedBy: {
      airQuality: {
        aqi: 156,
        pollutants: ["PM2.5", "O3", "NO2"],
      },
      weather: {
        temperature: 32,
        humidity: 85,
      },
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min atrás
    isActive: true,
  },
  {
    id: "health-2",
    condition: mockHealthConditions[1], // DPOC
    riskLevel: "critical",
    title: "Alerta Crítico para DPOC",
    description:
      "Condições extremas de calor e umidade podem agravar significativamente os sintomas de DPOC.",
    recommendations: [
      "Fique em ambientes climatizados",
      "Evite sair de casa entre 10h e 16h",
      "Mantenha-se hidratado",
      "Use oxigênio suplementar se prescrito",
      "Contate seu médico se os sintomas piorarem",
    ],
    affectedBy: {
      airQuality: {
        aqi: 180,
        pollutants: ["PM2.5", "PM10"],
      },
      weather: {
        temperature: 35,
        humidity: 90,
      },
      disaster: {
        type: "heatwave",
        distance: 15.2,
      },
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min atrás
    isActive: true,
  },
  {
    id: "health-3",
    condition: mockHealthConditions[2], // Doença Cardíaca
    riskLevel: "medium",
    title: "Atenção para Doenças Cardíacas",
    description:
      "Temperaturas extremas podem aumentar o risco de eventos cardiovasculares.",
    recommendations: [
      "Evite esforços físicos intensos",
      "Mantenha-se hidratado",
      "Evite bebidas alcoólicas",
      "Monitore sua pressão arterial",
      "Procure atendimento se sentir dor no peito",
    ],
    affectedBy: {
      weather: {
        temperature: 38,
        humidity: 75,
      },
      disaster: {
        type: "heatwave",
        distance: 15.2,
      },
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
    isActive: true,
  },
];

export class AlertService {
  private static instance: AlertService;
  private alerts: (DisasterAlert | HealthRiskAlert)[] = [];
  private userLocation: Location | null = null;
  private userHealthConditions: string[] = [];

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  // Simula login do usuário e carrega alertas
  async loginUser(
    userLocation: Location,
    healthConditions: string[] = []
  ): Promise<{
    disasterAlerts: DisasterAlert[];
    healthAlerts: HealthRiskAlert[];
  }> {
    this.userLocation = userLocation;
    this.userHealthConditions = healthConditions;

    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Filtra alertas baseado na localização e condições de saúde
    const relevantDisasterAlerts = this.filterDisasterAlertsByLocation(
      mockDisasterAlerts,
      userLocation
    );
    const relevantHealthAlerts = this.filterHealthAlertsByConditions(
      mockHealthAlerts,
      healthConditions
    );

    this.alerts = [...relevantDisasterAlerts, ...relevantHealthAlerts];

    return {
      disasterAlerts: relevantDisasterAlerts,
      healthAlerts: relevantHealthAlerts,
    };
  }

  // Filtra alertas de desastres pela localização
  private filterDisasterAlertsByLocation(
    alerts: DisasterAlert[],
    userLocation: Location
  ): DisasterAlert[] {
    return alerts.filter((alert) => {
      // Simula verificação de distância (em uma implementação real, usaria geolocalização)
      return alert.distance <= 50; // 50km de raio
    });
  }

  // Filtra alertas de saúde pelas condições do usuário
  private filterHealthAlertsByConditions(
    alerts: HealthRiskAlert[],
    userConditions: string[]
  ): HealthRiskAlert[] {
    return alerts.filter((alert) => {
      return userConditions.includes(alert.condition.id);
    });
  }

  // Obtém alertas ativos
  getActiveAlerts(): (DisasterAlert | HealthRiskAlert)[] {
    return this.alerts.filter((alert) => alert.isActive);
  }

  // Marca alerta como dispensado
  dismissAlert(alertId: string): void {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId);
  }

  // Atualiza localização do usuário
  async updateUserLocation(newLocation: Location): Promise<void> {
    this.userLocation = newLocation;
    // Em uma implementação real, recarregaria os alertas
    await this.loginUser(newLocation, this.userHealthConditions);
  }

  // Atualiza condições de saúde do usuário
  async updateHealthConditions(conditions: string[]): Promise<void> {
    this.userHealthConditions = conditions;
    if (this.userLocation) {
      await this.loginUser(this.userLocation, conditions);
    }
  }

  // Simula atualização de alertas em tempo real
  startRealTimeUpdates(
    callback: (alerts: (DisasterAlert | HealthRiskAlert)[]) => void
  ): void {
    // Em uma implementação real, usaria WebSockets ou polling
    setInterval(() => {
      // Simula novos alertas ocasionalmente
      if (Math.random() < 0.1) {
        // 10% de chance a cada intervalo
        callback(this.getActiveAlerts());
      }
    }, 30000); // Verifica a cada 30 segundos
  }

  // Para as atualizações em tempo real
  stopRealTimeUpdates(): void {
    // Implementação real pararia o interval/WebSocket
  }
}

// Instância singleton
export const alertService = AlertService.getInstance();
