"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles } from "lucide-react"
import { ChatMessage } from "./chat-message"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hola! Soy tu asistente de IA para crear flujos de automatización. Describe el proceso que quieres automatizar y yo lo convertiré en un flujo funcional.",
    timestamp: new Date(),
  },
]

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Perfecto! He analizado tu solicitud y estoy generando un flujo de automatización. El flujo incluirá:\n\n1. Trigger: Webhook HTTP\n2. Acción: Validar datos de entrada\n3. Acción: Consultar base de datos\n4. Condición: Verificar resultado\n5. Salida: Enviar notificación\n\nPuedes ver la previsualización del flujo en el panel derecho. ¿Quieres que ajuste algo?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Card className="glass border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Constructor IA</h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confianza del modelo:</span>
          <span className="text-sm font-semibold text-green-500">94%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            <span className="text-sm">La IA está pensando...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe el flujo que quieres crear..."
            className="glass border-border focus:border-primary bg-transparent"
          />
          <Button onClick={handleSend} disabled={isLoading} className="bg-primary hover:bg-primary/90 neon-glow">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
