"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CreateFlowDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const [flowName, setFlowName] = useState("")
  const [flowDescription, setFlowDescription] = useState("")

  const handleCreate = () => {
    console.log("[v0] Creating flow:", { flowName, flowDescription })
    // Generate a random ID for the new flow
    const newFlowId = Math.floor(Math.random() * 1000) + 10
    onOpenChange(false)
    router.push(`/flows/${newFlowId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Crear Nuevo Flujo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Crea un flujo de automatización desde cero
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="flow-name" className="text-foreground">
              Nombre del Flujo
            </Label>
            <Input
              id="flow-name"
              placeholder="Ej: Sincronización de datos"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flow-description" className="text-foreground">
              Descripción
            </Label>
            <Textarea
              id="flow-description"
              placeholder="Describe qué hace este flujo..."
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              className="glass border-border bg-transparent min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="glass border-border bg-transparent">
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!flowName} className="bg-primary hover:bg-primary/90">
            Crear Flujo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
