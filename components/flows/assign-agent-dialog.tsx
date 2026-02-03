"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Monitor, CheckCircle2 } from "lucide-react"

interface AssignAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignAgent: (agentId: string) => void
}

const agents = [
  {
    id: "1",
    name: "Agent-Produccion-01",
    os: "Ubuntu 22.04",
    status: "connected",
  },
  {
    id: "2",
    name: "Agent-Desarrollo-01",
    os: "Windows Server 2022",
    status: "connected",
  },
  {
    id: "3",
    name: "Agent-Backup-01",
    os: "Ubuntu 20.04",
    status: "disconnected",
  },
]

export function AssignAgentDialog({ open, onOpenChange, onAssignAgent }: AssignAgentDialogProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAgent) {
      const agent = agents.find((a) => a.id === selectedAgent)
      if (agent) {
        onAssignAgent(agent.name)
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Asignar Agente Local</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Selecciona el agente que ejecutará este flujo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup value={selectedAgent} onValueChange={setSelectedAgent}>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    selectedAgent === agent.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  } ${agent.status === "disconnected" ? "opacity-50" : ""}`}
                >
                  <RadioGroupItem value={agent.id} id={agent.id} disabled={agent.status === "disconnected"} />
                  <Label htmlFor={agent.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        agent.status === "connected" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      <Monitor
                        className={`h-5 w-5 ${agent.status === "connected" ? "text-green-500" : "text-red-500"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{agent.name}</p>
                        {agent.status === "connected" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{agent.os}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="glass border-border">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 neon-glow" disabled={!selectedAgent}>
              Asignar y publicar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
