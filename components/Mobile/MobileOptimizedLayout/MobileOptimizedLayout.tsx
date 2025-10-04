"use client";

import { ReactNode, useEffect } from "react";
import { useMobileOptimizations } from "@/hooks/useMobileOptimizations";

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileOptimizedLayout({
  children,
  className = "",
}: MobileOptimizedLayoutProps) {
  const { isMobile, isTouch, viewportHeight } = useMobileOptimizations();

  useEffect(() => {
    // Previne scroll horizontal
    const preventHorizontalScroll = () => {
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";

      // Previne scroll horizontal apenas em elementos que podem causar overflow
      const potentialOverflowElements = document.querySelectorAll("img, video, iframe, table, pre, code");
      potentialOverflowElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.style && !htmlElement.closest('[data-preserve-width]')) {
          htmlElement.style.maxWidth = "100%";
        }
      });
    };

    // Otimiza viewport para mobile
    const optimizeViewport = () => {
      if (isMobile) {
        // Ajusta altura da viewport para evitar problemas com browser UI
        const vh = viewportHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      }
    };

    // Previne comportamentos indesejados
    const preventUnwantedBehaviors = () => {
      // Previne pull-to-refresh em alguns browsers
      document.body.style.overscrollBehavior = "contain";

      // Previne zoom em double-tap
      let lastTouchEnd = 0;
      document.addEventListener(
        "touchend",
        (event) => {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    };

    preventHorizontalScroll();
    optimizeViewport();
    preventUnwantedBehaviors();

    // Re-aplica otimizações em mudanças de orientação
    const handleOrientationChange = () => {
      setTimeout(() => {
        preventHorizontalScroll();
        optimizeViewport();
      }, 100);
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [isMobile, viewportHeight]);

  return (
    <div
      className={`
        min-h-screen w-full overflow-x-hidden
        ${isMobile ? "mobile-layout" : ""}
        ${isTouch ? "touch-layout" : ""}
        ${className}
      `}
      style={{
        // Usa altura da viewport otimizada
        minHeight: isMobile ? "calc(var(--vh, 1vh) * 100)" : "100vh",
      }}
    >
      {children}
    </div>
  );
}
