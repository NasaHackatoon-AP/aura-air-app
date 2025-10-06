"use client";

import { useEffect, useState, useRef } from "react";

export function useMobileOptimizations() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    // Detecta se é mobile
    const checkMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      const isSmallScreen = window.innerWidth <= 768;
      const newIsMobile = isMobileDevice || isSmallScreen;
      isMobileRef.current = newIsMobile;
      setIsMobile(newIsMobile);
    };

    // Detecta se suporta touch
    const checkTouch = () => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };

    // Atualiza altura da viewport (importante para mobile)
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    // Previne zoom em inputs no iOS
    const preventZoom = () => {
      const inputs = document.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.addEventListener("focus", () => {
          if (isMobileRef.current) {
            (input as HTMLElement).style.fontSize = "16px";
          }
        });
      });
    };

    // Previne scroll horizontal
    const preventHorizontalScroll = () => {
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";
    };

    // Otimiza performance de scroll
    const optimizeScroll = () => {
      if (isMobileRef.current) {
        (document.body.style as any).webkitOverflowScrolling = "touch";
      }
    };

    // Handler para resize
    const handleResize = () => {
      checkMobile();
      updateViewportHeight();
    };

    // Handler para orientação
    const handleOrientationChange = () => {
      setTimeout(() => {
        updateViewportHeight();
        preventHorizontalScroll();
      }, 100);
    };

    // Inicializa
    checkMobile();
    checkTouch();
    updateViewportHeight();
    preventHorizontalScroll();
    optimizeScroll();

    // Event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Previne zoom em inputs após carregamento
    setTimeout(preventZoom, 1000);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return {
    isMobile,
    isTouch,
    viewportHeight,
    // Utilitários para classes CSS
    mobileClasses: isMobile ? "mobile-optimized" : "",
    touchClasses: isTouch ? "touch-optimized" : "",
  };
}
