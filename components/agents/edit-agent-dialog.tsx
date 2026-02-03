"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import type { Agent } from "./agents-list"

interface EditAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: Agent | null
  onUpdateAgent: (agentId: string, name: string, os: string) => void
}

export function EditAgentDialog({ open, onOpenChange, agent, onUpdateAgent }: EditAgentDialogProps) {
  const [name, setName] = useState("")
  const [os, setOs] = useState("")

  useEffect(() => {
    if (agent) {
      setName(agent.name)
      setOs(agent.os)
    }
  }, [agent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (agent && name.trim() && os.trim()) {
      onUpdateAgent(agent.id, name.trim(), os.trim())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Agente</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifica la información del agente local
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name" className="text-foreground">
              Nombre del agente
            </Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent-Produccion-01"
              className="glass border-border focus:border-primary bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-os" className="text-foreground">
              Sistema Operativo
            </Label>
            <Input
              id="agent-os"
              value={os}
              onChange={(e) => setOs(e.target.value)}
              placeholder="Ubuntu 22.04"
              className="glass border-border focus:border-primary bg-transparent"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="glass border-border">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 neon-glow">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
