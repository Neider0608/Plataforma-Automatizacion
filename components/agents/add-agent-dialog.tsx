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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Database, Globe, Mail, HardDrive, Terminal, CheckCircle2 } from "lucide-react"

type AgentCapability = "database" | "http" | "email" | "file" | "script"

interface AddAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAgent: (name: string, os: string) => void
}

const capabilities: { id: AgentCapability; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "database", label: "Base de Datos", description: "Ejecutar queries SQL", icon: <Database className="h-4 w-4" /> },
  { id: "http", label: "HTTP/API", description: "Llamadas a APIs externas", icon: <Globe className="h-4 w-4" /> },
  { id: "email", label: "Email", description: "Envio y recepcion de emails", icon: <Mail className="h-4 w-4" /> },
  { id: "file", label: "Archivos", description: "Lectura/escritura de archivos", icon: <HardDrive className="h-4 w-4" /> },
  { id: "script", label: "Scripts", description: "Ejecucion de scripts personalizados", icon: <Terminal className="h-4 w-4" /> },
]

export function AddAgentDialog({ open, onOpenChange, onAddAgent }: AddAgentDialogProps) {
  const [name, setName] = useState("")
  const [os, setOs] = useState("")
  const [selectedCapabilities, setSelectedCapabilities] = useState<AgentCapability[]>(["database", "http"])
  const [showInstructions, setShowInstructions] = useState(false)

  const installCommand = `curl -fsSL https://install.automation-platform.com/agent.sh | bash -s -- \\
  --token=YOUR_UNIQUE_TOKEN \\
  --name="${name || "mi-agente"}" \\
  --capabilities="${selectedCapabilities.join(",")}"`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && os.trim()) {
      onAddAgent(name.trim(), os.trim())
      setShowInstructions(true)
    }
  }

  const handleClose = () => {
    setName("")
    setOs("")
    setSelectedCapabilities(["database", "http"])
    setShowInstructions(false)
    onOpenChange(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Registrar Nuevo Agente</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {showInstructions
              ? "Sigue estas instrucciones para instalar el agente en tu servidor"
              : "Configura un nuevo agente local para ejecutar flujos"}
          </DialogDescription>
        </DialogHeader>

        {!showInstructions ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-agent-name" className="text-foreground">
                Nombre del agente
              </Label>
              <Input
                id="new-agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Agent-Produccion-02"
                className="glass border-border focus:border-primary bg-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-agent-os" className="text-foreground">
                Sistema Operativo
              </Label>
              <Input
                id="new-agent-os"
                value={os}
                onChange={(e) => setOs(e.target.value)}
                placeholder="Ubuntu 22.04"
                className="glass border-border focus:border-primary bg-transparent"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-foreground">Capacidades del Agente</Label>
              <p className="text-xs text-muted-foreground">
                Selecciona las operaciones que este agente podra ejecutar
              </p>
              <div className="grid grid-cols-1 gap-2">
                {capabilities.map((cap) => (
                  <label
                    key={cap.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCapabilities.includes(cap.id)
                        ? "border-primary bg-primary/10"
                        : "border-border glass hover:border-primary/50"
                    }`}
                  >
                    <Switch
                      checked={selectedCapabilities.includes(cap.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCapabilities([...selectedCapabilities, cap.id])
                        } else {
                          setSelectedCapabilities(selectedCapabilities.filter((c) => c !== cap.id))
                        }
                      }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-primary">{cap.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cap.label}</p>
                        <p className="text-xs text-muted-foreground">{cap.description}</p>
                      </div>
                    </div>
                    {selectedCapabilities.includes(cap.id) && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="glass border-border bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 neon-glow">
                Continuar
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Paso 1: Ejecuta este comando en tu servidor</Label>
              <div className="relative">
                <Textarea
                  value={installCommand}
                  readOnly
                  className="glass border-border bg-transparent font-mono text-sm pr-12"
                  rows={3}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 hover:bg-primary/10"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Paso 2: Verifica la conexión</Label>
              <p className="text-sm text-muted-foreground">
                Una vez instalado, el agente aparecerá en la lista con estado "Conectado"
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="bg-primary hover:bg-primary/90 neon-glow">
                Entendido
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
