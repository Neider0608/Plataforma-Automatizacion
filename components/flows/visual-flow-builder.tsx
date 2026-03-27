"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Save, Play, Plus, Download, Upload, FileJson, CheckCircle2 } from "lucide-react"
import { FlowCanvas } from "./flow-canvas"
import { AddNodeDialog } from "./add-node-dialog"
import { EditNodeDialog } from "./edit-node-dialog"
import { AssignAgentDialog } from "./assign-agent-dialog"
import { ExportJsonDialog } from "./export-json-dialog"
import { getFlowById } from "@/lib/flow-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Node = {
  id: string
  type: "trigger" | "action" | "condition" | "output"
  label: string
  x: number
  y: number
  color: string
  description?: string
  config?: any
}

export function VisualFlowBuilder() {
  const params = useParams()
  const flowId = params?.id as string | undefined
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showAddNode, setShowAddNode] = useState(false)
  const [showEditNode, setShowEditNode] = useState(false)
  const [showAssignAgent, setShowAssignAgent] = useState(false)
  const [showExportJson, setShowExportJson] = useState(false)
  const [nodeToEdit, setNodeToEdit] = useState<Node | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([])
  const [assignedAgent, setAssignedAgent] = useState<string | null>(null)
  const [flowName, setFlowName] = useState("Nuevo Flujo")
  const [flowDescription, setFlowDescription] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (flowId) {
      const flow = getFlowById(flowId)
      if (flow) {
        setFlowName(flow.name)
        setFlowDescription(flow.description)
        setNodes(flow.nodes)
      }
    }
  }, [flowId])

  const handleTestFlow = () => {
    setIsTestMode(true)
    setTimeout(() => {
      setIsTestMode(false)
    }, nodes.length * 600 + 1000)
  }

  const handleAddNode = (nodeName: string, nodeType: string, config?: any) => {
    const colorMap: Record<string, string> = {
      trigger: "bg-primary",
      action: "bg-secondary",
      condition: "bg-yellow-500",
      output: "bg-green-500",
    }

    const newNode: Node = {
      id: Date.now().toString(),
      type: nodeType as Node["type"],
      label: nodeName,
      x: 50,
      y: nodes.length === 0 ? 10 : Math.min(nodes[nodes.length - 1].y + 15, 90),
      color: colorMap[nodeType] || "bg-primary",
      config: config || {},
    }

    setNodes((prev) => [...prev, newNode])
    setIsSaved(false)
  }

  const handleNodeDoubleClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setNodeToEdit({ ...node })
      setShowEditNode(true)
    }
  }

  const handleUpdateNode = (nodeId: string, nodeName: string, nodeType: string, description?: string, config?: any) => {
    const colorMap: Record<string, string> = {
      trigger: "bg-primary",
      action: "bg-secondary",
      condition: "bg-yellow-500",
      output: "bg-green-500",
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              label: nodeName,
              type: nodeType as Node["type"],
              color: colorMap[nodeType] || "bg-primary",
              description,
              config: config || {},
            }
          : node,
      ),
    )
    setNodeToEdit(null)
    setIsSaved(false)
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setNodeToEdit(null)
    setIsSaved(false)
  }

  const handleSaveFlow = () => {
    if (nodes.length > 0) {
      setShowAssignAgent(true)
    }
  }

  const handleAssignAgent = (agentId: string) => {
    setAssignedAgent(agentId)
    setIsSaved(true)
  }

  const generateFlowJson = () => {
    return {
      id: flowId || `flow-${Date.now()}`,
      name: flowName,
      description: flowDescription,
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedAgent: assignedAgent,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        label: node.label,
        description: node.description,
        position: { x: node.x, y: node.y },
        config: node.config || {},
      })),
      connections: nodes.slice(0, -1).map((node, index) => ({
        sourceId: node.id,
        targetId: nodes[index + 1].id,
        type: "default",
      })),
      metadata: {
        nodesCount: nodes.length,
        hasConditions: nodes.some((n) => n.type === "condition"),
        triggers: nodes.filter((n) => n.type === "trigger").map((n) => n.config?.triggerType),
        outputs: nodes.filter((n) => n.type === "output").map((n) => n.config?.outputType),
      },
    }
  }

  const handleExportJson = () => {
    setShowExportJson(true)
  }

  const handleImportJson = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const flowData = JSON.parse(event.target?.result as string)
            if (flowData.nodes && Array.isArray(flowData.nodes)) {
              const colorMap: Record<string, string> = {
                trigger: "bg-primary",
                action: "bg-secondary",
                condition: "bg-yellow-500",
                output: "bg-green-500",
              }
              const importedNodes = flowData.nodes.map((node: any, index: number) => ({
                id: node.id || `node-${Date.now()}-${index}`,
                type: node.type,
                label: node.label,
                x: node.position?.x || 50,
                y: node.position?.y || index * 15 + 10,
                color: colorMap[node.type] || "bg-primary",
                description: node.description,
                config: node.config || {},
              }))
              setNodes(importedNodes)
              setFlowName(flowData.name || "Flujo Importado")
              setFlowDescription(flowData.description || "")
              setIsSaved(false)
            }
          } catch (error) {
            console.error("Error parsing JSON:", error)
            alert("Error al importar el archivo JSON. Verifica que el formato sea correcto.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 border-b border-border glass flex items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            {flowName}
            {isSaved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </h2>
          <p className="text-sm text-muted-foreground">
            {nodes.length === 0
              ? "Comienza agregando nodos"
              : assignedAgent
                ? `${nodes.length} nodo${nodes.length > 1 ? "s" : ""} - Agente: ${assignedAgent}`
                : `${nodes.length} nodo${nodes.length > 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass border-border hover:border-primary/50 bg-transparent">
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-border">
              <DropdownMenuItem onClick={handleExportJson} disabled={nodes.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Exportar JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportJson}>
                <Upload className="mr-2 h-4 w-4" />
                Importar JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="glass border-border hover:border-primary/50 bg-transparent"
            onClick={() => setShowAddNode(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar nodo
          </Button>
          <Button
            variant="outline"
            className="glass border-border hover:border-primary/50 bg-transparent"
            onClick={handleTestFlow}
            disabled={isTestMode || nodes.length === 0}
          >
            <Play className="mr-2 h-4 w-4" />
            {isTestMode ? "Ejecutando..." : "Probar flujo"}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 neon-glow"
            disabled={nodes.length === 0}
            onClick={handleSaveFlow}
          >
            <Save className="mr-2 h-4 w-4" />
            Publicar flujo
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <FlowCanvas
          nodes={nodes}
          setNodes={setNodes}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          onNodeDoubleClick={handleNodeDoubleClick}
          isTestMode={isTestMode}
        />
      </div>

      <AddNodeDialog open={showAddNode} onOpenChange={setShowAddNode} onAddNode={handleAddNode} />
      <EditNodeDialog
        open={showEditNode}
        onOpenChange={(open) => {
          setShowEditNode(open)
          if (!open) setNodeToEdit(null)
        }}
        node={nodeToEdit}
        allNodes={nodes}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />
      <AssignAgentDialog open={showAssignAgent} onOpenChange={setShowAssignAgent} onAssignAgent={handleAssignAgent} />
      <ExportJsonDialog 
        open={showExportJson} 
        onOpenChange={setShowExportJson} 
        flowData={generateFlowJson()} 
        flowName={flowName}
      />
    </div>
  )
}
