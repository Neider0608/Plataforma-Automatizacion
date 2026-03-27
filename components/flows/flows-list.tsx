"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Play, Pause, Edit, Sparkles, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"
import { CreateFlowDialog } from "./create-flow-dialog"
import { flowsData, type FlowData } from "@/lib/flow-data"

export function FlowsList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [flows, setFlows] = useState<FlowData[]>(flowsData)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleFlowStatus = (flowId: string) => {
    setFlows(prev => 
      prev.map(flow => 
        flow.id === flowId 
          ? { ...flow, status: flow.status === "active" ? "paused" : "active" }
          : flow
      )
    )
  }

  const deleteFlow = (flowId: string) => {
    setFlows(prev => prev.filter(flow => flow.id !== flowId))
  }

  const filteredFlows = flows.filter(flow => 
    flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flujos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus flujos de automatizacion</p>
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
          <Input 
            placeholder="Buscar flujos..." 
            className="pl-10 glass border-border bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlows.map((flow) => (
          <Card key={flow.id} className="glass border-border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <Badge variant={flow.status === "active" ? "default" : "secondary"} className="capitalize">
                {flow.status === "active" ? "Activo" : "Pausado"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 -mr-2 -mt-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-border" align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/flows/${flow.id}`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleFlowStatus(flow.id)}>
                    {flow.status === "active" ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Activar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => deleteFlow(flow.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">{flow.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{flow.description}</p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{flow.nodes.length} nodos</span>
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
                onClick={() => toggleFlowStatus(flow.id)}
              >
                {flow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredFlows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron flujos</p>
        </div>
      )}

      <CreateFlowDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
