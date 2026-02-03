import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentFlows } from "@/components/dashboard/recent-flows"
import { Button } from "@/components/ui/button"
import { Sparkles, Pencil } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Bienvenido a tu plataforma de automatización</p>
            </div>
            <div className="flex gap-2">
              <Link href="/flows">
                <Button variant="outline" className="glass border-border hover:border-primary/50 bg-transparent">
                  <Pencil className="mr-2 h-4 w-4" />
                  Crear manual
                </Button>
              </Link>
              <Link href="/ai-builder">
                <Button className="bg-primary hover:bg-primary/90 neon-glow">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Crear flujo con IA
                </Button>
              </Link>
            </div>
          </div>

          <StatsCards />

          <RecentFlows />
        </main>
      </div>
    </div>
  )
}
