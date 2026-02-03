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
import { Copy } from "lucide-react"

interface AddAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAgent: (name: string, os: string) => void
}

export function AddAgentDialog({ open, onOpenChange, onAddAgent }: AddAgentDialogProps) {
  const [name, setName] = useState("")
  const [os, setOs] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)

  const installCommand = `curl -fsSL https://install.automation-platform.com/agent.sh | bash -s -- --token=YOUR_TOKEN --name="${name}"`

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
