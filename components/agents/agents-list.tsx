"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Monitor, MoreVertical, Play, Terminal, Database, Globe, Mail, CheckCircle2, XCircle, Clock, Zap, HardDrive, Cpu, Activity } from "lucide-react"
import { EditAgentDialog } from "./edit-agent-dialog"
import { AddAgentDialog } from "./add-agent-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type AgentCapability = "database" | "http" | "email" | "file" | "script"

export type AgentLog = {
  id: string
  timestamp: string
  type: "info" | "success" | "error" | "warning"
  message: string
  flowId?: string
  flowName?: string
}

export type Agent = {
  id: string
  name: string
  os: string
  status: "connected" | "disconnected" | "busy"
  lastConnection: string
  executions: number
  cpu: string
  memory: string
  ip?: string
  version?: string
  capabilities: AgentCapability[]
  currentFlow?: string
  logs: AgentLog[]
  assignedFlows: { id: string; name: string; status: "running" | "paused" | "error" }[]
}

export function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-prod-01",
      name: "Agent-Produccion-01",
      os: "Ubuntu 22.04 LTS",
      status: "busy",
      lastConnection: "Conectado",
      executions: 1247,
      cpu: "34%",
      memory: "45%",
      ip: "192.168.1.100",
      version: "2.4.1",
      capabilities: ["database", "http", "email", "script"],
      currentFlow: "Procesamiento de Facturas",
      logs: [
        { id: "l1", timestamp: "2024-01-20 14:32:15", type: "info", message: "Iniciando flujo: Procesamiento de Facturas", flowId: "2", flowName: "Procesamiento de Facturas" },
        { id: "l2", timestamp: "2024-01-20 14:32:16", type: "success", message: "Trigger email activado - Email recibido de: proveedor@ejemplo.com", flowId: "2", flowName: "Procesamiento de Facturas" },
        { id: "l3", timestamp: "2024-01-20 14:32:18", type: "info", message: "Ejecutando OCR en documento PDF adjunto...", flowId: "2", flowName: "Procesamiento de Facturas" },
        { id: "l4", timestamp: "2024-01-20 14:32:25", type: "success", message: "OCR completado - Datos extraidos: NIT, Fecha, Total", flowId: "2", flowName: "Procesamiento de Facturas" },
        { id: "l5", timestamp: "2024-01-20 14:32:26", type: "info", message: "Ejecutando query: INSERT INTO invoices (nit, fecha, total) VALUES ({{trigger.email.extractedData.nit}}, ...)", flowId: "2", flowName: "Procesamiento de Facturas" },
      ],
      assignedFlows: [
        { id: "2", name: "Procesamiento de Facturas", status: "running" },
        { id: "1", name: "Sincronizacion de Clientes CRM", status: "paused" },
      ],
    },
    {
      id: "agent-dev-01",
      name: "Agent-Desarrollo-01",
      os: "Windows Server 2022",
      status: "connected",
      lastConnection: "Hace 5 minutos",
      executions: 342,
      cpu: "8%",
      memory: "32%",
      ip: "192.168.1.101",
      version: "2.4.1",
      capabilities: ["database", "http", "file"],
      logs: [
        { id: "l1", timestamp: "2024-01-20 14:25:00", type: "success", message: "Flujo completado: Backup Automatico de Datos", flowId: "4", flowName: "Backup Automatico de Datos" },
        { id: "l2", timestamp: "2024-01-20 14:20:12", type: "info", message: "SELECT * FROM users WHERE last_login > {{trigger.schedule.executionTime - 24h}}", flowId: "4", flowName: "Backup Automatico de Datos" },
        { id: "l3", timestamp: "2024-01-20 14:20:15", type: "success", message: "Resultado: 156 filas obtenidas", flowId: "4", flowName: "Backup Automatico de Datos" },
      ],
      assignedFlows: [
        { id: "4", name: "Backup Automatico de Datos", status: "paused" },
      ],
    },
    {
      id: "agent-backup-01",
      name: "Agent-Backup-01",
      os: "Ubuntu 20.04 LTS",
      status: "disconnected",
      lastConnection: "Hace 2 horas",
      executions: 89,
      cpu: "0%",
      memory: "0%",
      ip: "192.168.1.102",
      version: "2.3.8",
      capabilities: ["database", "file"],
      logs: [
        { id: "l1", timestamp: "2024-01-20 12:30:00", type: "error", message: "Error de conexion: No se pudo conectar a la base de datos", flowId: "5", flowName: "Generacion de Reportes Mensuales" },
        { id: "l2", timestamp: "2024-01-20 12:29:55", type: "warning", message: "Reintentando conexion (intento 3/3)...", flowId: "5", flowName: "Generacion de Reportes Mensuales" },
      ],
      assignedFlows: [
        { id: "5", name: "Generacion de Reportes Mensuales", status: "error" },
      ],
    },
  ])

  const [showAgentDetail, setShowAgentDetail] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const [showEditAgent, setShowEditAgent] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null)

  // Simular actualizacion de metricas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === "busy") {
          return {
            ...agent,
            cpu: `${Math.min(95, Math.max(20, parseInt(agent.cpu) + (Math.random() > 0.5 ? 3 : -3)))}%`,
            memory: `${Math.min(80, Math.max(30, parseInt(agent.memory) + (Math.random() > 0.5 ? 2 : -2)))}%`,
          }
        }
        return agent
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowAgentDetail(true)
  }

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
      id: `agent-${Date.now()}`,
      name,
      os,
      status: "disconnected",
      lastConnection: "Nunca",
      executions: 0,
      cpu: "0%",
      memory: "0%",
      version: "2.4.1",
      capabilities: ["database", "http"],
      logs: [],
      assignedFlows: [],
    }
    setAgents((prev) => [...prev, newAgent])
  }

  const getCapabilityIcon = (cap: AgentCapability) => {
    switch (cap) {
      case "database": return <Database className="h-3 w-3" />
      case "http": return <Globe className="h-3 w-3" />
      case "email": return <Mail className="h-3 w-3" />
      case "file": return <HardDrive className="h-3 w-3" />
      case "script": return <Terminal className="h-3 w-3" />
    }
  }

  const getCapabilityLabel = (cap: AgentCapability) => {
    switch (cap) {
      case "database": return "Base de Datos"
      case "http": return "HTTP/API"
      case "email": return "Email"
      case "file": return "Archivos"
      case "script": return "Scripts"
    }
  }

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "connected": return "bg-green-500"
      case "busy": return "bg-yellow-500"
      case "disconnected": return "bg-red-500"
    }
  }

  const getStatusText = (status: Agent["status"]) => {
    switch (status) {
      case "connected": return "Disponible"
      case "busy": return "Ejecutando"
      case "disconnected": return "Desconectado"
    }
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
          <Card 
            key={agent.id} 
            className="glass border-border p-6 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleViewAgent(agent)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                    agent.status === "connected" ? "bg-green-500/20" : 
                    agent.status === "busy" ? "bg-yellow-500/20" : "bg-red-500/20"
                  }`}
                >
                  <Monitor className={`h-6 w-6 ${
                    agent.status === "connected" ? "text-green-500" : 
                    agent.status === "busy" ? "text-yellow-500" : "text-red-500"
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                    <Badge className={`${getStatusColor(agent.status)} text-white`}>
                      {getStatusText(agent.status)}
                    </Badge>
                    {agent.version && (
                      <Badge variant="outline" className="text-xs">v{agent.version}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{agent.os}</span>
                    {agent.ip && (
                      <>
                        <span className="text-border">|</span>
                        <span className="font-mono text-xs">{agent.ip}</span>
                      </>
                    )}
                  </div>
                  {agent.status === "busy" && agent.currentFlow && (
                    <div className="flex items-center gap-2 mt-2">
                      <Activity className="h-3 w-3 text-yellow-500 animate-pulse" />
                      <span className="text-xs text-yellow-500">Ejecutando: {agent.currentFlow}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {agent.capabilities.map((cap) => (
                      <Badge key={cap} variant="outline" className="text-[10px] px-1.5 py-0.5 gap-1">
                        {getCapabilityIcon(cap)}
                        {getCapabilityLabel(cap)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Ejecuciones</p>
                    <p className="text-xl font-bold text-foreground">{agent.executions.toLocaleString()}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Cpu className="h-3 w-3" />
                      CPU
                    </div>
                    <p className={`text-xl font-bold ${parseInt(agent.cpu) > 80 ? "text-red-500" : parseInt(agent.cpu) > 50 ? "text-yellow-500" : "text-foreground"}`}>
                      {agent.cpu}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <HardDrive className="h-3 w-3" />
                      RAM
                    </div>
                    <p className={`text-xl font-bold ${parseInt(agent.memory) > 80 ? "text-red-500" : parseInt(agent.memory) > 50 ? "text-yellow-500" : "text-foreground"}`}>
                      {agent.memory}
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-border">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewAgent(agent) }}>
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditAgent(agent) }}>
                    Editar agente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteAgent(agent.id) }} className="text-red-500">
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
      
      {/* Dialog de detalle del agente */}
      <Dialog open={showAgentDetail} onOpenChange={setShowAgentDetail}>
        <DialogContent className="glass border-border max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${selectedAgent ? getStatusColor(selectedAgent.status) : ""}`} />
              {selectedAgent?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedAgent?.os} - {selectedAgent?.ip} - v{selectedAgent?.version}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="logs" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="logs">Logs en Vivo</TabsTrigger>
              <TabsTrigger value="flows">Flujos Asignados</TabsTrigger>
              <TabsTrigger value="info">Informacion</TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
              <div className="h-[400px] overflow-y-auto bg-background/50 rounded-lg border border-border p-4 font-mono text-sm space-y-2">
                {selectedAgent?.logs.map((log) => (
                  <div key={log.id} className={`flex items-start gap-3 p-2 rounded ${
                    log.type === "error" ? "bg-red-500/10" :
                    log.type === "warning" ? "bg-yellow-500/10" :
                    log.type === "success" ? "bg-green-500/10" : "bg-muted/20"
                  }`}>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                    {log.type === "error" ? <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> :
                     log.type === "warning" ? <Clock className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" /> :
                     log.type === "success" ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> :
                     <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${
                        log.type === "error" ? "text-red-400" :
                        log.type === "warning" ? "text-yellow-400" :
                        log.type === "success" ? "text-green-400" : "text-foreground"
                      }`}>
                        {log.message}
                      </p>
                      {log.flowName && (
                        <p className="text-[10px] text-muted-foreground mt-1">Flujo: {log.flowName}</p>
                      )}
                    </div>
                  </div>
                ))}
                {(!selectedAgent?.logs || selectedAgent.logs.length === 0) && (
                  <div className="text-center text-muted-foreground py-8">
                    No hay logs disponibles
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="flows" className="flex-1 overflow-auto mt-4 space-y-3">
              {selectedAgent?.assignedFlows.map((flow) => (
                <Card key={flow.id} className="p-4 glass border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        flow.status === "running" ? "bg-green-500 animate-pulse" :
                        flow.status === "error" ? "bg-red-500" : "bg-yellow-500"
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{flow.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {flow.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        flow.status === "running" ? "bg-green-500" :
                        flow.status === "error" ? "bg-red-500" : "bg-yellow-500"
                      } text-white`}>
                        {flow.status === "running" ? "Ejecutando" : flow.status === "error" ? "Error" : "Pausado"}
                      </Badge>
                      <Button variant="outline" size="sm" className="glass border-border">
                        <Play className="h-3 w-3 mr-1" />
                        {flow.status === "running" ? "Detener" : "Iniciar"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {(!selectedAgent?.assignedFlows || selectedAgent.assignedFlows.length === 0) && (
                <div className="text-center text-muted-foreground py-8">
                  No hay flujos asignados a este agente
                </div>
              )}
            </TabsContent>

            <TabsContent value="info" className="flex-1 overflow-auto mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 glass border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sistema Operativo</span>
                      <span className="text-foreground">{selectedAgent?.os}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Direccion IP</span>
                      <span className="text-foreground font-mono">{selectedAgent?.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version del Agente</span>
                      <span className="text-foreground">v{selectedAgent?.version}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 glass border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Rendimiento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU</span>
                      <span className="text-foreground">{selectedAgent?.cpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memoria</span>
                      <span className="text-foreground">{selectedAgent?.memory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ejecuciones Totales</span>
                      <span className="text-foreground">{selectedAgent?.executions.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 glass border-border col-span-2">
                  <h4 className="text-sm font-medium text-foreground mb-3">Capacidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent?.capabilities.map((cap) => (
                      <Badge key={cap} variant="outline" className="gap-1.5 px-3 py-1">
                        {getCapabilityIcon(cap)}
                        {getCapabilityLabel(cap)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Este agente puede ejecutar nodos que requieran estas capacidades. Los nodos que requieran capacidades no soportadas fallaran.
                  </p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
