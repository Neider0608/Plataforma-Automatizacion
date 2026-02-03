"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Play, Pause, Edit, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CreateFlowDialog } from "./create-flow-dialog"

const flows = [
  {
    id: "1",
    name: "Sincronización de Clientes CRM",
    description: "Sincroniza automáticamente los clientes desde el CRM a la base de datos",
    status: "active",
    nodes: 8,
    lastModified: "Hace 2 horas",
  },
  {
    id: "2",
    name: "Procesamiento de Facturas",
    description: "Procesa y valida facturas entrantes automáticamente",
    status: "active",
    nodes: 12,
    lastModified: "Hace 1 día",
  },
  {
    id: "3",
    name: "Notificaciones de Pedidos",
    description: "Envía notificaciones cuando se reciben nuevos pedidos",
    status: "paused",
    nodes: 6,
    lastModified: "Hace 3 días",
  },
  {
    id: "4",
    name: "Backup Automático de Datos",
    description: "Realiza copias de seguridad de la base de datos cada 24 horas",
    status: "active",
    nodes: 5,
    lastModified: "Hace 1 hora",
  },
  {
    id: "5",
    name: "Generación de Reportes Mensuales",
    description: "Genera y envía reportes mensuales a los administradores",
    status: "active",
    nodes: 10,
    lastModified: "Hace 5 días",
  },
  {
    id: "6",
    name: "Actualización de Inventario",
    description: "Actualiza el inventario en tiempo real desde múltiples fuentes",
    status: "active",
    nodes: 15,
    lastModified: "Hace 30 minutos",
  },
  {
    id: "7",
    name: "Envío de Emails Marketing",
    description: "Envía campañas de email marketing segmentadas",
    status: "active",
    nodes: 9,
    lastModified: "Hace 2 días",
  },
  {
    id: "8",
    name: "Validación de Pagos",
    description: "Valida y procesa pagos de múltiples pasarelas",
    status: "active",
    nodes: 11,
    lastModified: "Hace 4 horas",
  },
]

export function FlowsList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flujos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus flujos de automatización</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="glass border-border hover:border-primary/50 bg-transparent"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear manual
          </Button>
          <Link href="/ai-builder">
            <Button className="bg-primary hover:bg-primary/90 neon-glow">
              <Sparkles className="mr-2 h-4 w-4" />
              Crear con IA
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar flujos..." className="pl-10 glass border-border bg-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flows.map((flow) => (
          <Card key={flow.id} className="glass border-border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <Badge variant={flow.status === "active" ? "default" : "secondary"} className="capitalize">
                {flow.status === "active" ? "Activo" : "Pausado"}
              </Badge>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 -mr-2 -mt-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">{flow.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{flow.description}</p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{flow.nodes} nodos</span>
              <span>{flow.lastModified}</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/flows/${flow.id}`} className="flex-1">
                <Button variant="outline" className="w-full glass border-border hover:border-primary/50 bg-transparent">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="glass border-border hover:border-primary/50 bg-transparent"
              >
                {flow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateFlowDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
