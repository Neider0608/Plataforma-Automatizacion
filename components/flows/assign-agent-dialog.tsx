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
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Monitor, CheckCircle2, Database, Globe, Mail, HardDrive, Terminal, Cpu, Activity } from "lucide-react"

type AgentCapability = "database" | "http" | "email" | "file" | "script"

interface AssignAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignAgent: (agentId: string) => void
}

const agents = [
  {
    id: "agent-prod-01",
    name: "Agent-Produccion-01",
    os: "Ubuntu 22.04 LTS",
    status: "busy" as const,
    cpu: "34%",
    memory: "45%",
    capabilities: ["database", "http", "email", "script"] as AgentCapability[],
    currentFlow: "Procesamiento de Facturas",
  },
  {
    id: "agent-dev-01",
    name: "Agent-Desarrollo-01",
    os: "Windows Server 2022",
    status: "connected" as const,
    cpu: "8%",
    memory: "32%",
    capabilities: ["database", "http", "file"] as AgentCapability[],
  },
  {
    id: "agent-backup-01",
    name: "Agent-Backup-01",
    os: "Ubuntu 20.04 LTS",
    status: "disconnected" as const,
    cpu: "0%",
    memory: "0%",
    capabilities: ["database", "file"] as AgentCapability[],
  },
]

const getCapabilityIcon = (cap: AgentCapability) => {
  switch (cap) {
    case "database": return <Database className="h-3 w-3" />
    case "http": return <Globe className="h-3 w-3" />
    case "email": return <Mail className="h-3 w-3" />
    case "file": return <HardDrive className="h-3 w-3" />
    case "script": return <Terminal className="h-3 w-3" />
  }
}

const getStatusColor = (status: "connected" | "disconnected" | "busy") => {
  switch (status) {
    case "connected": return "bg-green-500"
    case "busy": return "bg-yellow-500"
    case "disconnected": return "bg-red-500"
  }
}

const getStatusText = (status: "connected" | "disconnected" | "busy") => {
  switch (status) {
    case "connected": return "Disponible"
    case "busy": return "Ejecutando"
    case "disconnected": return "Desconectado"
  }
}

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
                        agent.status === "connected" ? "bg-green-500/20" : 
                        agent.status === "busy" ? "bg-yellow-500/20" : "bg-red-500/20"
                      }`}
                    >
                      <Monitor
                        className={`h-5 w-5 ${
                          agent.status === "connected" ? "text-green-500" : 
                          agent.status === "busy" ? "text-yellow-500" : "text-red-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{agent.name}</p>
                        <Badge className={`${getStatusColor(agent.status)} text-white text-[10px] px-1.5`}>
                          {getStatusText(agent.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{agent.os}</p>
                      
                      {agent.status === "busy" && agent.currentFlow && (
                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 mb-2">
                          <Activity className="h-3 w-3 animate-pulse" />
                          <span>Ejecutando: {agent.currentFlow}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          CPU: {agent.cpu}
                        </span>
                        <span>RAM: {agent.memory}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap) => (
                          <Badge key={cap} variant="outline" className="text-[9px] px-1 py-0 gap-0.5">
                            {getCapabilityIcon(cap)}
                            {cap}
                          </Badge>
                        ))}
                      </div>
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
