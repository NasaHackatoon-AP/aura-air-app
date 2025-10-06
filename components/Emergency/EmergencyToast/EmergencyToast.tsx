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
      return "border-l-red-500 bg-gradient-to-r from-red-500/10 via-red-50 to-red-100 dark:from-red-900/20 dark:via-red-950 dark:to-red-900 text-red-900 dark:text-red-100 shadow-lg shadow-red-200/50 dark:shadow-red-900/30";
    case "high":
      return "border-l-orange-500 bg-gradient-to-r from-orange-500/10 via-orange-50 to-orange-100 dark:from-orange-900/20 dark:via-orange-950 dark:to-orange-900 text-orange-900 dark:text-orange-100 shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30";
    case "medium":
      return "border-l-yellow-500 bg-gradient-to-r from-yellow-500/10 via-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:via-yellow-950 dark:to-yellow-900 text-yellow-900 dark:text-yellow-100 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30";
    case "low":
      return "border-l-blue-500 bg-gradient-to-r from-blue-500/10 via-blue-50 to-blue-100 dark:from-blue-900/20 dark:via-blue-950 dark:to-blue-900 text-blue-900 dark:text-blue-100 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30";
    default:
      return "border-l-gray-500 bg-gradient-to-r from-gray-500/10 via-gray-50 to-gray-100 dark:from-gray-900/20 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "critical":
      return (
        <div className="p-2 rounded-full bg-red-500 text-white shadow-lg animate-pulse">
          <AlertTriangle className="h-4 w-4" />
        </div>
      );
    case "high":
      return (
        <div className="p-2 rounded-full bg-orange-500 text-white shadow-md">
          <AlertTriangle className="h-4 w-4" />
        </div>
      );
    case "medium":
      return (
        <div className="p-2 rounded-full bg-yellow-500 text-white shadow-md">
          <Bell className="h-4 w-4" />
        </div>
      );
    case "low":
      return (
        <div className="p-2 rounded-full bg-blue-500 text-white shadow-md">
          <Bell className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-full bg-gray-500 text-white shadow-md">
          <Bell className="h-4 w-4" />
        </div>
      );
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
      className={`border-l-8 rounded-xl backdrop-blur-sm ${getPriorityColor(
        notification.priority
      )} transition-all duration-500 hover:scale-105 ${
        isVisible
          ? "opacity-100 translate-x-0 animate-in slide-in-from-right-full"
          : "opacity-0 translate-x-full animate-out slide-out-to-right-full"
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {getPriorityIcon(notification.priority)}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h4 className="font-bold text-base truncate">
                  {notification.title}
                </h4>
                <Badge
                  variant={
                    notification.priority === "critical"
                      ? "destructive"
                      : notification.priority === "high"
                      ? "default"
                      : "secondary"
                  }
                  className={`text-xs w-fit font-semibold ${
                    notification.priority === "critical"
                      ? "animate-pulse bg-red-600 text-white"
                      : notification.priority === "high"
                      ? "bg-orange-600 text-white"
                      : ""
                  }`}
                >
                  {notification.priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm font-medium opacity-90 mb-3 line-clamp-3 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium opacity-75">
                <div className="flex items-center gap-1.5 bg-white/20 dark:bg-black/20 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(notification.timestamp)}
                </div>
                {notification.data && (
                  <>
                    <div className="flex items-center gap-1.5 bg-white/20 dark:bg-black/20 px-2 py-1 rounded-full">
                      <MapPin className="h-3 w-3" />
                      {notification.data.distance?.toFixed(1)}km
                    </div>
                    {notification.data.affectedPopulation && (
                      <div className="flex items-center gap-1.5 bg-white/20 dark:bg-black/20 px-2 py-1 rounded-full">
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
          <div className="flex flex-col sm:flex-row items-center gap-2 ml-2">
            {notification.data && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewDetails}
                className="h-8 text-xs px-3 bg-white/40 dark:bg-black/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-black/60 border border-white/20 dark:border-black/20"
              >
                <ExternalLink className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Detalhes</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
