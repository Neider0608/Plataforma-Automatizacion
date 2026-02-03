"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Monitor, MoreVertical } from "lucide-react"
import { EditAgentDialog } from "./edit-agent-dialog"
import { AddAgentDialog } from "./add-agent-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Agent = {
  id: string
  name: string
  os: string
  status: "connected" | "disconnected"
  lastConnection: string
  executions: number
  cpu: string
  memory: string
}

export function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Agent-Produccion-01",
      os: "Ubuntu 22.04",
      status: "connected",
      lastConnection: "Hace 2 minutos",
      executions: 1247,
      cpu: "12%",
      memory: "45%",
    },
    {
      id: "2",
      name: "Agent-Desarrollo-01",
      os: "Windows Server 2022",
      status: "connected",
      lastConnection: "Hace 5 minutos",
      executions: 342,
      cpu: "8%",
      memory: "32%",
    },
    {
      id: "3",
      name: "Agent-Backup-01",
      os: "Ubuntu 20.04",
      status: "disconnected",
      lastConnection: "Hace 2 horas",
      executions: 89,
      cpu: "0%",
      memory: "0%",
    },
  ])

  const [showEditAgent, setShowEditAgent] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null)

  const handleEditAgent = (agent: Agent) => {
    setAgentToEdit(agent)
    setShowEditAgent(true)
  }

  const handleUpdateAgent = (agentId: string, name: string, os: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              name,
              os,
            }
          : agent,
      ),
    )
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== agentId))
  }

  const handleAddAgent = (name: string, os: string) => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      os,
      status: "disconnected",
      lastConnection: "Nunca",
      executions: 0,
      cpu: "0%",
      memory: "0%",
    }
    setAgents((prev) => [...prev, newAgent])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agentes Locales</h1>
          <p className="text-muted-foreground mt-1">Gestiona los agentes que ejecutan tus flujos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 neon-glow" onClick={() => setShowAddAgent(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar nuevo agente
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="glass border-border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                    agent.status === "connected" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  <Monitor className={`h-6 w-6 ${agent.status === "connected" ? "text-green-500" : "text-red-500"}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                    <Badge variant={agent.status === "connected" ? "default" : "secondary"}>
                      {agent.status === "connected" ? "Conectado" : "Desconectado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.os}</p>
                  <p className="text-xs text-muted-foreground mt-1">Última conexión: {agent.lastConnection}</p>
                </div>

                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ejecuciones</p>
                    <p className="text-2xl font-bold text-foreground">{agent.executions}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="text-2xl font-bold text-foreground">{agent.cpu}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Memoria</p>
                    <p className="text-2xl font-bold text-foreground">{agent.memory}</p>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-border">
                  <DropdownMenuItem onClick={() => handleEditAgent(agent)}>Editar agente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteAgent(agent.id)} className="text-red-500">
                    Eliminar agente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      <EditAgentDialog
        open={showEditAgent}
        onOpenChange={setShowEditAgent}
        agent={agentToEdit}
        onUpdateAgent={handleUpdateAgent}
      />
      <AddAgentDialog open={showAddAgent} onOpenChange={setShowAddAgent} onAddAgent={handleAddAgent} />
    </div>
  )
}
