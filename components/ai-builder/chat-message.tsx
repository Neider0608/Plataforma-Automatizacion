import { User, Bot } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
          isUser ? "bg-secondary/20" : "bg-primary/20"
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-secondary" /> : <Bot className="h-4 w-4 text-primary" />}
      </div>

      <div className={`flex-1 ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`inline-block p-3 rounded-lg max-w-[80%] ${
            isUser ? "bg-secondary/20 text-foreground" : "bg-primary/10 text-foreground"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
