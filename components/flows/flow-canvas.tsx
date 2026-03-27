"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Zap, Database, Mail, GitBranch, CheckCircle, Plus, ArrowRight, Globe, Clock, Code, FileText } from "lucide-react"
import type { Node } from "./visual-flow-builder"
import { Badge } from "@/components/ui/badge"

export function FlowCanvas({
  nodes,
  setNodes,
  selectedNode,
  onSelectNode,
  onNodeDoubleClick,
  isTestMode = false,
}: {
  nodes: Node[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  selectedNode: string | null
  onSelectNode: (id: string) => void
  onNodeDoubleClick?: (id: string) => void
  isTestMode?: boolean
}) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTestMode && nodes.length > 0) {
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < nodes.length) {
          setActiveNode(nodes[currentIndex].id)
          currentIndex++
        } else {
          clearInterval(interval)
          setActiveNode(null)
        }
      }, 600)

      return () => clearInterval(interval)
    }
  }, [isTestMode, nodes])

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (isTestMode) return
    const node = nodes.find((n) => n.id === nodeId)
    if (!node || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const nodeX = (node.x / 100) * rect.width
    const nodeY = (node.y / 100) * rect.height

    setDraggedNode(nodeId)
    setDragOffset({
      x: e.clientX - nodeX,
      y: e.clientY - nodeY,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newX = ((e.clientX - dragOffset.x - rect.left) / rect.width) * 100
    const newY = ((e.clientY - dragOffset.y - rect.top) / rect.height) * 100

    setNodes((prev) =>
      prev.map((node) =>
        node.id === draggedNode
          ? {
              ...node,
              x: Math.max(5, Math.min(95, newX)),
              y: Math.max(5, Math.min(95, newY)),
            }
          : node,
      ),
    )
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  const handleNodeDoubleClick = (nodeId: string) => {
    if (onNodeDoubleClick && !isTestMode) {
      onNodeDoubleClick(nodeId)
    }
  }

  const getIcon = (type: string, config?: any) => {
    if (type === "trigger") {
      switch (config?.triggerType) {
        case "webhook": return <Globe className="h-5 w-5" />
        case "schedule": return <Clock className="h-5 w-5" />
        case "email": return <Mail className="h-5 w-5" />
        case "database": return <Database className="h-5 w-5" />
        default: return <Zap className="h-5 w-5" />
      }
    }
    if (type === "action") {
      switch (config?.actionType) {
        case "http": return <Globe className="h-5 w-5" />
        case "database": return <Database className="h-5 w-5" />
        case "email": return <Mail className="h-5 w-5" />
        case "transform": return <Code className="h-5 w-5" />
        default: return <Database className="h-5 w-5" />
      }
    }
    switch (type) {
      case "condition":
        return <GitBranch className="h-5 w-5" />
      case "output":
        return <Mail className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  // Obtener informacion de la fuente de datos del nodo
  const getDataSourceInfo = (node: Node, index: number) => {
    if (node.type === "trigger") {
      switch (node.config?.triggerType) {
        case "webhook":
          return { label: "HTTP Request", vars: ["body", "headers", "query"] }
        case "email":
          return { label: "Email entrante", vars: ["from", "subject", "body"] }
        case "schedule":
          return { label: `Cron: ${node.config?.cronExpression || "* * * * *"}`, vars: ["executionTime"] }
        case "database":
          return { label: `Tabla: ${node.config?.dbTable || "tabla"}`, vars: ["newData", "oldData"] }
        default:
          return null
      }
    }
    
    if (index > 0 && (node.type === "action" || node.type === "condition" || node.type === "output")) {
      const prevNode = nodes[index - 1]
      return { 
        label: `Datos de: ${prevNode?.label || "Nodo anterior"}`,
        from: prevNode?.id
      }
    }
    
    return null
  }

  // Obtener que variables produce este nodo
  const getOutputVars = (node: Node) => {
    // Si tiene variables de salida personalizadas, usar esas
    if (node.config?.outputVariables && node.config.outputVariables.length > 0) {
      return node.config.outputVariables
        .filter((v: any) => v.name)
        .map((v: any) => v.name)
    }
    
    if (node.type === "action") {
      switch (node.config?.actionType) {
        case "http": return ["response.data", "response.status"]
        case "database": return ["result.rows", "result.rowCount"]
        case "transform": return ["output"]
        default: return []
      }
    }
    if (node.type === "condition") {
      return ["result (true/false)"]
    }
    return []
  }

  // Obtener variables esperadas/de entrada
  const getExpectedVars = (node: Node) => {
    if (node.config?.expectedVariables && node.config.expectedVariables.length > 0) {
      return node.config.expectedVariables
        .filter((v: any) => v.name)
        .map((v: any) => ({ name: v.name, type: v.type }))
    }
    return []
  }

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-background relative overflow-auto"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full glass border-2 border-dashed border-primary/50 flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Canvas vacío</h3>
            <p className="text-sm text-muted-foreground">
              Haz clic en "Agregar nodo" para comenzar a construir tu flujo
            </p>
          </div>
        </div>
      )}

      {/* Connection lines */}
      {nodes.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node, index) => {
            if (index < nodes.length - 1) {
              const nextNode = nodes[index + 1]
              const isActive = isTestMode && (activeNode === node.id || activeNode === nextNode.id)
              return (
                <line
                  key={`line-${node.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${nextNode.x}%`}
                  y2={`${nextNode.y}%`}
                  stroke={isActive ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.3)"}
                  strokeWidth={isActive ? "3" : "2"}
                  className={isActive ? "animate-pulse" : ""}
                />
              )
            }
            return null
          })}
        </svg>
      )}

      {/* Nodes */}
      {nodes.map((node, index) => {
        const isActive = isTestMode && activeNode === node.id
        const isDragging = draggedNode === node.id
        const dataSource = getDataSourceInfo(node, index)
        const outputVars = getOutputVars(node)
        const expectedVars = getExpectedVars(node)

        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all ${
              selectedNode === node.id ? "scale-110 z-20" : "z-10"
            } ${isDragging ? "z-30" : ""} ${isActive ? "animate-pulse scale-110" : ""}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => onSelectNode(node.id)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
          >
            {/* Indicador de fuente de datos */}
            {dataSource && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border border-border">
                  <ArrowRight className="h-2.5 w-2.5" />
                  <span>{dataSource.label}</span>
                </div>
              </div>
            )}
            
            <div
              className={`glass rounded-lg p-4 min-w-[220px] max-w-[280px] border-2 ${
                selectedNode === node.id || isActive ? "border-primary neon-glow" : "border-border"
              } hover:border-primary/50 transition-colors ${isActive ? "bg-primary/20" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${node.color}/20`}>
                  <div className={`${node.color.replace("bg-", "text-")}`}>{getIcon(node.type, node.config)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{node.label}</p>
                  <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                </div>
              </div>
              
              {/* Mostrar variables esperadas definidas por el usuario */}
              {expectedVars.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground mb-1">Espera recibir:</p>
                  <div className="flex flex-wrap gap-1">
                    {expectedVars.slice(0, 3).map((v: any, i: number) => (
                      <code key={i} className="text-[9px] bg-blue-500/10 text-blue-500 px-1 py-0.5 rounded font-mono">
                        {v.name}
                      </code>
                    ))}
                    {expectedVars.length > 3 && (
                      <span className="text-[9px] text-muted-foreground">+{expectedVars.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Mostrar variables de entrada si no es trigger y no tiene vars esperadas */}
              {node.type !== "trigger" && dataSource?.from && expectedVars.length === 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground mb-1">Entrada:</p>
                  <code className="text-[10px] bg-muted/30 px-1.5 py-0.5 rounded text-primary/80 font-mono">
                    {`{{${dataSource.from}.output}}`}
                  </code>
                </div>
              )}
              
              {/* Mostrar configuracion clave segun tipo */}
              {node.config && (
                <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                  {node.type === "action" && node.config.actionType === "database" && node.config.tableName && (
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {node.config.dbOperation?.toUpperCase()} {node.config.tableName}
                      </span>
                    </div>
                  )}
                  {/* Mostrar columnas para INSERT */}
                  {node.type === "action" && node.config.actionType === "database" && node.config.dbOperation === "insert" && node.config.insertColumns?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] text-muted-foreground">Columnas:</p>
                      <div className="flex flex-wrap gap-1">
                        {node.config.insertColumns.filter((c: any) => c.column).slice(0, 3).map((col: any, i: number) => (
                          <code key={i} className="text-[9px] bg-green-500/10 text-green-600 px-1 py-0.5 rounded font-mono">
                            {col.column}
                          </code>
                        ))}
                        {node.config.insertColumns.filter((c: any) => c.column).length > 3 && (
                          <span className="text-[9px] text-muted-foreground">+{node.config.insertColumns.filter((c: any) => c.column).length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Mostrar columnas para UPDATE */}
                  {node.type === "action" && node.config.actionType === "database" && node.config.dbOperation === "update" && node.config.updateColumns?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] text-muted-foreground">Actualiza:</p>
                      <div className="flex flex-wrap gap-1">
                        {node.config.updateColumns.filter((c: any) => c.column).slice(0, 3).map((col: any, i: number) => (
                          <code key={i} className="text-[9px] bg-yellow-500/10 text-yellow-600 px-1 py-0.5 rounded font-mono">
                            {col.column}={col.value?.includes("{{") ? "var" : "..."}
                          </code>
                        ))}
                        {node.config.updateColumns.filter((c: any) => c.column).length > 3 && (
                          <span className="text-[9px] text-muted-foreground">+{node.config.updateColumns.filter((c: any) => c.column).length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Mostrar columnas para SELECT */}
                  {node.type === "action" && node.config.actionType === "database" && node.config.dbOperation === "select" && node.config.selectColumns && node.config.selectColumns !== "*" && (
                    <div className="space-y-1">
                      <p className="text-[9px] text-muted-foreground">Columnas:</p>
                      <code className="text-[9px] bg-blue-500/10 text-blue-500 px-1 py-0.5 rounded font-mono block truncate">
                        {node.config.selectColumns}
                      </code>
                    </div>
                  )}
                  {node.type === "action" && node.config.actionType === "database" && node.config.whereClause && (
                    <code className="text-[10px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded block truncate font-mono">
                      WHERE {node.config.whereClause}
                    </code>
                  )}
                  {node.type === "action" && node.config.actionType === "http" && node.config.endpoint && (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        {node.config.httpMethod || "GET"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {node.config.endpoint.replace(/^https?:\/\//, "").substring(0, 25)}...
                      </span>
                    </div>
                  )}
                  {node.type === "condition" && node.config.field && (
                    <code className="text-[10px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded block truncate font-mono">
                      {node.config.field} {node.config.operator} {node.config.value}
                    </code>
                  )}
                </div>
              )}
              
              {/* Variables que produce este nodo */}
              {outputVars.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground mb-1">Produce:</p>
                  <div className="flex flex-wrap gap-1">
                    {outputVars.slice(0, 2).map((v, i) => (
                      <code key={i} className="text-[9px] bg-green-500/10 text-green-600 px-1 py-0.5 rounded font-mono">
                        {v}
                      </code>
                    ))}
                    {outputVars.length > 2 && (
                      <span className="text-[9px] text-muted-foreground">+{outputVars.length - 2}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            {selectedNode === node.id && !isTestMode && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                Doble clic para editar
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
