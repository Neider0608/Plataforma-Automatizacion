import { Zap, Settings, GitBranch, Send } from "lucide-react"

type Node = {
  id: string
  type: string
  label: string
  color: string
}

export function FlowNode({ node }: { node: Node }) {
  const getIcon = () => {
    switch (node.type) {
      case "trigger":
        return <Zap className="h-4 w-4" />
      case "action":
        return <Settings className="h-4 w-4" />
      case "condition":
        return <GitBranch className="h-4 w-4" />
      case "output":
        return <Send className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card/50">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${node.color}/20`}>
        <div className={`${node.color.replace("bg-", "text-")}`}>{getIcon()}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{node.label}</p>
        <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
      </div>
    </div>
  )
}
