"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Zap, Database, GitBranch, Mail, Trash2, Settings, Plus, Key, ExternalLink, CheckCircle2,
  Globe, FileJson, FileCode, Server, Shield, Lock, AlertCircle, Copy, Eye, EyeOff
} from "lucide-react"
import type { Node } from "./visual-flow-builder"
import {
  getCredentialsByType, emailProviders, databaseProviders, httpAuthTypes,
  type Credential
} from "@/lib/credentials-store"

// Definicion de variables disponibles por tipo de nodo/trigger
const variablesByTriggerType: Record<string, { name: string; path: string; type: string; description: string }[]> = {
  webhook: [
    { name: "body", path: "trigger.body", type: "object", description: "Cuerpo del request HTTP recibido" },
    { name: "headers", path: "trigger.headers", type: "object", description: "Headers del request" },
    { name: "method", path: "trigger.method", type: "string", description: "Metodo HTTP (GET, POST, etc)" },
    { name: "query", path: "trigger.query", type: "object", description: "Parametros de query string" },
    { name: "url", path: "trigger.url", type: "string", description: "URL completa del request" },
  ],
  email: [
    { name: "from", path: "trigger.email.from", type: "string", description: "Remitente del email" },
    { name: "to", path: "trigger.email.to", type: "string", description: "Destinatario del email" },
    { name: "subject", path: "trigger.email.subject", type: "string", description: "Asunto del email" },
    { name: "body", path: "trigger.email.body", type: "string", description: "Cuerpo del email en texto" },
    { name: "html", path: "trigger.email.html", type: "string", description: "Cuerpo del email en HTML" },
    { name: "attachments", path: "trigger.email.attachments", type: "array", description: "Archivos adjuntos" },
    { name: "date", path: "trigger.email.date", type: "date", description: "Fecha de recepcion" },
  ],
  schedule: [
    { name: "executionTime", path: "trigger.schedule.executionTime", type: "date", description: "Momento de ejecucion" },
    { name: "scheduleName", path: "trigger.schedule.name", type: "string", description: "Nombre del schedule" },
    { name: "cronExpression", path: "trigger.schedule.cron", type: "string", description: "Expresion cron configurada" },
  ],
  database: [
    { name: "operation", path: "trigger.db.operation", type: "string", description: "Tipo de operacion (INSERT, UPDATE, DELETE)" },
    { name: "table", path: "trigger.db.table", type: "string", description: "Tabla afectada" },
    { name: "newData", path: "trigger.db.new", type: "object", description: "Datos nuevos del registro" },
    { name: "oldData", path: "trigger.db.old", type: "object", description: "Datos anteriores del registro" },
    { name: "primaryKey", path: "trigger.db.pk", type: "any", description: "Llave primaria del registro" },
  ],
}

const variablesByActionType: Record<string, { name: string; path: string; type: string; description: string }[]> = {
  http: [
    { name: "status", path: "{{nodeId}}.response.status", type: "number", description: "Codigo de estado HTTP" },
    { name: "data", path: "{{nodeId}}.response.data", type: "object", description: "Datos de la respuesta" },
    { name: "headers", path: "{{nodeId}}.response.headers", type: "object", description: "Headers de respuesta" },
  ],
  database: [
    { name: "rows", path: "{{nodeId}}.result.rows", type: "array", description: "Filas retornadas (SELECT)" },
    { name: "rowCount", path: "{{nodeId}}.result.rowCount", type: "number", description: "Cantidad de filas afectadas" },
    { name: "insertId", path: "{{nodeId}}.result.insertId", type: "number", description: "ID del registro insertado" },
  ],
  transform: [
    { name: "output", path: "{{nodeId}}.output", type: "any", description: "Resultado de la transformacion" },
  ],
  email: [
    { name: "messageId", path: "{{nodeId}}.result.messageId", type: "string", description: "ID del mensaje enviado" },
    { name: "success", path: "{{nodeId}}.result.success", type: "boolean", description: "Si el envio fue exitoso" },
  ],
}

const nodeTypes = [
  { value: "trigger", label: "Disparador", icon: Zap, color: "bg-primary" },
  { value: "action", label: "Acción", icon: Database, color: "bg-secondary" },
  { value: "condition", label: "Condición", icon: GitBranch, color: "bg-yellow-500" },
  { value: "output", label: "Salida", icon: Mail, color: "bg-green-500" },
]

