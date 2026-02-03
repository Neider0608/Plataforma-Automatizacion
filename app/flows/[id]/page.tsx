import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { VisualFlowBuilder } from "@/components/flows/visual-flow-builder"
import { FlowProperties } from "@/components/flows/flow-properties"

export default function FlowEditorPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1">
            <VisualFlowBuilder />
          </div>

          <div className="w-80 border-l border-border">
            <FlowProperties />
          </div>
        </main>
      </div>
    </div>
  )
}
