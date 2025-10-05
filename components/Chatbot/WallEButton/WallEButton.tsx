"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function WallEButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Não mostrar o chatbot na página de login
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      {/* Botão Flutuante */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[60]"
      >
        <Button
          data-chatbot-button
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "transition-all duration-300 hover:scale-110",
            "flex items-center justify-center",
            "min-h-[48px] min-w-[48px] sm:min-h-[56px] sm:min-w-[56px]",
            "pointer-events-auto"
          )}
          size="icon"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </motion.div>

      {/* Modal do Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-2 sm:items-center sm:justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overlay com desfoque */}
            <motion.div
              className="absolute inset-0 bg-black/50 chatbot-overlay"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            />

            {/* Chat Container com animação */}
            <motion.div
              className="relative w-full max-w-md h-[400px] sm:h-[500px] bg-background rounded-lg shadow-xl border flex flex-col"
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      Wall-E
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Assistente de IA
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[80%]">
                    <p className="text-xs sm:text-sm">
                      Olá! Sou o Wall-E, seu assistente de IA para monitoramento
                      de qualidade do ar. Como posso ajudá-lo hoje?
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm" className="px-2 sm:px-3 h-8 sm:h-9">
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
