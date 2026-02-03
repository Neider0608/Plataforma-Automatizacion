"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Database, GitBranch, Mail } from "lucide-react"

const nodeTypes = [
  { value: "trigger", label: "Disparador", icon: Zap, color: "bg-primary" },
  { value: "action", label: "Acción", icon: Database, color: "bg-secondary" },
  { value: "condition", label: "Condición", icon: GitBranch, color: "bg-yellow-500" },
  { value: "output", label: "Salida", icon: Mail, color: "bg-green-500" },
]

export function AddNodeDialog({
  open,
  onOpenChange,
  onAddNode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNode: (nodeName: string, nodeType: string) => void
}) {
  const [nodeName, setNodeName] = useState("")
  const [nodeType, setNodeType] = useState("")

  const handleAdd = () => {
    onAddNode(nodeName, nodeType)
    onOpenChange(false)
    setNodeName("")
    setNodeType("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Agregar Nuevo Nodo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Crea un nuevo nodo para tu flujo de automatización
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="node-name" className="text-foreground">
              Nombre del Nodo
            </Label>
            <Input
              id="node-name"
              placeholder="Ej: Enviar notificación"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-type" className="text-foreground">
              Tipo de Nodo
            </Label>
            <Select value={nodeType} onValueChange={setNodeType}>
              <SelectTrigger className="glass border-border bg-transparent">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                {nodeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="glass border-border bg-transparent">
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={!nodeName || !nodeType} className="bg-primary hover:bg-primary/90">
            Agregar Nodo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
