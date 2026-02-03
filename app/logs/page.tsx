import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { LogsTable } from "@/components/logs/logs-table"

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <LogsTable />
        </main>
      </div>
    </div>
  )
}
