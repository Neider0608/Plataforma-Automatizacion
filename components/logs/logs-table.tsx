"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye } from "lucide-react"
import { LogDetailModal } from "./log-detail-modal"

const logs = [
  {
    id: "exec-1247",
    flow: "Sincronización de Clientes CRM",
    status: "success",
    date: "2025-01-21 14:32:15",
    duration: "2.3s",
    steps: 8,
    errors: 0,
  },
  {
    id: "exec-1246",
    flow: "Procesamiento de Facturas",
    status: "success",
    date: "2025-01-21 14:28:42",
    duration: "1.8s",
    steps: 12,
    errors: 0,
  },
  {
    id: "exec-1245",
    flow: "Notificaciones de Pedidos",
    status: "error",
    date: "2025-01-21 14:15:33",
    duration: "0.5s",
    steps: 6,
    errors: 1,
  },
  {
    id: "exec-1244",
    flow: "Backup Automático de Datos",
    status: "success",
    date: "2025-01-21 13:00:00",
    duration: "45.2s",
    steps: 24,
    errors: 0,
  },
]

export function LogsTable() {
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historial / Logs</h1>
          <p className="text-muted-foreground mt-1">Revisa el historial de ejecuciones de tus flujos</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por ID o flujo..." className="pl-10 glass border-border bg-transparent" />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-48 glass border-border bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-border">
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="success">Exitosos</SelectItem>
            <SelectItem value="error">Con errores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="glass border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold text-muted-foreground">ID Ejecución</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Flujo</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Fecha</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Duración</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Pasos</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Errores</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-primary/5 transition-colors">
                  <td className="p-4 text-sm text-foreground font-mono">{log.id}</td>
                  <td className="p-4 text-sm text-foreground">{log.flow}</td>
                  <td className="p-4">
                    <Badge variant={log.status === "success" ? "default" : "destructive"} className="capitalize">
                      {log.status === "success" ? "Exitoso" : "Error"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{log.date}</td>
                  <td className="p-4 text-sm text-muted-foreground">{log.duration}</td>
                  <td className="p-4 text-sm text-muted-foreground">{log.steps}</td>
                  <td className="p-4 text-sm">
                    <span className={log.errors > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {log.errors}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                      onClick={() => setSelectedLog(log.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedLog && <LogDetailModal logId={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  )
}
