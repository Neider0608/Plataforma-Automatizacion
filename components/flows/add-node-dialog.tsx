"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Database, GitBranch, Mail, Webhook, Clock, HardDrive, Send, Globe, FileText, Bell, Code } from "lucide-react"

const nodeTypes = [
  { value: "trigger", label: "Disparador", icon: Zap, color: "bg-primary", description: "Inicia el flujo" },
  { value: "action", label: "Accion", icon: Database, color: "bg-secondary", description: "Ejecuta una tarea" },
  { value: "condition", label: "Condicion", icon: GitBranch, color: "bg-yellow-500", description: "Evalua una condicion" },
  { value: "output", label: "Salida", icon: Mail, color: "bg-green-500", description: "Envia resultados" },
]

const triggerSubtypes = [
  { value: "webhook", label: "Webhook", icon: Webhook, description: "Recibe peticiones HTTP" },
  { value: "schedule", label: "Programado", icon: Clock, description: "Se ejecuta segun horario" },
  { value: "email", label: "Email Recibido", icon: Mail, description: "Se activa con emails" },
  { value: "database", label: "Cambio en BD", icon: HardDrive, description: "Detecta cambios en tablas" },
]

const actionSubtypes = [
  { value: "http", label: "Peticion HTTP", icon: Globe, description: "Llama APIs externas" },
  { value: "database", label: "Base de Datos", icon: HardDrive, description: "CRUD en base de datos" },
  { value: "email", label: "Enviar Email", icon: Send, description: "Envia correos" },
  { value: "transform", label: "Transformar", icon: Code, description: "Procesa datos" },
]

const outputSubtypes = [
  { value: "email", label: "Email", icon: Mail, description: "Envia por correo" },
  { value: "webhook", label: "Webhook", icon: Webhook, description: "Envia a una URL" },
  { value: "database", label: "Base de Datos", icon: HardDrive, description: "Guarda en BD" },
  { value: "notification", label: "Notificacion", icon: Bell, description: "Push notification" },
]

export function AddNodeDialog({
  open,
  onOpenChange,
  onAddNode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNode: (nodeName: string, nodeType: string, config?: any) => void
}) {
  const [step, setStep] = useState(1)
  const [nodeName, setNodeName] = useState("")
  const [nodeType, setNodeType] = useState("")
  const [subType, setSubType] = useState("")

  const handleAdd = () => {
    const config: Record<string, string> = {}
    if (nodeType === "trigger") config.triggerType = subType
    if (nodeType === "action") config.actionType = subType
    if (nodeType === "output") config.outputType = subType

    onAddNode(nodeName, nodeType, config)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setNodeName("")
    setNodeType("")
    setSubType("")
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  const getSubtypes = () => {
    switch (nodeType) {
      case "trigger": return triggerSubtypes
      case "action": return actionSubtypes
      case "output": return outputSubtypes
      default: return []
    }
  }

  const needsSubtype = nodeType && nodeType !== "condition"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === 1 ? "Agregar Nuevo Nodo" : step === 2 ? "Seleccionar Tipo" : "Nombrar Nodo"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 1 
              ? "Selecciona que tipo de nodo quieres agregar" 
              : step === 2 
                ? "Elige la funcion especifica del nodo"
                : "Dale un nombre descriptivo a tu nodo"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 py-4">
            {nodeTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setNodeType(type.value)
                  if (type.value === "condition") {
                    setStep(3)
                  } else {
                    setStep(2)
                  }
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:scale-105 bg-background/50`}
              >
                <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <span className="font-medium text-foreground">{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && needsSubtype && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {getSubtypes().map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => {
                    setSubType(sub.value)
                    setStep(3)
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:scale-105 ${
                    subType === sub.value 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50 bg-background/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <sub.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">{sub.label}</p>
                    <p className="text-xs text-muted-foreground">{sub.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setStep(1)} 
              className="glass border-border bg-transparent w-full"
            >
              Volver
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${nodeTypes.find(t => t.value === nodeType)?.color} flex items-center justify-center`}>
                  {(() => {
                    const TypeIcon = nodeTypes.find(t => t.value === nodeType)?.icon || Zap
                    return <TypeIcon className="h-5 w-5 text-white" />
                  })()}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {nodeTypes.find(t => t.value === nodeType)?.label}
                  </p>
                  {subType && (
                    <p className="text-sm text-muted-foreground">
                      {getSubtypes().find(s => s.value === subType)?.label}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-name" className="text-foreground">
                Nombre del Nodo
              </Label>
              <Input
                id="node-name"
                placeholder="Ej: Enviar notificacion al cliente"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="glass border-border bg-transparent"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Un nombre descriptivo te ayudara a identificar este nodo facilmente
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep(needsSubtype ? 2 : 1)} 
                className="glass border-border bg-transparent flex-1"
              >
                Volver
              </Button>
              <Button 
                onClick={handleAdd} 
                disabled={!nodeName} 
                className="bg-primary hover:bg-primary/90 flex-1"
              >
                Agregar Nodo
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
