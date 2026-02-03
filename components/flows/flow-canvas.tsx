"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Zap, Database, Mail, GitBranch, CheckCircle, Plus } from "lucide-react"
import type { Node } from "./visual-flow-builder"

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

  const getIcon = (type: string) => {
    switch (type) {
      case "trigger":
        return <Zap className="h-5 w-5" />
      case "action":
        return <Database className="h-5 w-5" />
      case "condition":
        return <GitBranch className="h-5 w-5" />
      case "output":
        return <Mail className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
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
      {nodes.map((node) => {
        const isActive = isTestMode && activeNode === node.id
        const isDragging = draggedNode === node.id

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
            <div
              className={`glass rounded-lg p-4 min-w-[200px] border-2 ${
                selectedNode === node.id || isActive ? "border-primary neon-glow" : "border-border"
              } hover:border-primary/50 transition-colors ${isActive ? "bg-primary/20" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${node.color}/20`}>
                  <div className={`${node.color.replace("bg-", "text-")}`}>{getIcon(node.type)}</div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{node.label}</p>
                  <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                  {node.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{node.description}</p>
                  )}
                </div>
              </div>
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
