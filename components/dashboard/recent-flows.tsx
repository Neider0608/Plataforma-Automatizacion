import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import Link from "next/link"

const flows = [
  {
    id: "1",
    name: "Sincronización de Clientes CRM",
    status: "active",
    lastRun: "Hace 5 minutos",
    executions: 342,
    successRate: 98.5,
  },
  {
    id: "2",
    name: "Procesamiento de Facturas",
    status: "active",
    lastRun: "Hace 12 minutos",
    executions: 156,
    successRate: 100,
  },
  {
    id: "3",
    name: "Notificaciones de Pedidos",
    status: "paused",
    lastRun: "Hace 2 horas",
    executions: 89,
    successRate: 95.2,
  },
  {
    id: "4",
    name: "Backup Automático de Datos",
    status: "active",
    lastRun: "Hace 1 hora",
    executions: 24,
    successRate: 100,
  },
  {
    id: "5",
    name: "Generación de Reportes Mensuales",
    status: "active",
    lastRun: "Hace 30 minutos",
    executions: 67,
    successRate: 97.8,
  },
  {
    id: "6",
    name: "Actualización de Inventario",
    status: "active",
    lastRun: "Hace 8 minutos",
    executions: 523,
    successRate: 99.2,
  },
  {
    id: "7",
    name: "Envío de Emails Marketing",
    status: "active",
    lastRun: "Hace 45 minutos",
    executions: 1240,
    successRate: 96.5,
  },
  {
    id: "8",
    name: "Validación de Pagos",
    status: "active",
    lastRun: "Hace 3 minutos",
    executions: 892,
    successRate: 99.8,
  },
]

export function RecentFlows() {
  return (
    <Card className="glass border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Flujos Recientes</h2>
        <Link href="/flows">
          <Button variant="outline" className="glass border-border hover:border-primary/50 bg-transparent">
            Ver todos
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {flows.map((flow) => (
          <Link key={flow.id} href={`/flows/${flow.id}`}>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                {flow.status === "active" ? (
                  <Play className="h-5 w-5 text-primary" />
                ) : (
                  <Pause className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{flow.name}</h3>
                <p className="text-sm text-muted-foreground">{flow.lastRun}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Ejecuciones</p>
                  <p className="text-lg font-semibold text-foreground">{flow.executions}</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tasa éxito</p>
                  <p className="text-lg font-semibold text-green-500">{flow.successRate}%</p>
                </div>

                <Badge variant={flow.status === "active" ? "default" : "secondary"} className="capitalize">
                  {flow.status === "active" ? "Activo" : "Pausado"}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
