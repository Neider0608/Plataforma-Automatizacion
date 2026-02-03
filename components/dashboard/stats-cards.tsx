import { Card } from "@/components/ui/card"
import { Activity, CheckCircle2, AlertCircle, Zap } from "lucide-react"

const stats = [
  {
    title: "Flujos Activos",
    value: "24",
    change: "+3 este mes",
    icon: Activity,
    color: "text-primary",
  },
  {
    title: "Ejecuciones Hoy",
    value: "1,247",
    change: "+18% vs ayer",
    icon: Zap,
    color: "text-secondary",
  },
  {
    title: "Exitosas",
    value: "1,198",
    change: "96.1% tasa éxito",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    title: "Errores",
    value: "49",
    change: "-12% vs ayer",
    icon: AlertCircle,
    color: "text-destructive",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="glass border-border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </div>
              <div className={cn("p-3 rounded-lg bg-primary/10", stat.color)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
