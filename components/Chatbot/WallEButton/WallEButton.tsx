"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import chatbotService from "@/services/chatbotService";
import { motion, AnimatePresence } from "framer-motion";

export function WallEButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: "user" | "bot"; text: string }>>([
    {
      from: "bot",
      text: "Olá! Sou o Wall-E, seu assistente de IA para monitoramento de qualidade do ar. Como posso ajudá-lo hoje?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Hide chatbot on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  async function handleSend() {
    const text = texto.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setTexto("");
    setLoading(true);

    try {
      const res = await chatbotService.sendMessage({ texto: text });

      // If the API returns a history, prefer it (it likely contains the
      // conversation including the current bot reply). If not, use `res.resposta`.
      if (res && Array.isArray(res.historico) && res.historico.length > 0) {
        const histMsgs: Array<{ from: "user" | "bot"; text: string }> = [];
        res.historico.forEach((h: any) => {
          if (h.usuario) histMsgs.push({ from: "user", text: h.usuario });
          if (h.bot) histMsgs.push({ from: "bot", text: h.bot });
        });
        setMessages((prev) => [...prev, ...histMsgs]);
      } else if (res && (res.resposta || typeof res === "string")) {
        const botText = typeof res === "string" ? res : res.resposta;
        // avoid appending duplicate bot message if it's already the last one
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.from === "bot" && last.text === botText) return prev;
          return [...prev, { from: "bot", text: botText }];
        });
      }
    } catch (err) {
      console.error("chatbot error", err);
      setMessages((prev) => [...prev, { from: "bot", text: "Desculpe, houve um erro ao enviar sua mensagem." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollToBottom(), 50);
    }
  }

  function scrollToBottom() {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
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

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-2 sm:items-center sm:justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 chatbot-overlay"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            <motion.div
              className="relative w-full max-w-md h-[400px] sm:h-[500px] bg-background rounded-lg shadow-xl border flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Wall-E</h3>
                    <p className="text-xs text-muted-foreground">Assistente de IA</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7 sm:h-8 sm:w-8">
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              <div ref={scrollRef} className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.from === "user" ? "justify-end" : "items-start"} gap-2`}>
                    {m.from === "bot" && (
                      <>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[80%]">
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </>
                    )}

                    {m.from === "user" && (
                      <div className="flex items-end gap-2">
                        <div className="bg-primary text-primary-foreground rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[80%]">
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 sm:p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        await handleSend();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm" className="px-2 sm:px-3 h-8 sm:h-9" onClick={handleSend} disabled={loading}>
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
