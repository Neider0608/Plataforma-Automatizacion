import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AIChatInterface } from "@/components/ai-builder/ai-chat-interface"
import { FlowPreview } from "@/components/ai-builder/flow-preview"

export default function AIBuilderPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row gap-4 p-6">
            <div className="flex-1 flex flex-col">
              <AIChatInterface />
            </div>

            <div className="lg:w-96 flex flex-col">
              <FlowPreview />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
