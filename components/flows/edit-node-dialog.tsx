"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Database, GitBranch, Mail, Trash2, Settings, Plus, Key } from "lucide-react"
import type { Node } from "./visual-flow-builder"

const nodeTypes = [
  { value: "trigger", label: "Disparador", icon: Zap, color: "bg-primary" },
  { value: "action", label: "Acción", icon: Database, color: "bg-secondary" },
  { value: "condition", label: "Condición", icon: GitBranch, color: "bg-yellow-500" },
  { value: "output", label: "Salida", icon: Mail, color: "bg-green-500" },
]

const mockEmailCredentials = [
  { id: "1", name: "Gmail - usuario@gmail.com", provider: "gmail" },
  { id: "2", name: "Outlook - usuario@outlook.com", provider: "outlook" },
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
  const [config, setConfig] = useState<any>({})
  const [showAddCredential, setShowAddCredential] = useState(false)

  useEffect(() => {
    if (node) {
      setNodeName(node.label)
      setNodeType(node.type)
      setDescription(node.description || "")
      setConfig(node.config || {})
    }
  }, [node])

  const handleUpdate = () => {
    if (node) {
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
    setConfig((prev: any) => ({ ...prev, [key]: value }))
  }

  if (!node) return null

  const requiresEmailAuth =
    (nodeType === "trigger" && config.triggerType === "email") ||
    (nodeType === "action" && config.actionType === "email") ||
    (nodeType === "output" && config.outputType === "email")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Nodo</DialogTitle>
          <DialogDescription className="text-muted-foreground">Modifica las propiedades de este nodo</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Settings className="h-4 w-4" />
              Configuración del Nodo
            </div>

            {nodeType === "trigger" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Disparador</Label>
                  <Select value={config.triggerType || ""} onValueChange={(v) => updateConfig("triggerType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="schedule">Programado</SelectItem>
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
                  </div>
                )}

                {config.triggerType === "schedule" && (
                  <div className="space-y-2">
                    <Label className="text-foreground">Expresión Cron</Label>
                    <Input
                      placeholder="0 0 * * *"
                      value={config.cronExpression || ""}
                      onChange={(e) => updateConfig("cronExpression", e.target.value)}
                      className="glass border-border bg-transparent"
                    />
                    <p className="text-xs text-muted-foreground">Ejemplo: 0 0 * * * (diario a medianoche)</p>
                  </div>
                )}

                {config.triggerType === "email" && (
                  <>
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
                          {mockEmailCredentials.map((cred) => (
                            <SelectItem key={cred.id} value={cred.id}>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {cred.name}
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
                      Agregar nueva cuenta de email
                    </Button>
                    <div className="space-y-2">
                      <Label className="text-foreground">Filtro de Asunto (opcional)</Label>
                      <Input
                        placeholder="Ej: Pedido confirmado"
                        value={config.subjectFilter || ""}
                        onChange={(e) => updateConfig("subjectFilter", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {nodeType === "action" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Acción</Label>
                  <Select value={config.actionType || ""} onValueChange={(v) => updateConfig("actionType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="http">Petición HTTP</SelectItem>
                      <SelectItem value="database">Operación en BD</SelectItem>
                      <SelectItem value="email">Enviar Email</SelectItem>
                      <SelectItem value="transform">Transformar Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.actionType === "http" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-foreground">Método HTTP</Label>
                      <Select value={config.httpMethod || "GET"} onValueChange={(v) => updateConfig("httpMethod", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
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
                        placeholder='{"Authorization": "Bearer token"}'
                        value={config.headers || ""}
                        onChange={(e) => updateConfig("headers", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </>
                )}

                {config.actionType === "database" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-foreground">Operación</Label>
                      <Select value={config.dbOperation || ""} onValueChange={(v) => updateConfig("dbOperation", v)}>
                        <SelectTrigger className="glass border-border bg-transparent">
                          <SelectValue placeholder="Selecciona operación" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border">
                          <SelectItem value="insert">INSERT</SelectItem>
                          <SelectItem value="update">UPDATE</SelectItem>
                          <SelectItem value="delete">DELETE</SelectItem>
                          <SelectItem value="select">SELECT</SelectItem>
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
                  </>
                )}

                {config.actionType === "email" && (
                  <>
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
                          {mockEmailCredentials.map((cred) => (
                            <SelectItem key={cred.id} value={cred.id}>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {cred.name}
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
                      Agregar nueva cuenta de email
                    </Button>
                    <div className="space-y-2">
                      <Label className="text-foreground">Destinatario</Label>
                      <Input
                        placeholder="usuario@ejemplo.com"
                        value={config.recipient || ""}
                        onChange={(e) => updateConfig("recipient", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
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
                      <Label className="text-foreground">Cuerpo del mensaje</Label>
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
            )}

            {nodeType === "condition" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Campo a Evaluar</Label>
                  <Input
                    placeholder="Ej: response.status"
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
                      <SelectItem value="less">Menor que (&lt;)</SelectItem>
                      <SelectItem value="contains">Contiene</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Valor de Comparación</Label>
                  <Input
                    placeholder="Valor a comparar"
                    value={config.value || ""}
                    onChange={(e) => updateConfig("value", e.target.value)}
                    className="glass border-border bg-transparent"
                  />
                </div>
              </div>
            )}

            {nodeType === "output" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Salida</Label>
                  <Select value={config.outputType || ""} onValueChange={(v) => updateConfig("outputType", v)}>
                    <SelectTrigger className="glass border-border bg-transparent">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="database">Base de Datos</SelectItem>
                      <SelectItem value="notification">Notificación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.outputType === "email" && (
                  <>
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
                          {mockEmailCredentials.map((cred) => (
                            <SelectItem key={cred.id} value={cred.id}>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {cred.name}
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
                      Agregar nueva cuenta de email
                    </Button>
                    <div className="space-y-2">
                      <Label className="text-foreground">Destinatarios (separados por coma)</Label>
                      <Input
                        placeholder="user1@ejemplo.com, user2@ejemplo.com"
                        value={config.recipients || ""}
                        onChange={(e) => updateConfig("recipients", e.target.value)}
                        className="glass border-border bg-transparent"
                      />
                    </div>
                  </>
                )}

                {config.outputType === "webhook" && (
                  <div className="space-y-2">
                    <Label className="text-foreground">URL de Destino</Label>
                    <Input
                      placeholder="https://api.ejemplo.com/callback"
                      value={config.destinationUrl || ""}
                      onChange={(e) => updateConfig("destinationUrl", e.target.value)}
                      className="glass border-border bg-transparent"
                    />
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
                    <p className="text-sm font-medium text-yellow-500">Autenticación requerida</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Este nodo requiere que autentiques una cuenta de email para funcionar correctamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2">
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
}
