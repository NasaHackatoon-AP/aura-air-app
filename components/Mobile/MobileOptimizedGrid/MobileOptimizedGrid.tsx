"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMobileOptimizations } from "@/hooks/useMobileOptimizations";

interface MobileOptimizedGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: string;
    desktop?: string;
  };
}

export function MobileOptimizedGrid({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: "gap-3", desktop: "gap-6" },
}: MobileOptimizedGridProps) {
  const { isMobile } = useMobileOptimizations();

  const gridCols = `grid-cols-${cols.mobile} sm:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;
  const gridGap = isMobile ? gap.mobile : gap.desktop;

  return (
    <div
      className={cn(
        "grid w-full",
        gridCols,
        gridGap,
        // Previne overflow horizontal
        "max-w-full overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
