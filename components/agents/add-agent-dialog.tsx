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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Database, Globe, Mail, HardDrive, Terminal, CheckCircle2, Download, Laptop, Monitor } from "lucide-react"

const operatingSystems = [
  { value: "ubuntu-22", label: "Ubuntu 22.04 LTS", category: "Linux" },
  { value: "ubuntu-20", label: "Ubuntu 20.04 LTS", category: "Linux" },
  { value: "debian-12", label: "Debian 12", category: "Linux" },
  { value: "debian-11", label: "Debian 11", category: "Linux" },
  { value: "centos-9", label: "CentOS Stream 9", category: "Linux" },
  { value: "rhel-9", label: "RHEL 9", category: "Linux" },
  { value: "amazon-linux-2023", label: "Amazon Linux 2023", category: "Linux" },
  { value: "windows-server-2022", label: "Windows Server 2022", category: "Windows" },
  { value: "windows-server-2019", label: "Windows Server 2019", category: "Windows" },
  { value: "windows-11", label: "Windows 11", category: "Windows" },
  { value: "windows-10", label: "Windows 10", category: "Windows" },
  { value: "macos-sonoma", label: "macOS Sonoma", category: "macOS" },
  { value: "macos-ventura", label: "macOS Ventura", category: "macOS" },
]

const downloadLinks = {
  linux: {
    label: "Linux (x64)",
    icon: <Terminal className="h-4 w-4" />,
    filename: "agent-linux-x64.tar.gz",
    size: "45 MB",
  },
  linuxArm: {
    label: "Linux (ARM64)",
    icon: <Terminal className="h-4 w-4" />,
    filename: "agent-linux-arm64.tar.gz",
    size: "42 MB",
  },
  windows: {
    label: "Windows (x64)",
    icon: <Monitor className="h-4 w-4" />,
    filename: "agent-windows-x64.exe",
    size: "52 MB",
  },
  macos: {
    label: "macOS (Universal)",
    icon: <Laptop className="h-4 w-4" />,
    filename: "agent-macos-universal.pkg",
    size: "48 MB",
  },
}

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
              <Label className="text-foreground">
                Sistema Operativo
              </Label>
              <Select value={os} onValueChange={setOs}>
                <SelectTrigger className="glass border-border bg-transparent">
                  <SelectValue placeholder="Selecciona el sistema operativo" />
                </SelectTrigger>
                <SelectContent className="glass border-border max-h-[300px]">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Linux</div>
                  {operatingSystems.filter(o => o.category === "Linux").map((osItem) => (
                    <SelectItem key={osItem.value} value={osItem.value}>
                      {osItem.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border mt-1 pt-2">Windows</div>
                  {operatingSystems.filter(o => o.category === "Windows").map((osItem) => (
                    <SelectItem key={osItem.value} value={osItem.value}>
                      {osItem.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border mt-1 pt-2">macOS</div>
                  {operatingSystems.filter(o => o.category === "macOS").map((osItem) => (
                    <SelectItem key={osItem.value} value={osItem.value}>
                      {osItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Tabs defaultValue="script" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="script">Script de Instalacion</TabsTrigger>
                <TabsTrigger value="download">Descargar Agente</TabsTrigger>
              </TabsList>

              <TabsContent value="script" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Ejecuta este comando en tu servidor</Label>
                  <div className="relative">
                    <Textarea
                      value={installCommand}
                      readOnly
                      className="glass border-border bg-transparent font-mono text-sm pr-12"
                      rows={4}
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
                  <p className="text-xs text-muted-foreground">
                    Este script descargara e instalara el agente automaticamente
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="download" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Descarga el instalador para tu plataforma</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(downloadLinks).map(([key, download]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className="glass border-border h-auto py-3 px-4 flex flex-col items-start gap-1 hover:border-primary"
                        onClick={() => {
                          // Simular descarga
                          const link = document.createElement("a")
                          link.href = `#download-${download.filename}`
                          link.download = download.filename
                          alert(`Descargando ${download.filename}...`)
                        }}
                      >
                        <div className="flex items-center gap-2 text-foreground">
                          {download.icon}
                          <span className="font-medium">{download.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Download className="h-3 w-3" />
                          <span>{download.filename}</span>
                          <Badge variant="outline" className="text-[10px] px-1">{download.size}</Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <p className="text-xs text-muted-foreground">
                    Despues de descargar, ejecuta el instalador y usa este token de configuracion:
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 text-xs bg-background/50 px-2 py-1 rounded font-mono text-primary">
                      YOUR_UNIQUE_TOKEN
                    </code>
                    <Button size="sm" variant="ghost" className="h-7" onClick={() => navigator.clipboard.writeText("YOUR_UNIQUE_TOKEN")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-foreground">Verificacion de conexion</Label>
              <p className="text-sm text-muted-foreground">
                Una vez instalado, el agente aparecera en la lista con estado &quot;Conectado&quot;
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
