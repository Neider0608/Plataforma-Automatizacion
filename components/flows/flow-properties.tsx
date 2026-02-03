"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings } from "lucide-react"

export function FlowProperties() {
  return (
    <div className="h-full flex flex-col glass">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Propiedades del Nodo</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="node-name" className="text-foreground">
            Nombre del nodo
          </Label>
          <Input
            id="node-name"
            defaultValue="Webhook HTTP"
            className="glass border-border focus:border-primary bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-type" className="text-foreground">
            Tipo
          </Label>
          <Select defaultValue="trigger">
            <SelectTrigger className="glass border-border bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              <SelectItem value="trigger">Trigger</SelectItem>
              <SelectItem value="action">Acción</SelectItem>
              <SelectItem value="condition">Condición</SelectItem>
              <SelectItem value="output">Salida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-description" className="text-foreground">
            Descripción
          </Label>
          <Textarea
            id="node-description"
            placeholder="Describe qué hace este nodo..."
            className="glass border-border focus:border-primary bg-transparent min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credential" className="text-foreground">
            Credencial
          </Label>
          <Select>
            <SelectTrigger className="glass border-border bg-transparent">
              <SelectValue placeholder="Seleccionar credencial..." />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              <SelectItem value="api-key-1">API Key - Producción</SelectItem>
              <SelectItem value="api-key-2">API Key - Desarrollo</SelectItem>
              <SelectItem value="oauth-1">OAuth - Google</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-foreground">Parámetros</Label>

          <div className="space-y-2">
            <Label htmlFor="param-url" className="text-sm text-muted-foreground">
              URL
            </Label>
            <Input
              id="param-url"
              placeholder="https://api.example.com/webhook"
              className="glass border-border focus:border-primary bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="param-method" className="text-sm text-muted-foreground">
              Método HTTP
            </Label>
            <Select defaultValue="post">
              <SelectTrigger className="glass border-border bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                <SelectItem value="get">GET</SelectItem>
                <SelectItem value="post">POST</SelectItem>
                <SelectItem value="put">PUT</SelectItem>
                <SelectItem value="delete">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
