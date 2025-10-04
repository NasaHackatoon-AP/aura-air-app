import { DisasterAlert, HealthRiskAlert, Location } from "@/types/alerts";

export interface EmergencyNotification {
  id: string;
  type: "disaster" | "health" | "system";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  actionUrl?: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export interface EmergencyAlert extends DisasterAlert {
  isEmergency: true;
  emergencyLevel: "immediate" | "urgent" | "warning";
  broadcastRadius: number; // km
  affectedPopulation: number;
  evacuationRequired?: boolean;
  shelterLocations?: Array<{
    name: string;
    address: string;
    capacity: number;
    coordinates: { lat: number; lng: number };
  }>;
}

class EmergencyService {
  private static instance: EmergencyService;
  private listeners: Array<(notification: EmergencyNotification) => void> = [];
  private emergencyAlerts: EmergencyAlert[] = [];
  private notifications: EmergencyNotification[] = [];
  private isListening = false;

  static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  // Simula alertas de emergência em tempo real
  startEmergencyMonitoring(): void {
    if (this.isListening) return;

    this.isListening = true;

    // Simula alertas de emergência a cada 2-5 minutos (apenas quando ativado manualmente)
    const generateEmergencyAlert = () => {
      const alertTypes = [
        {
          type: "earthquake",
          title: "TERREMOTO DETECTADO",
          message:
            "Tremor de magnitude 5.2 detectado na região. Procure abrigo imediatamente.",
          emergencyLevel: "immediate" as const,
          priority: "critical" as const,
        },
        {
          type: "flood",
          title: "ALERTA DE ENCHENTE",
          message:
            "Nível do rio subiu 2 metros em 1 hora. Evacuação recomendada.",
          emergencyLevel: "urgent" as const,
          priority: "high" as const,
        },
        {
          type: "wildfire",
          title: "INCÊNDIO FLORESTAL",
          message:
            "Fogo se aproxima da área urbana. Prepare-se para evacuação.",
          emergencyLevel: "urgent" as const,
          priority: "high" as const,
        },
        {
          type: "storm",
          title: "TORNADO DETECTADO",
          message:
            "Tornado categoria F2 se aproximando. Procure abrigo subterrâneo.",
          emergencyLevel: "immediate" as const,
          priority: "critical" as const,
        },
        {
          type: "heatwave",
          title: "ONDA DE CALOR EXTREMA",
          message:
            "Temperaturas podem chegar a 45°C. Risco de morte por hipertermia.",
          emergencyLevel: "urgent" as const,
          priority: "high" as const,
        },
      ];

      const randomAlert =
        alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const now = new Date();

      const emergencyAlert: EmergencyAlert = {
        id: `emergency-${Date.now()}`,
        type: randomAlert.type as any,
        severity: randomAlert.priority === "critical" ? "critical" : "high",
        title: randomAlert.title,
        description: randomAlert.message,
        location: {
          latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
          longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
        },
        distance: Math.random() * 20,
        affectedRadius: 15 + Math.random() * 30,
        source: "Sistema de Emergência Nacional",
        timestamp: now.toISOString(),
        isActive: true,
        isEmergency: true,
        emergencyLevel: randomAlert.emergencyLevel,
        broadcastRadius: 50,
        affectedPopulation: Math.floor(Math.random() * 100000) + 10000,
        evacuationRequired: randomAlert.emergencyLevel === "immediate",
        shelterLocations:
          randomAlert.emergencyLevel === "immediate"
            ? [
                {
                  name: "Ginásio Municipal",
                  address: "Rua das Flores, 123",
                  capacity: 500,
                  coordinates: { lat: -23.5505, lng: -46.6333 },
                },
              ]
            : undefined,
      };

      this.emergencyAlerts.push(emergencyAlert);

      // Cria notificação
      const notification: EmergencyNotification = {
        id: `notification-${Date.now()}`,
        type: "disaster",
        priority: randomAlert.priority,
        title: randomAlert.title,
        message: randomAlert.message,
        timestamp: now.toISOString(),
        isRead: false,
        data: emergencyAlert,
      };

      this.notifications.push(notification);

      // Notifica todos os listeners
      this.listeners.forEach((listener) => listener(notification));

      // Auto-remove notificação após 1 hora
      setTimeout(() => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notification.id
        );
      }, 60 * 60 * 1000);
    };

    // Gera primeiro alerta em 30 segundos
    setTimeout(generateEmergencyAlert, 30000);

    // Gera alertas a cada 2-5 minutos
    const scheduleNext = () => {
      const delay = (2 + Math.random() * 3) * 60 * 1000; // 2-5 minutos
      setTimeout(() => {
        if (this.isListening) {
          generateEmergencyAlert();
          scheduleNext();
        }
      }, delay);
    };

    scheduleNext();
  }

  stopEmergencyMonitoring(): void {
    this.isListening = false;
  }

  // Adiciona listener para notificações
  addListener(
    listener: (notification: EmergencyNotification) => void
  ): () => void {
    this.listeners.push(listener);

    // Retorna função para remover o listener
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Obtém notificações não lidas
  getUnreadNotifications(): EmergencyNotification[] {
    return this.notifications.filter((n) => !n.isRead);
  }

  // Marca notificação como lida
  markAsRead(notificationId: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
  }

  // Obtém alertas de emergência ativos
  getActiveEmergencyAlerts(): EmergencyAlert[] {
    return this.emergencyAlerts.filter((alert) => alert.isActive);
  }

  // Simula notificação push do navegador
  async requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta notificações");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  // Envia notificação push do navegador
  sendPushNotification(notification: EmergencyNotification): void {
    if (Notification.permission === "granted") {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/placeholder-logo.png",
        badge: "/placeholder-logo.png",
        tag: notification.id,
        requireInteraction: notification.priority === "critical",
        silent: notification.priority === "low",
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      // Auto-close após 10 segundos (exceto críticos)
      if (notification.priority !== "critical") {
        setTimeout(() => browserNotification.close(), 10000);
      }
    }
  }

  // Simula alerta de sistema (manutenção, falhas, etc.)
  createSystemAlert(
    title: string,
    message: string,
    priority: "low" | "medium" | "high" | "critical" = "medium"
  ): void {
    const notification: EmergencyNotification = {
      id: `system-${Date.now()}`,
      type: "system",
      priority,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    this.notifications.push(notification);
    this.listeners.forEach((listener) => listener(notification));
  }

  // Limpa notificações antigas
  cleanupOldNotifications(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.notifications = this.notifications.filter(
      (n) => new Date(n.timestamp) > oneDayAgo
    );
  }
}

export const emergencyService = EmergencyService.getInstance();
