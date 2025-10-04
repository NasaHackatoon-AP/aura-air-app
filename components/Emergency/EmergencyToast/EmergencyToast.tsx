"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  X,
  Bell,
  MapPin,
  Clock,
  Users,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  EmergencyNotification,
  EmergencyAlert,
} from "@/services/emergencyService";

interface EmergencyToastProps {
  notification: EmergencyNotification;
  onDismiss: (id: string) => void;
  onViewDetails: (alert: EmergencyAlert) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "border-red-500 bg-red-50 text-red-900";
    case "high":
      return "border-orange-500 bg-orange-50 text-orange-900";
    case "medium":
      return "border-yellow-500 bg-yellow-50 text-yellow-900";
    case "low":
      return "border-blue-500 bg-blue-50 text-blue-900";
    default:
      return "border-gray-500 bg-gray-50 text-gray-900";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "critical":
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    case "high":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "medium":
      return <Bell className="h-4 w-4 text-yellow-600" />;
    case "low":
      return <Bell className="h-4 w-4 text-blue-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Agora mesmo";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Há ${minutes} min`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Há ${hours}h`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `Há ${days} dia${days > 1 ? "s" : ""}`;
  }
};

export function EmergencyToast({
  notification,
  onDismiss,
  onViewDetails,
}: EmergencyToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10); // 10 segundos para auto-dismiss

  useEffect(() => {
    if (notification.priority === "critical") {
      return; // Não auto-dismiss alertas críticos
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          setTimeout(() => onDismiss(notification.id), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [notification.id, notification.priority, onDismiss]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const handleViewDetails = () => {
    if (notification.data) {
      onViewDetails(notification.data);
    }
  };

  return (
    <Card
      className={`border-l-4 ${getPriorityColor(
        notification.priority
      )} transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            {getPriorityIcon(notification.priority)}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <h4 className="font-semibold text-sm truncate">
                  {notification.title}
                </h4>
                <Badge
                  variant={
                    notification.priority === "critical"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs w-fit"
                >
                  {notification.priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(notification.timestamp)}
                </div>
                {notification.data && (
                  <>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {notification.data.distance?.toFixed(1)}km
                    </div>
                    {notification.data.affectedPopulation && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="hidden sm:inline">
                          {notification.data.affectedPopulation.toLocaleString()}
                        </span>
                        <span className="sm:hidden">
                          {notification.data.affectedPopulation > 1000
                            ? `${Math.floor(
                                notification.data.affectedPopulation / 1000
                              )}k`
                            : notification.data.affectedPopulation}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
            {notification.data && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="h-7 sm:h-8 text-xs px-2 sm:px-3"
              >
                <ExternalLink className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Ver</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {notification.priority !== "critical" && timeLeft > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
