"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMobileOptimizations } from "@/hooks/useMobileOptimizations";
import { ReactNode } from "react";

interface TouchOptimizedButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  onClick?: () => void;
  children?: ReactNode;
  touchFeedback?: boolean;
  preventZoom?: boolean;
  asChild?: boolean;
  [key: string]: any;
}

export function TouchOptimizedButton({
  className,
  touchFeedback = true,
  preventZoom = true,
  ...props
}: TouchOptimizedButtonProps) {
  const { isMobile, isTouch } = useMobileOptimizations();

  return (
    <Button
      className={cn(
        // Otimizações base para mobile
        isMobile && "min-h-[44px] min-w-[44px]",
        isTouch && "touch-manipulation",

        // Feedback visual para touch
        touchFeedback &&
          isTouch &&
          "active:scale-95 transition-transform duration-75",

        // Previne zoom em mobile
        preventZoom && isMobile && "text-base",

        // Melhora acessibilidade
        "focus:outline-none focus:ring-2 focus:ring-offset-2",

        className
      )}
      {...props}
    />
  );
}
