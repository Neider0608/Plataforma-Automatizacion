"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Database, GitBranch, Mail, Trash2, Settings, Plus, Key, ExternalLink, CheckCircle2 } from "lucide-react"
import type { Node } from "./visual-flow-builder"

const nodeTypes = [
  { value: "trigger", label: "Disparador", icon: Zap, color: "bg-primary" },
  { value: "action", label: "Accion", icon: Database, color: "bg-secondary" },
  { value: "condition", label: "Condicion", icon: GitBranch, color: "bg-yellow-500" },
  { value: "output", label: "Salida", icon: Mail, color: "bg-green-500" },
]

const emailProviders = [
  { id: "gmail", name: "Gmail", icon: "https://www.google.com/favicon.ico", color: "bg-red-500" },
  { id: "outlook", name: "Outlook / Office 365", icon: "https://outlook.live.com/favicon.ico", color: "bg-blue-500" },
  { id: "yahoo", name: "Yahoo Mail", icon: "https://www.yahoo.com/favicon.ico", color: "bg-purple-500" },
  { id: "imap", name: "IMAP / SMTP Custom", icon: null, color: "bg-gray-500" },
]

interface EmailCredential {
  id: string
  name: string
  provider: string
  email: string
  connected: boolean
}

const mockEmailCredentials: EmailCredential[] = [
  { id: "1", name: "Gmail Principal", provider: "gmail", email: "usuario@gmail.com", connected: true },
  { id: "2", name: "Outlook Empresa", provider: "outlook", email: "usuario@empresa.com", connected: true },
]

