"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, CheckCircle2, FileJson, Database, Globe } from "lucide-react"

interface ExportJsonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flowData: any
  flowName: string
}

export function ExportJsonDialog({ open, onOpenChange, flowData, flowName }: ExportJsonDialogProps) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState("full")

  const getFormattedJson = () => {
    if (exportFormat === "full") {
      return JSON.stringify(flowData, null, 2)
    } else if (exportFormat === "minimal") {
      // Solo los datos esenciales
      return JSON.stringify(
        {
          name: flowData.name,
          nodes: flowData.nodes.map((n: any) => ({
            type: n.type,
            label: n.label,
            config: n.config,
          })),
        },
        null,
        2
      )
    } else if (exportFormat === "api") {
      // Formato para API REST
      return JSON.stringify(
        {
          method: "POST",
          endpoint: "/api/flows/execute",
          body: {
            flowId: flowData.id,
            nodes: flowData.nodes,
            connections: flowData.connections,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_API_TOKEN",
          },
        },
        null,
        2
      )
    }
    return JSON.stringify(flowData, null, 2)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedJson())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([getFormattedJson()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${flowName.toLowerCase().replace(/\s+/g, "-")}-${exportFormat}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Exportar Flujo como JSON
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Exporta la configuración del flujo para guardar, compartir o usar en la API
          </DialogDescription>
        </DialogHeader>

        <Tabs value={exportFormat} onValueChange={setExportFormat} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="full" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Completo
            </TabsTrigger>
            <TabsTrigger value="minimal" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              Mínimo
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="full" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">JSON Completo</Badge>
              <span className="text-xs text-muted-foreground">
                Incluye toda la información del flujo para backup o migración
              </span>
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-muted/30 border border-border">
              <pre className="p-4 text-sm font-mono text-foreground whitespace-pre-wrap">
                {getFormattedJson()}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="minimal" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">JSON Mínimo</Badge>
              <span className="text-xs text-muted-foreground">
                Solo los datos esenciales del flujo
              </span>
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-muted/30 border border-border">
              <pre className="p-4 text-sm font-mono text-foreground whitespace-pre-wrap">
                {getFormattedJson()}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="api" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">API Request</Badge>
              <span className="text-xs text-muted-foreground">
                Formato listo para enviar a la API de ejecución
              </span>
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-muted/30 border border-border">
              <pre className="p-4 text-sm font-mono text-foreground whitespace-pre-wrap">
                {getFormattedJson()}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {flowData.nodes?.length || 0} nodos | {flowData.connections?.length || 0} conexiones
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="glass border-border bg-transparent">
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </>
              )}
            </Button>
            <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
