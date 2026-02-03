"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Eye } from "lucide-react"
import { FlowNode } from "./flow-node"

const nodes = [
  { id: "1", type: "trigger", label: "Webhook HTTP", color: "bg-primary" },
  { id: "2", type: "action", label: "Validar datos", color: "bg-secondary" },
  { id: "3", type: "action", label: "Consultar DB", color: "bg-accent" },
  { id: "4", type: "condition", label: "Verificar resultado", color: "bg-yellow-500" },
  { id: "5", type: "output", label: "Enviar notificación", color: "bg-green-500" },
]

export function FlowPreview() {
  return (
    <Card className="glass border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Previsualización</h2>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Play className="h-4 w-4 mr-2" />
          Probar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {nodes.map((node, index) => (
            <div key={node.id}>
              <FlowNode node={node} />
              {index < nodes.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-6 bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full glass border-border hover:border-primary/50 bg-transparent">
          Editar en constructor visual
        </Button>
      </div>
    </Card>
  )
}
