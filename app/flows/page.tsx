import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FlowsList } from "@/components/flows/flows-list"

export default function FlowsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <FlowsList />
        </main>
      </div>
    </div>
  )
}