export function EditNodeDialog({
  open,
  onOpenChange,
  node,
  onUpdateNode,
  onDeleteNode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: Node | null
  onUpdateNode: (nodeId: string, nodeName: string, nodeType: string, description?: string, config?: any) => void
  onDeleteNode: (nodeId: string) => void
}) {
  const [nodeName, setNodeName] = useState("")
  const [nodeType, setNodeType] = useState("")
  const [description, setDescription] = useState("")
  const [config, setConfig] = useState<Record<string, any>>({})
  const [showAddCredential, setShowAddCredential] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<EmailCredential[]>(mockEmailCredentials)
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)

  useEffect(() => {
    if (node && open) {
      setNodeName(node.label)
      setNodeType(node.type)
      setDescription(node.description || "")
      setConfig(node.config || {})
      setShowAddCredential(false)
      setSelectedProvider(null)
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

  const handleConnectProvider = (providerId: string) => {
    setConnectingProvider(providerId)
    // Simular conexión OAuth
    setTimeout(() => {
      const newCredential: EmailCredential = {
        id: Date.now().toString(),
        name: `${emailProviders.find(p => p.id === providerId)?.name} - Nueva cuenta`,
        provider: providerId,
        email: `nuevo@${providerId}.com`,
        connected: true,
      }
      setCredentials(prev => [...prev, newCredential])
      updateConfig("emailCredentialId", newCredential.id)
      setConnectingProvider(null)
      setShowAddCredential(false)
      setSelectedProvider(null)
    }, 2000)
  }

  if (!node) return null

  const requiresEmailAuth =
    (nodeType === "trigger" && config.triggerType === "email") ||
    (nodeType === "action" && config.actionType === "email") ||
    (nodeType === "output" && config.outputType === "email")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Nodo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifica las propiedades y configuracion de este nodo
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="config">Configuracion</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-node-name" className="text-foreground">
                Nombre del Nodo
              </Label>
              <Input
                id="edit-node-name"
                placeholder="Ej: Enviar notificacion"
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
                Descripcion (opcional)
              </Label>
              <Textarea
                id="edit-node-description"
                placeholder="Describe que hace este nodo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass border-border bg-transparent min-h-[80px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-foreground font-medium mb-4">
              <Settings className="h-4 w-4" />
              Configuracion del Nodo
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
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="schedule">Programado (Cron)</SelectItem>
                      <SelectItem value="email">Email Recibido</SelectItem>
                      <SelectItem value="database">Cambio en Base de Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.triggerType === "webhook" && (
                  <div className="space-y-2">
                    <Label className="text-foreground">URL del Webhook</Label>
                    <Input
                      placeholder="https://api.ejemplo.com/webhook"
                      value={config.webhookUrl || ""}
                      onChange={(e) => updateConfig("webhookUrl", e.target.value)}
                      className="glass border-border bg-transparent"
                    />
                    <p className="text-xs text-muted-foreground">
                      Esta URL recibira las peticiones HTTP que disparan el flujo
                    </p>
                  </div>
                )}

                {config.triggerType === "schedule" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Expresion Cron</Label>
                      <Input
                        placeholder="0 0 * * *"
                        value={config.cronExpression || ""}
                        onChange={(e) => updateConfig("cronExpression", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">Ejemplos comunes:</p>
                      <p>0 * * * * - Cada hora</p>
                      <p>0 0 * * * - Diario a medianoche</p>
                      <p>0 8 * * 1-5 - Lunes a viernes a las 8:00</p>
                      <p>0 0 1 * * - Primer dia de cada mes</p>
                    </div>
                  </div>
                )}

                {config.triggerType === "database" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Tabla</Label>
                      <Input
                        placeholder="nombre_tabla"
                        value={config.dbTable || ""}
                        onChange={(e) => updateConfig("dbTable", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Evento</Label>
                      <Select value={config.dbEvent || ""} onValueChange={(v) => updateConfig("dbEvent", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue placeholder="Selecciona evento" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="INSERT">INSERT - Nuevo registro</SelectItem>
                          <SelectItem value="UPDATE">UPDATE - Actualizacion</SelectItem>
                          <SelectItem value="DELETE">DELETE - Eliminacion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {config.triggerType === "email" && renderEmailConfig()}
              </div>
            )}

            {/* ACTION CONFIG */}
            {nodeType === "action" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Accion</Label>
                  <Select value={config.actionType || ""} onValueChange={(v) => updateConfig("actionType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="http">Peticion HTTP / API</SelectItem>
                      <SelectItem value="database">Operacion en Base de Datos</SelectItem>
                      <SelectItem value="email">Enviar Email</SelectItem>
                      <SelectItem value="transform">Transformar Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.actionType === "http" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Metodo HTTP</Label>
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">URL del Endpoint</Label>
                      <Input
                        placeholder="https://api.ejemplo.com/endpoint"
                        value={config.endpoint || ""}
                        onChange={(e) => updateConfig("endpoint", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Headers (JSON)</Label>
                      <Textarea
                        placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
                        value={config.headers || ""}
                        onChange={(e) => updateConfig("headers", e.target.value)}
                        className="glass border-border bg-transparent font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Body (JSON) - Solo POST/PUT/PATCH</Label>
                      <Textarea
                        placeholder={'{\n  "key": "value"\n}'}
                        value={config.body || ""}
                        onChange={(e) => updateConfig("body", e.target.value)}
                        className="glass border-border bg-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                )}

                {config.actionType === "database" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Operacion</Label>
                      <Select value={config.dbOperation || ""} onValueChange={(v) => updateConfig("dbOperation", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue placeholder="Selecciona operacion" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="select">SELECT - Consultar</SelectItem>
                          <SelectItem value="insert">INSERT - Insertar</SelectItem>
                          <SelectItem value="update">UPDATE - Actualizar</SelectItem>
                          <SelectItem value="delete">DELETE - Eliminar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Tabla</Label>
                      <Input
                        placeholder="nombre_tabla"
                        value={config.tableName || ""}
                        onChange={(e) => updateConfig("tableName", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Condicion WHERE (opcional)</Label>
                      <Input
                        placeholder="id = {{data.id}}"
                        value={config.whereClause || ""}
                        onChange={(e) => updateConfig("whereClause", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </div>
                )}

                {config.actionType === "transform" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Codigo de Transformacion</Label>
                      <Textarea
                        placeholder="// Transforma los datos\nreturn {\n  ...data,\n  processed: true\n}"
                        value={config.transformCode || ""}
                        onChange={(e) => updateConfig("transformCode", e.target.value)}
                        className="glass border-border bg-transparent font-mono text-sm min-h-[150px]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usa JavaScript para transformar los datos. La variable data contiene los datos del paso anterior.
                    </p>
                  </div>
                )}

                {config.actionType === "email" && renderEmailConfig()}
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
                      <SelectItem value="startsWith">Empieza con</SelectItem>
                      <SelectItem value="endsWith">Termina con</SelectItem>
                      <SelectItem value="isNull">Es nulo</SelectItem>
                      <SelectItem value="isNotNull">No es nulo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Valor de Comparacion</Label>
                  <Input
                    placeholder="Valor a comparar"
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
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="webhook">Webhook / HTTP</SelectItem>
                      <SelectItem value="database">Base de Datos</SelectItem>
                      <SelectItem value="notification">Notificacion Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.outputType === "email" && renderEmailConfig()}

                {config.outputType === "webhook" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">URL de Destino</Label>
                      <Input
                        placeholder="https://api.ejemplo.com/callback"
                        value={config.destinationUrl || ""}
                        onChange={(e) => updateConfig("destinationUrl", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Metodo HTTP</Label>
                      <Select value={config.httpMethod || "POST"} onValueChange={(v) => updateConfig("httpMethod", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {config.outputType === "database" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Tabla de Destino</Label>
                      <Input
                        placeholder="logs, audit_trail"
                        value={config.tableName || ""}
                        onChange={(e) => updateConfig("tableName", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </div>
                )}

                {config.outputType === "notification" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground">Titulo de la Notificacion</Label>
                      <Input
                        placeholder="Nueva actualizacion"
                        value={config.notificationTitle || ""}
                        onChange={(e) => updateConfig("notificationTitle", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Mensaje</Label>
                      <Textarea
                        placeholder="Contenido de la notificacion..."
                        value={config.notificationBody || ""}
                        onChange={(e) => updateConfig("notificationBody", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-foreground">Formato de Datos</Label>
                  <Select value={config.format || "json"} onValueChange={(v) => updateConfig("format", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="text">Texto Plano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {requiresEmailAuth && !config.emailCredentialId && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <Key className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-500">Autenticacion requerida</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Este nodo requiere que conectes una cuenta de email para funcionar correctamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="glass border-red-500/50 text-red-500 hover:bg-red-500/10 bg-transparent"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="glass border-border bg-transparent"
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={!nodeName || !nodeType} className="bg-primary hover:bg-primary/90">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  function renderEmailConfig() {
    if (showAddCredential) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-medium">Conectar Cuenta de Email</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddCredential(false)
                setSelectedProvider(null)
              }}
              className="text-muted-foreground"
            >
              Cancelar
            </Button>
          </div>

          {!selectedProvider ? (
            <div className="grid grid-cols-2 gap-3">
              {emailProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-background/50"
                >
                  <div className={`w-10 h-10 rounded-lg ${provider.color} flex items-center justify-center`}>
                    {provider.icon ? (
                      <img src={provider.icon} alt={provider.name} className="w-6 h-6" />
                    ) : (
                      <Mail className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">{provider.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-background/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${emailProviders.find(p => p.id === selectedProvider)?.color} flex items-center justify-center`}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {emailProviders.find(p => p.id === selectedProvider)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Conecta tu cuenta para enviar y recibir emails
                    </p>
                  </div>
                </div>

                {selectedProvider === "imap" ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Servidor IMAP</Label>
                      <Input
                        placeholder="imap.ejemplo.com"
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-foreground text-sm">Puerto</Label>
                        <Input
                          placeholder="993"
                          className="glass border-border bg-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground text-sm">SSL/TLS</Label>
                        <Select defaultValue="tls">
                          <SelectTrigger className="glass border-border bg-transparent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-border">
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">Ninguno</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Email</Label>
                      <Input
                        placeholder="usuario@ejemplo.com"
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Contrasena</Label>
                      <Input
                        type="password"
                        placeholder="********"
                        className="glass border-border bg-transparent"
                      />
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Conectar
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleConnectProvider(selectedProvider)}
                    disabled={connectingProvider === selectedProvider}
                  >
                    {connectingProvider === selectedProvider ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Conectar con {emailProviders.find(p => p.id === selectedProvider)?.name}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-foreground">Cuenta de Email</Label>
          <Select
            value={config.emailCredentialId || ""}
            onValueChange={(v) => updateConfig("emailCredentialId", v)}
          >
            <SelectTrigger className="glass border-border bg-transparent">
              <SelectValue placeholder="Selecciona una cuenta" />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              {credentials.map((cred) => (
                <SelectItem key={cred.id} value={cred.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded ${emailProviders.find(p => p.id === cred.provider)?.color} flex items-center justify-center`}>
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                    <span>{cred.name}</span>
                    <CheckCircle2 className="h-3 w-3 text-green-500 ml-auto" />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddCredential(true)}
          className="glass border-border bg-transparent w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Conectar nueva cuenta
        </Button>

        {nodeType === "trigger" && config.triggerType === "email" && (
          <div className="space-y-2">
            <Label className="text-foreground">Filtro de Asunto (opcional)</Label>
            <Input
              placeholder="Ej: Factura, Pedido confirmado"
              value={config.subjectFilter || ""}
              onChange={(e) => updateConfig("subjectFilter", e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>
        )}

        {(nodeType === "action" || nodeType === "output") && (
          <>
            <div className="space-y-2">
              <Label className="text-foreground">Destinatarios</Label>
              <Input
                placeholder="usuario@ejemplo.com, otro@ejemplo.com"
                value={config.recipients || ""}
                onChange={(e) => updateConfig("recipients", e.target.value)}
                className="glass border-border bg-transparent"
              />
              <p className="text-xs text-muted-foreground">
                Usa {"{{variable}}"} para datos dinamicos, ej: {"{{customer.email}}"}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Asunto</Label>
              <Input
                placeholder="Asunto del email"
                value={config.subject || ""}
                onChange={(e) => updateConfig("subject", e.target.value)}
                className="glass border-border bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Cuerpo del Mensaje</Label>
              <Textarea
                placeholder="Contenido del email..."
                value={config.emailBody || ""}
                onChange={(e) => updateConfig("emailBody", e.target.value)}
                className="glass border-border bg-transparent min-h-[100px]"
              />
            </div>
          </>
        )}
      </div>
    )
  }
}
