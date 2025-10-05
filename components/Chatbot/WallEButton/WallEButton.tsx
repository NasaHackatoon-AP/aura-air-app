"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import chatbotService from "@/services/chatbotService";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/contexts/ModalContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function WallEButton() {
  const pathname = usePathname();
  const { isAnyModalOpen, openModal, closeModal } = useModal();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ from: "user" | "bot"; text: string }>
  >([
    {
      from: "bot",
      text: "Olá! Sou o Wall-E, seu assistente de IA para monitoramento de qualidade do ar. Como posso ajudá-lo hoje?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Efeito para scroll automático sempre que as mensagens mudarem
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages]);

  // Efeito para scroll automático quando o chat for aberto
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(), 300);
    }
  }, [isOpen]);

  // Efeito para scroll automático quando o loading state mudar (bot digitando)
  useEffect(() => {
    if (loading) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [loading]);

  // Hide chatbot on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  // Hide chatbot on mobile when any modal is open
  if (isMobile && isAnyModalOpen) return null;

  const handleCloseChat = () => {
    setIsOpen(false);
    closeModal("chatbot");
  };

  async function handleSend() {
    const text = texto.trim();
    if (!text || loading) return; // Evita execução se já estiver carregando

    // Adiciona a mensagem do usuário ao estado
    setMessages((prev) => [...prev, { from: "user", text }]);
    setTexto("");
    setLoading(true);

    // Scroll imediato para mostrar a mensagem do usuário
    setTimeout(() => scrollToBottom(), 50);

    try {
      const res = await chatbotService.sendMessage({ texto: text });

      // Simula um delay natural baseado no tamanho da resposta
      const responseText =
        res?.resposta || (typeof res === "string" ? res : "");
      const baseDelay = 800;
      const textDelay = Math.min(responseText.length * 20, 2000); // 20ms por caractere, máximo 2s
      const randomDelay = Math.random() * 500; // 0-500ms aleatório

      await new Promise((resolve) =>
        setTimeout(resolve, baseDelay + textDelay + randomDelay)
      );

      // Processa a resposta - apenas adiciona a resposta do bot, não o histórico completo
      if (res && (res.resposta || typeof res === "string")) {
        const botText = typeof res === "string" ? res : res.resposta;

        setMessages((prev) => {
          // Verifica se a última mensagem já é a mesma resposta do bot para evitar duplicação
          const last = prev[prev.length - 1];
          if (last && last.from === "bot" && last.text === botText) return prev;

          return [...prev, { from: "bot", text: botText }];
        });
      }
    } catch (err) {
      console.error("chatbot error", err);

      // Delay também para mensagens de erro
      await new Promise((resolve) => setTimeout(resolve, 800));

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Desculpe, houve um erro ao enviar sua mensagem.",
        },
      ]);
    } finally {
      setLoading(false);
      // Garantir que o scroll aconteça após a renderização da resposta
      setTimeout(() => scrollToBottom(), 100);
    }
  }

  function scrollToBottom() {
    if (!scrollRef.current) return;

    // Scroll suave para o final da conversa
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[60]"
          >
            <Button
              data-chatbot-button
              onClick={() => {
                setIsOpen(true);
                openModal("chatbot");
              }}
              className={cn(
                "h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl",
                "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                "text-white border-2 border-white/20 backdrop-blur-sm",
                "transition-all duration-300 hover:scale-110",
                "flex items-center justify-center",
                "min-h-[56px] min-w-[56px] sm:min-h-[64px] sm:min-w-[64px]",
                "pointer-events-auto floating-button"
              )}
              size="icon"
            >
              <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

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
              onClick={handleCloseChat}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            <motion.div
              className="relative w-full max-w-md h-[400px] sm:h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden backdrop-blur-sm chat-container modal-enter"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Wall-E</h3>
                    <p className="text-xs text-blue-100">Assistente de IA</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseChat}
                  className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 chat-messages chat-background"
              >
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    className={`flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    } gap-3 max-w-full overflow-hidden`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    {m.from === "bot" && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-md p-3 max-w-[75%] shadow-sm border border-slate-200 dark:border-slate-700 message-bubble message-enter overflow-hidden min-w-0">
                          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed break-words overflow-hidden" style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word'
                          }}>
                            {m.text}
                          </p>
                        </div>
                      </>
                    )}

                    {m.from === "user" && (
                      <div className="flex items-end gap-3 max-w-full overflow-hidden">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md p-3 max-w-[75%] shadow-md message-bubble message-enter overflow-hidden min-w-0">
                          <p className="text-sm leading-relaxed overflow-hidden" style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word'
                          }}>
                            {m.text}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center flex-shrink-0 shadow-md">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    className="flex justify-start gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-md p-3 shadow-sm border border-slate-200 dark:border-slate-700 message-bubble typing-container">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full typing-indicator"></div>
                        <div className="w-2 h-2 rounded-full typing-indicator"></div>
                        <div className="w-2 h-2 rounded-full typing-indicator"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-4 sm:p-6 border-t bg-white dark:bg-slate-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-sm chat-input disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    size="sm"
                    className="px-4 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={handleSend}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
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
