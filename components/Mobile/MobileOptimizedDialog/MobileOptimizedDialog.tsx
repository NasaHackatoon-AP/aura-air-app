"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMobileOptimizations } from "@/hooks/useMobileOptimizations";

interface MobileOptimizedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function MobileOptimizedDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: MobileOptimizedDialogProps) {
  const { isMobile, viewportHeight } = useMobileOptimizations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Otimizações para mobile
          isMobile && [
            "max-w-[95vw] max-h-[90vh]",
            "mx-2 my-4",
            "p-4",
            "overflow-y-auto",
            "-webkit-overflow-scrolling: touch",
          ],

          // Otimizações para desktop
          !isMobile && ["max-w-lg max-h-[80vh] overflow-y-auto"],

          className
        )}
        style={{
          // Usa altura da viewport otimizada em mobile
          maxHeight: isMobile ? `calc(${viewportHeight}px - 2rem)` : undefined,
        }}
      >
        <DialogHeader className={cn("pb-4", isMobile && "pb-3")}>
          <DialogTitle
            className={cn("text-lg font-semibold", isMobile && "text-base")}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              className={cn(
                "text-sm text-muted-foreground",
                isMobile && "text-xs"
              )}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={cn("space-y-4", isMobile && "space-y-3")}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