export function EditNodeDialog({
  open,
  onOpenChange,
  node,
  allNodes = [],
  onUpdateNode,
  onDeleteNode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: Node | null
  allNodes?: Node[]
  onUpdateNode: (nodeId: string, nodeName: string, nodeType: string, description?: string, config?: any) => void
  onDeleteNode: (nodeId: string) => void
}) {
  const [nodeName, setNodeName] = useState("")
  const [nodeType, setNodeType] = useState("")
  const [description, setDescription] = useState("")
  const [config, setConfig] = useState<Record<string, any>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showAddCredential, setShowAddCredential] = useState(false)
  const [newCredentialStep, setNewCredentialStep] = useState(1)
  const [newCredentialConfig, setNewCredentialConfig] = useState<Record<string, any>>({})
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  // Obtener credenciales disponibles
  const emailCredentials = getCredentialsByType("email")
  const databaseCredentials = getCredentialsByType("database")
  const apiCredentials = getCredentialsByType("api")

  useEffect(() => {
    if (node && open) {
      setNodeName(node.label)
      setNodeType(node.type)
      setDescription(node.description || "")
      setConfig(node.config || {})
      setShowAddCredential(false)
      setNewCredentialStep(1)
      setNewCredentialConfig({})
      setConnectionStatus("idle")
    }
  }, [node, open])

  const handleUpdate = () => {
    if (node && nodeName && nodeType) {
      onUpdateNode(node.id, nodeName, nodeType, description, config)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (node) {
      onDeleteNode(node.id)
      onOpenChange(false)
    }
  }

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const testConnection = () => {
    setTestingConnection(true)
    setConnectionStatus("idle")
    setTimeout(() => {
      setTestingConnection(false)
      setConnectionStatus(Math.random() > 0.2 ? "success" : "error")
    }, 2000)
  }

  // Obtener el indice del nodo actual y nodos anteriores
  const currentNodeIndex = allNodes.findIndex(n => n.id === node?.id)
  const previousNodes = currentNodeIndex > 0 ? allNodes.slice(0, currentNodeIndex) : []

  // Construir variables disponibles basadas en nodos anteriores
  const getAvailableVariables = () => {
    const variables: { source: string; sourceLabel: string; vars: { name: string; path: string; type: string; description: string }[] }[] = []
    
    previousNodes.forEach((prevNode) => {
      if (prevNode.type === "trigger") {
        const triggerType = prevNode.config?.triggerType
        if (triggerType && variablesByTriggerType[triggerType]) {
          variables.push({
            source: prevNode.id,
            sourceLabel: prevNode.label,
            vars: variablesByTriggerType[triggerType],
          })
        }
      } else if (prevNode.type === "action") {
        const actionType = prevNode.config?.actionType
        if (actionType && variablesByActionType[actionType]) {
          variables.push({
            source: prevNode.id,
            sourceLabel: prevNode.label,
            vars: variablesByActionType[actionType].map(v => ({
              ...v,
              path: v.path.replace("{{nodeId}}", prevNode.id),
            })),
          })
        }
      } else if (prevNode.type === "condition") {
        variables.push({
          source: prevNode.id,
          sourceLabel: prevNode.label,
          vars: [
            { name: "result", path: `${prevNode.id}.condition.result`, type: "boolean", description: "Resultado de la condicion (true/false)" },
            { name: "branch", path: `${prevNode.id}.condition.branch`, type: "string", description: "Rama tomada (true/false)" },
          ],
        })
      }
    })
    
    return variables
  }

  const availableVariables = getAvailableVariables()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`{{${text}}}`)
  }

  if (!node) return null

  // Renderizar configuración de email completa
  const renderEmailConfig = () => {
    const selectedCredential = emailCredentials.find((c) => c.id === config.emailCredentialId)

    if (showAddCredential) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Nueva Conexión de Email</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowAddCredential(false)}>
              Cancelar
            </Button>
          </div>

          {newCredentialStep === 1 && (
            <div className="space-y-3">
              <Label className="text-foreground">Selecciona el proveedor</Label>
              <div className="grid grid-cols-2 gap-3">
                {emailProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      newCredentialConfig.provider === provider.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setNewCredentialConfig({ provider: provider.id, authType: provider.authType })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${provider.color} flex items-center justify-center`}>
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">{provider.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                disabled={!newCredentialConfig.provider}
                onClick={() => setNewCredentialStep(2)}
              >
                Continuar
              </Button>
            </div>
          )}

          {newCredentialStep === 2 && newCredentialConfig.provider === "imap" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h5 className="font-medium text-foreground mb-2">Configuración IMAP (Recepción)</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Servidor IMAP</Label>
                    <Input
                      placeholder="imap.servidor.com"
                      value={newCredentialConfig.imapHost || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, imapHost: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Puerto</Label>
                    <Input
                      placeholder="993"
                      type="number"
                      value={newCredentialConfig.imapPort || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, imapPort: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h5 className="font-medium text-foreground mb-2">Configuración SMTP (Envío)</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Servidor SMTP</Label>
                    <Input
                      placeholder="smtp.servidor.com"
                      value={newCredentialConfig.smtpHost || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, smtpHost: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Puerto</Label>
                    <Input
                      placeholder="587"
                      type="number"
                      value={newCredentialConfig.smtpPort || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, smtpPort: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h5 className="font-medium text-foreground mb-2">Credenciales</h5>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Email / Usuario</Label>
                    <Input
                      placeholder="usuario@dominio.com"
                      value={newCredentialConfig.username || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, username: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={newCredentialConfig.password || ""}
                        onChange={(e) => setNewCredentialConfig((p) => ({ ...p, password: e.target.value }))}
                        className="glass border-border bg-transparent pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Usar SSL/TLS</span>
                </div>
                <Switch
                  checked={newCredentialConfig.useSSL !== false}
                  onCheckedChange={(checked) => setNewCredentialConfig((p) => ({ ...p, useSSL: checked }))}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setNewCredentialStep(1)}>
                  Atrás
                </Button>
                <Button
                  className="flex-1"
                  onClick={testConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? "Probando..." : "Probar Conexión"}
                </Button>
              </div>

              {connectionStatus === "success" && (
                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">Conexión exitosa</span>
                </div>
              )}

              {connectionStatus === "error" && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">Error de conexión. Verifica las credenciales.</span>
                </div>
              )}

              {connectionStatus === "success" && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    updateConfig("emailCredentialId", `new-${Date.now()}`)
                    updateConfig("emailConfig", newCredentialConfig)
                    setShowAddCredential(false)
                  }}
                >
                  Guardar y Usar Esta Conexión
                </Button>
              )}
            </div>
          )}

          {newCredentialStep === 2 && newCredentialConfig.provider !== "imap" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h5 className="font-medium text-foreground mb-2">Configuración OAuth 2.0</h5>
                <p className="text-sm text-muted-foreground mb-4">
                  Para conectar con {emailProviders.find((p) => p.id === newCredentialConfig.provider)?.name},
                  necesitas configurar una aplicación OAuth.
                </p>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Client ID</Label>
                    <Input
                      placeholder="Tu Client ID de la aplicación"
                      value={newCredentialConfig.clientId || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, clientId: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Client Secret</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu Client Secret"
                        value={newCredentialConfig.clientSecret || ""}
                        onChange={(e) => setNewCredentialConfig((p) => ({ ...p, clientSecret: e.target.value }))}
                        className="glass border-border bg-transparent pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/20 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">URL de Callback (copia esto en tu app OAuth):</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-muted/30 p-2 rounded">
                        https://tudominio.com/api/oauth/callback
                      </code>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setNewCredentialStep(1)}>
                  Atrás
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!newCredentialConfig.clientId || !newCredentialConfig.clientSecret}
                  onClick={() => {
                    updateConfig("emailCredentialId", `new-${Date.now()}`)
                    updateConfig("emailConfig", newCredentialConfig)
                    setShowAddCredential(false)
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Autorizar con {emailProviders.find((p) => p.id === newCredentialConfig.provider)?.name}
                </Button>
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">Cuenta de Email</Label>
          {emailCredentials.length > 0 ? (
            <Select
              value={config.emailCredentialId || ""}
              onValueChange={(v) => updateConfig("emailCredentialId", v)}
            >
              <SelectTrigger className="glass border-border bg-transparent">
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                {emailCredentials.map((cred) => (
                  <SelectItem key={cred.id} value={cred.id}>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{cred.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {cred.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-500">
              No hay cuentas de email configuradas
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full glass border-border bg-transparent hover:border-primary/50"
          onClick={() => setShowAddCredential(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nueva Cuenta de Email
        </Button>

        {selectedCredential && (
          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Filtro de Asunto (opcional)</Label>
              <Input
                placeholder="Ej: [Pedido], Factura, URGENTE"
                value={config.subjectFilter || ""}
                onChange={(e) => updateConfig("subjectFilter", e.target.value)}
                className="glass border-border bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Filtro de Remitente (opcional)</Label>
              <Input
                placeholder="Ej: ventas@proveedor.com"
                value={config.senderFilter || ""}
                onChange={(e) => updateConfig("senderFilter", e.target.value)}
                className="glass border-border bg-transparent"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm text-foreground">Marcar como leído después de procesar</span>
              <Switch
                checked={config.markAsRead !== false}
                onCheckedChange={(checked) => updateConfig("markAsRead", checked)}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Renderizar configuración de base de datos
  const renderDatabaseConfig = () => {
    if (showAddCredential) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Nueva Conexión de Base de Datos</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowAddCredential(false)}>
              Cancelar
            </Button>
          </div>

          {newCredentialStep === 1 && (
            <div className="space-y-3">
              <Label className="text-foreground">Selecciona el motor de base de datos</Label>
              <div className="grid grid-cols-2 gap-3">
                {databaseProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      newCredentialConfig.provider === provider.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setNewCredentialConfig({
                        provider: provider.id,
                        port: provider.defaultPort,
                        ssl: provider.supportsSSL,
                      })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${provider.color} flex items-center justify-center`}>
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">Puerto: {provider.defaultPort}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                disabled={!newCredentialConfig.provider}
                onClick={() => setNewCredentialStep(2)}
              >
                Continuar
              </Button>
            </div>
          )}

          {newCredentialStep === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h5 className="font-medium text-foreground mb-3">Conexión al Servidor</h5>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm">Host / IP</Label>
                    <Input
                      placeholder="localhost o db.servidor.com"
                      value={newCredentialConfig.host || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, host: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Puerto</Label>
                    <Input
                      type="number"
                      value={newCredentialConfig.port || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, port: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <Label className="text-sm">Nombre de la Base de Datos</Label>
                  <Input
                    placeholder="mi_base_datos"
                    value={newCredentialConfig.database || ""}
                    onChange={(e) => setNewCredentialConfig((p) => ({ ...p, database: e.target.value }))}
                    className="glass border-border bg-transparent"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h5 className="font-medium text-foreground mb-3">Autenticación</h5>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Usuario</Label>
                    <Input
                      placeholder="admin"
                      value={newCredentialConfig.username || ""}
                      onChange={(e) => setNewCredentialConfig((p) => ({ ...p, username: e.target.value }))}
                      className="glass border-border bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={newCredentialConfig.password || ""}
                        onChange={(e) => setNewCredentialConfig((p) => ({ ...p, password: e.target.value }))}
                        className="glass border-border bg-transparent pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Seguridad SSL/TLS
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Habilitar SSL</span>
                    <Switch
                      checked={newCredentialConfig.ssl !== false}
                      onCheckedChange={(checked) => setNewCredentialConfig((p) => ({ ...p, ssl: checked }))}
                    />
                  </div>
                  {newCredentialConfig.ssl && (
                    <div className="space-y-2">
                      <Label className="text-sm">Modo SSL</Label>
                      <Select
                        value={newCredentialConfig.sslMode || "require"}
                        onValueChange={(v) => setNewCredentialConfig((p) => ({ ...p, sslMode: v }))}
                      >
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="disable">Deshabilitado</SelectItem>
                          <SelectItem value="allow">Permitir</SelectItem>
                          <SelectItem value="prefer">Preferir</SelectItem>
                          <SelectItem value="require">Requerido</SelectItem>
                          <SelectItem value="verify-ca">Verificar CA</SelectItem>
                          <SelectItem value="verify-full">Verificación Completa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {newCredentialConfig.ssl && (
                    <div className="space-y-2">
                      <Label className="text-sm">Certificado CA (opcional)</Label>
                      <Textarea
                        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                        value={newCredentialConfig.caCert || ""}
                        onChange={(e) => setNewCredentialConfig((p) => ({ ...p, caCert: e.target.value }))}
                        className="glass border-border bg-transparent font-mono text-xs min-h-[80px]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setNewCredentialStep(1)}>
                  Atrás
                </Button>
                <Button className="flex-1" onClick={testConnection} disabled={testingConnection}>
                  {testingConnection ? "Probando..." : "Probar Conexión"}
                </Button>
              </div>

              {connectionStatus === "success" && (
                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">Conexión exitosa</span>
                </div>
              )}

              {connectionStatus === "error" && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">Error de conexión. Verifica los datos.</span>
                </div>
              )}

              {connectionStatus === "success" && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    updateConfig("dbCredentialId", `new-${Date.now()}`)
                    updateConfig("dbConfig", newCredentialConfig)
                    setShowAddCredential(false)
                  }}
                >
                  Guardar y Usar Esta Conexión
                </Button>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">Conexión de Base de Datos</Label>
          {databaseCredentials.length > 0 ? (
            <Select
              value={config.dbCredentialId || ""}
              onValueChange={(v) => updateConfig("dbCredentialId", v)}
            >
              <SelectTrigger className="glass border-border bg-transparent">
                <SelectValue placeholder="Selecciona una conexión" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                {databaseCredentials.map((cred) => (
                  <SelectItem key={cred.id} value={cred.id}>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>{cred.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {cred.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-500">
              No hay conexiones de base de datos configuradas
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full glass border-border bg-transparent hover:border-primary/50"
          onClick={() => setShowAddCredential(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nueva Conexión
        </Button>

        {config.dbCredentialId && (
          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Operación</Label>
              <Select value={config.dbOperation || ""} onValueChange={(v) => updateConfig("dbOperation", v)}>
                <SelectTrigger className="glass border-border bg-transparent">
                  <SelectValue placeholder="Selecciona operación" />
                </SelectTrigger>
                <SelectContent className="glass border-border">
                  <SelectItem value="select">SELECT - Consultar datos</SelectItem>
                  <SelectItem value="insert">INSERT - Insertar registros</SelectItem>
                  <SelectItem value="update">UPDATE - Actualizar registros</SelectItem>
                  <SelectItem value="delete">DELETE - Eliminar registros</SelectItem>
                  <SelectItem value="custom">Query SQL personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.dbOperation !== "custom" && (
              <div className="space-y-2">
                <Label className="text-foreground">Tabla</Label>
                <Input
                  placeholder="nombre_tabla"
                  value={config.tableName || ""}
                  onChange={(e) => updateConfig("tableName", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
            )}

            {config.dbOperation === "custom" && (
              <div className="space-y-2">
                <Label className="text-foreground">Query SQL</Label>
                <Textarea
                  placeholder="SELECT * FROM usuarios WHERE id = {{data.userId}}"
                  value={config.customQuery || ""}
                  onChange={(e) => updateConfig("customQuery", e.target.value)}
                  className="glass border-border bg-transparent font-mono text-sm min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Usa {"{{variable}}"} para insertar valores dinámicos
                </p>
              </div>
            )}

            {(config.dbOperation === "select" || config.dbOperation === "update" || config.dbOperation === "delete") && (
              <div className="space-y-2">
                <Label className="text-foreground">Condición WHERE</Label>
                <Input
                  placeholder="id = {{data.id}} AND status = 'active'"
                  value={config.whereClause || ""}
                  onChange={(e) => updateConfig("whereClause", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Renderizar configuración HTTP
  const renderHttpConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-1 space-y-2">
          <Label className="text-foreground">Método</Label>
          <Select value={config.httpMethod || "GET"} onValueChange={(v) => updateConfig("httpMethod", v)}>
            <SelectTrigger className="glass border-border bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="HEAD">HEAD</SelectItem>
              <SelectItem value="OPTIONS">OPTIONS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3 space-y-2">
          <Label className="text-foreground">URL del Endpoint</Label>
          <Input
            placeholder="https://api.ejemplo.com/endpoint"
            value={config.endpoint || ""}
            onChange={(e) => updateConfig("endpoint", e.target.value)}
            className="glass border-border bg-transparent"
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="auth" className="border-border">
          <AccordionTrigger className="text-foreground hover:no-underline">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Autenticación
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label className="text-foreground">Tipo de Autenticación</Label>
              <Select value={config.authType || "none"} onValueChange={(v) => updateConfig("authType", v)}>
                <SelectTrigger className="glass border-border bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border">
                  {httpAuthTypes.map((auth) => (
                    <SelectItem key={auth.id} value={auth.id}>
                      <div>
                        <span>{auth.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">- {auth.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {config.authType === "bearer" && (
              <div className="space-y-2">
                <Label className="text-foreground">Token Bearer</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="eyJhbGciOiJIUzI1NiIs..."
                    value={config.bearerToken || ""}
                    onChange={(e) => updateConfig("bearerToken", e.target.value)}
                    className="glass border-border bg-transparent pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            {config.authType === "basic" && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">Usuario</Label>
                  <Input
                    placeholder="usuario"
                    value={config.basicUser || ""}
                    onChange={(e) => updateConfig("basicUser", e.target.value)}
                    className="glass border-border bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={config.basicPassword || ""}
                      onChange={(e) => updateConfig("basicPassword", e.target.value)}
                      className="glass border-border bg-transparent pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {config.authType === "apikey" && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">Nombre del Header / Parámetro</Label>
                  <Input
                    placeholder="X-API-Key"
                    value={config.apiKeyName || ""}
                    onChange={(e) => updateConfig("apiKeyName", e.target.value)}
                    className="glass border-border bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Valor de la API Key</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="sk_live_..."
                      value={config.apiKeyValue || ""}
                      onChange={(e) => updateConfig("apiKeyValue", e.target.value)}
                      className="glass border-border bg-transparent pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Ubicación</Label>
                  <Select value={config.apiKeyLocation || "header"} onValueChange={(v) => updateConfig("apiKeyLocation", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="query">Query Parameter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {config.authType === "oauth2" && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">Usar Credencial OAuth</Label>
                  <Select
                    value={config.oauthCredentialId || ""}
                    onValueChange={(v) => updateConfig("oauthCredentialId", v)}
                  >
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona credencial" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      {apiCredentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="w-full glass border-border bg-transparent"
                  onClick={() => setShowAddCredential(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Configurar Nueva Credencial OAuth
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="headers" className="border-border">
          <AccordionTrigger className="text-foreground hover:no-underline">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Headers
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <Textarea
              placeholder={'{\n  "Content-Type": "application/json",\n  "Accept": "application/json"\n}'}
              value={config.headers || ""}
              onChange={(e) => updateConfig("headers", e.target.value)}
              className="glass border-border bg-transparent font-mono text-sm min-h-[100px]"
            />
          </AccordionContent>
        </AccordionItem>

        {["POST", "PUT", "PATCH"].includes(config.httpMethod || "GET") && (
          <AccordionItem value="body" className="border-border">
            <AccordionTrigger className="text-foreground hover:no-underline">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Body
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label className="text-foreground">Tipo de Contenido</Label>
                <Select
                  value={config.bodyType || "json"}
                  onValueChange={(v) => updateConfig("bodyType", v)}
                >
                  <SelectTrigger className="glass border-border bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="form">Form URL Encoded</SelectItem>
                    <SelectItem value="multipart">Multipart Form Data</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="text">Text/Plain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder={
                  config.bodyType === "xml"
                    ? '<?xml version="1.0"?>\n<root>\n  <element>value</element>\n</root>'
                    : '{\n  "key": "{{data.value}}",\n  "nombre": "{{data.nombre}}"\n}'
                }
                value={config.body || ""}
                onChange={(e) => updateConfig("body", e.target.value)}
                className="glass border-border bg-transparent font-mono text-sm min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Usa {"{{variable}}"} para insertar valores dinámicos del paso anterior
              </p>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="response" className="border-border">
          <AccordionTrigger className="text-foreground hover:no-underline">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Manejo de Respuesta
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label className="text-foreground">Timeout (segundos)</Label>
              <Input
                type="number"
                placeholder="30"
                value={config.timeout || ""}
                onChange={(e) => updateConfig("timeout", e.target.value)}
                className="glass border-border bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Reintentos en caso de error</Label>
              <Select value={config.retries || "0"} onValueChange={(v) => updateConfig("retries", v)}>
                <SelectTrigger className="glass border-border bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border">
                  <SelectItem value="0">Sin reintentos</SelectItem>
                  <SelectItem value="1">1 reintento</SelectItem>
                  <SelectItem value="2">2 reintentos</SelectItem>
                  <SelectItem value="3">3 reintentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <span className="text-sm text-foreground">Ignorar errores SSL</span>
              <Switch
                checked={config.ignoreSSLErrors === true}
                onCheckedChange={(checked) => updateConfig("ignoreSSLErrors", checked)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  // Renderizar configuración XML
  const renderXmlConfig = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          Constructor de XML
        </h5>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-foreground">Elemento Raíz</Label>
            <Input
              placeholder="root"
              value={config.xmlRoot || ""}
              onChange={(e) => updateConfig("xmlRoot", e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Namespace (opcional)</Label>
            <Input
              placeholder="http://ejemplo.com/schema"
              value={config.xmlNamespace || ""}
              onChange={(e) => updateConfig("xmlNamespace", e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Estructura XML</Label>
            <Textarea
              placeholder={`<?xml version="1.0" encoding="UTF-8"?>
<pedido>
  <cliente>
    <nombre>{{data.nombre}}</nombre>
    <email>{{data.email}}</email>
  </cliente>
  <items>
    {{#each data.items}}
    <item>
      <producto>{{this.producto}}</producto>
      <cantidad>{{this.cantidad}}</cantidad>
    </item>
    {{/each}}
  </items>
</pedido>`}
              value={config.xmlTemplate || ""}
              onChange={(e) => updateConfig("xmlTemplate", e.target.value)}
              className="glass border-border bg-transparent font-mono text-sm min-h-[200px]"
            />
          </div>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground mb-2">Sintaxis disponible:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="bg-muted/30 px-1 rounded">{"{{variable}}"}</code> - Insertar valor</li>
              <li><code className="bg-muted/30 px-1 rounded">{"{{#each array}}...{{/each}}"}</code> - Iterar array</li>
              <li><code className="bg-muted/30 px-1 rounded">{"{{#if condicion}}...{{/if}}"}</code> - Condicional</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
        <span className="text-sm text-foreground">Validar XML contra XSD</span>
        <Switch
          checked={config.validateXSD === true}
          onCheckedChange={(checked) => updateConfig("validateXSD", checked)}
        />
      </div>

      {config.validateXSD && (
        <div className="space-y-2">
          <Label className="text-foreground">URL del Schema XSD</Label>
          <Input
            placeholder="https://ejemplo.com/schema.xsd"
            value={config.xsdUrl || ""}
            onChange={(e) => updateConfig("xsdUrl", e.target.value)}
            className="glass border-border bg-transparent"
          />
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Nodo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifica las propiedades y configuración de este nodo
          </DialogDescription>
        </DialogHeader>

<Tabs defaultValue="general" className="w-full">
  <TabsList className="grid w-full grid-cols-3 glass">
  <TabsTrigger value="general">General</TabsTrigger>
  <TabsTrigger value="config">Configuracion</TabsTrigger>
  <TabsTrigger value="variables">Variables</TabsTrigger>
  </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-node-name" className="text-foreground">
                Nombre del Nodo
              </Label>
              <Input
                id="edit-node-name"
                placeholder="Ej: Enviar notificación"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="glass border-border bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-node-type" className="text-foreground">
                Tipo de Nodo
              </Label>
              <Select value={nodeType} onValueChange={setNodeType}>
                <SelectTrigger className="glass border-border bg-transparent">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent className="glass border-border">
                  {nodeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-node-description" className="text-foreground">
                Descripción (opcional)
              </Label>
              <Textarea
                id="edit-node-description"
                placeholder="Describe qué hace este nodo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass border-border bg-transparent min-h-[80px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-foreground font-medium mb-4">
              <Settings className="h-4 w-4" />
              Configuración del Nodo
            </div>

            {/* TRIGGER CONFIG */}
            {nodeType === "trigger" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Disparador</Label>
                  <Select value={config.triggerType || ""} onValueChange={(v) => updateConfig("triggerType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="webhook">Webhook HTTP</SelectItem>
                      <SelectItem value="schedule">Programado (Cron)</SelectItem>
                      <SelectItem value="email">Email Recibido</SelectItem>
                      <SelectItem value="database">Cambio en Base de Datos</SelectItem>
                      <SelectItem value="file">Archivo Nuevo/Modificado</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.triggerType === "webhook" && renderHttpConfig()}
                {config.triggerType === "email" && renderEmailConfig()}
                {config.triggerType === "database" && renderDatabaseConfig()}

                {config.triggerType === "schedule" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Expresión Cron</Label>
                      <Input
                        placeholder="0 0 * * *"
                        value={config.cronExpression || ""}
                        onChange={(e) => updateConfig("cronExpression", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">Ejemplos comunes:</p>
                      <p><code className="bg-muted/30 px-1 rounded">* * * * *</code> - Cada minuto</p>
                      <p><code className="bg-muted/30 px-1 rounded">0 * * * *</code> - Cada hora</p>
                      <p><code className="bg-muted/30 px-1 rounded">0 0 * * *</code> - Diario a medianoche</p>
                      <p><code className="bg-muted/30 px-1 rounded">0 8 * * 1-5</code> - Lunes a viernes a las 8:00</p>
                      <p><code className="bg-muted/30 px-1 rounded">0 0 1 * *</code> - Primer día de cada mes</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Zona Horaria</Label>
                      <Select value={config.timezone || "America/Bogota"} onValueChange={(v) => updateConfig("timezone", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="America/Bogota">America/Bogota (UTC-5)</SelectItem>
                          <SelectItem value="America/Mexico_City">America/Mexico_City (UTC-6)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                          <SelectItem value="Europe/Madrid">Europe/Madrid (UTC+1)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACTION CONFIG */}
            {nodeType === "action" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Acción</Label>
                  <Select value={config.actionType || ""} onValueChange={(v) => updateConfig("actionType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="http">Petición HTTP / API</SelectItem>
                      <SelectItem value="database">Operación en Base de Datos</SelectItem>
                      <SelectItem value="email">Enviar Email</SelectItem>
                      <SelectItem value="transform">Transformar Datos</SelectItem>
                      <SelectItem value="xml">Construir/Parsear XML</SelectItem>
                      <SelectItem value="json">Manipular JSON</SelectItem>
                      <SelectItem value="file">Operación con Archivos</SelectItem>
                      <SelectItem value="script">Ejecutar Script</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.actionType === "http" && renderHttpConfig()}
                {config.actionType === "database" && renderDatabaseConfig()}
                {config.actionType === "email" && renderEmailConfig()}
                {config.actionType === "xml" && renderXmlConfig()}

                {config.actionType === "transform" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Código de Transformación</Label>
                      <Textarea
                        placeholder={`// Transforma los datos
// La variable 'data' contiene los datos del paso anterior
return {
  ...data,
  processed: true,
  timestamp: new Date().toISOString()
}`}
                        value={config.transformCode || ""}
                        onChange={(e) => updateConfig("transformCode", e.target.value)}
                        className="glass border-border bg-transparent font-mono text-sm min-h-[200px]"
                      />
                    </div>
                  </div>
                )}

                {config.actionType === "json" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Operación JSON</Label>
                      <Select value={config.jsonOperation || ""} onValueChange={(v) => updateConfig("jsonOperation", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue placeholder="Selecciona operación" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="parse">Parsear JSON a Objeto</SelectItem>
                          <SelectItem value="stringify">Objeto a JSON String</SelectItem>
                          <SelectItem value="extract">Extraer Campo (JSONPath)</SelectItem>
                          <SelectItem value="merge">Combinar Objetos</SelectItem>
                          <SelectItem value="filter">Filtrar Array</SelectItem>
                          <SelectItem value="map">Mapear Array</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {config.jsonOperation === "extract" && (
                      <div className="space-y-2">
                        <Label className="text-foreground">JSONPath</Label>
                        <Input
                          placeholder="$.data.items[*].name"
                          value={config.jsonPath || ""}
                          onChange={(e) => updateConfig("jsonPath", e.target.value)}
                          className="glass border-border bg-transparent"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CONDITION CONFIG */}
            {nodeType === "condition" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Campo a Evaluar</Label>
                  <Input
                    placeholder="Ej: response.status, data.amount"
                    value={config.field || ""}
                    onChange={(e) => updateConfig("field", e.target.value)}
                    className="glass border-border bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Operador</Label>
                  <Select value={config.operator || ""} onValueChange={(v) => updateConfig("operator", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona operador" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="equals">Igual a (==)</SelectItem>
                      <SelectItem value="notEquals">Diferente de (!=)</SelectItem>
                      <SelectItem value="greater">Mayor que (&gt;)</SelectItem>
                      <SelectItem value="greaterOrEqual">Mayor o igual (&gt;=)</SelectItem>
                      <SelectItem value="less">Menor que (&lt;)</SelectItem>
                      <SelectItem value="lessOrEqual">Menor o igual (&lt;=)</SelectItem>
                      <SelectItem value="contains">Contiene</SelectItem>
                      <SelectItem value="notContains">No contiene</SelectItem>
                      <SelectItem value="startsWith">Empieza con</SelectItem>
                      <SelectItem value="endsWith">Termina con</SelectItem>
                      <SelectItem value="isEmpty">Está vacío</SelectItem>
                      <SelectItem value="isNotEmpty">No está vacío</SelectItem>
                      <SelectItem value="regex">Expresión Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Valor a Comparar</Label>
                  <Input
                    placeholder="Ej: 200, 'success', true"
                    value={config.value || ""}
                    onChange={(e) => updateConfig("value", e.target.value)}
                    className="glass border-border bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* OUTPUT CONFIG */}
            {nodeType === "output" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Salida</Label>
                  <Select value={config.outputType || ""} onValueChange={(v) => updateConfig("outputType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="email">Enviar Email</SelectItem>
                      <SelectItem value="http">Respuesta HTTP</SelectItem>
                      <SelectItem value="database">Guardar en Base de Datos</SelectItem>
                      <SelectItem value="file">Generar Archivo</SelectItem>
                      <SelectItem value="webhook">Llamar Webhook</SelectItem>
                      <SelectItem value="log">Registrar en Log</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.outputType === "email" && renderEmailConfig()}
                {config.outputType === "database" && renderDatabaseConfig()}
                {config.outputType === "http" && renderHttpConfig()}

                {config.outputType === "file" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Formato del Archivo</Label>
                      <Select value={config.fileFormat || "json"} onValueChange={(v) => updateConfig("fileFormat", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="txt">Texto plano</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Nombre del Archivo</Label>
                      <Input
                        placeholder="resultado_{{timestamp}}.json"
                        value={config.fileName || ""}
                        onChange={(e) => updateConfig("fileName", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="variables" className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-foreground font-medium mb-4">
              <Key className="h-4 w-4" />
              Variables Disponibles
            </div>

            {node?.type === "trigger" ? (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-foreground font-medium mb-2">Este es un nodo Trigger</p>
                <p className="text-xs text-muted-foreground">
                  Como nodo inicial del flujo, genera las variables que estaran disponibles para los nodos siguientes.
                  Las variables que produce dependiendo del tipo de trigger configurado:
                </p>
                {config.triggerType && variablesByTriggerType[config.triggerType] && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-foreground">Variables que produce este trigger:</p>
                    {variablesByTriggerType[config.triggerType].map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-background/50 border border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded text-primary font-mono">
                              {`{{${v.path}}}`}
                            </code>
                            <Badge variant="outline" className="text-[10px]">{v.type}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">{v.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(v.path)}
                          title="Copiar variable"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : availableVariables.length === 0 ? (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Sin variables disponibles</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  No hay nodos anteriores que proporcionen variables. Asegurate de tener un trigger u otros nodos antes de este.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Usa estas variables en los campos de configuracion con el formato <code className="bg-muted/30 px-1 rounded">{"{{variable.path}}"}</code>
                </p>
                
                {availableVariables.map((source, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        previousNodes.find(n => n.id === source.source)?.type === "trigger" ? "bg-primary" :
                        previousNodes.find(n => n.id === source.source)?.type === "action" ? "bg-secondary" : "bg-yellow-500"
                      }`} />
                      <span className="text-sm font-medium text-foreground">{source.sourceLabel}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {previousNodes.find(n => n.id === source.source)?.type}
                      </Badge>
                    </div>
                    
                    <div className="ml-4 space-y-1.5">
                      {source.vars.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border hover:border-primary/30 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono truncate">
                                {`{{${v.path}}}`}
                              </code>
                              <Badge variant="outline" className="text-[10px] shrink-0">{v.type}</Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1 truncate">{v.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 ml-2"
                            onClick={() => copyToClipboard(v.path)}
                            title="Copiar al portapapeles"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <p className="text-xs font-medium text-foreground mb-2">Ejemplo de uso:</p>
                  <code className="text-xs bg-background/50 px-2 py-1 rounded block font-mono text-muted-foreground">
                    SELECT * FROM usuarios WHERE id = {`{{trigger.body.userId}}`}
                  </code>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4 border-t border-border">
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="glass border-border bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleUpdate} className="bg-primary hover:bg-primary/90">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
