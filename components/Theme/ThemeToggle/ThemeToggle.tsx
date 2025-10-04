"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TouchOptimizedButton } from "@/components/Mobile/TouchOptimizedButton/TouchOptimizedButton";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
}

export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case "light":
        return "Modo Claro";
      case "dark":
        return "Modo Escuro";
      case "system":
        return "Seguir Sistema";
      default:
        return "Alternar Tema";
    }
  };

  return (
    <TouchOptimizedButton
      variant={variant}
      size={size}
      onClick={toggleTheme}
      title={getTitle()}
      className={cn(
        "transition-colors duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {getIcon()}
    </TouchOptimizedButton>
  );
}
