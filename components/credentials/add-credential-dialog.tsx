"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Database, Key, Globe, ChevronLeft, ChevronRight, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { emailProviders, databaseProviders } from "@/lib/credentials-store"

const credentialTypes = [
  { value: "email", label: "Email (Gmail/Outlook/IMAP)", icon: Mail, description: "Conectar cuentas de correo" },
  { value: "api", label: "API Key / Token", icon: Key, description: "Claves de API de servicios" },
  { value: "database", label: "Base de Datos", icon: Database, description: "Conexiones a bases de datos" },
  { value: "oauth", label: "OAuth 2.0", icon: Globe, description: "Autenticación OAuth genérica" },
]

export function AddCredentialDialog({
  open,
  onOpenChange,
  onAddCredential,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCredential: (credential: any) => void
}) {
  const [step, setStep] = useState(1)
  const [type, setType] = useState("")
  const [name, setName] = useState("")
  const [config, setConfig] = useState<Record<string, any>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const resetForm = () => {
    setStep(1)
    setType("")
    setName("")
    setConfig({})
    setConnectionStatus("idle")
  }

  const testConnection = () => {
    setTestingConnection(true)
    setConnectionStatus("idle")
    setTimeout(() => {
      setTestingConnection(false)
      setConnectionStatus(Math.random() > 0.2 ? "success" : "error")
    }, 2000)
  }

  const handleSave = () => {
    const credential = {
      id: Date.now().toString(),
      name: name || `Nueva Credencial ${type}`,
      type,
      provider: config.provider,
      status: "active",
      lastUsed: "Nunca",
      createdAt: new Date().toISOString(),
      config,
    }
    onAddCredential(credential)
    onOpenChange(false)
    resetForm()
  }

  const renderEmailConfig = () => (
    <div className="space-y-4">
      {!config.provider ? (
        <div className="space-y-3">
          <Label className="text-foreground">Selecciona el proveedor de email</Label>
          <div className="grid grid-cols-2 gap-3">
            {emailProviders.map((provider) => (
              <Card
                key={provider.id}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  config.provider === provider.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => updateConfig("provider", provider.id)}
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
        </div>
      ) : config.provider === "imap" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Configuración IMAP/SMTP</h4>
            <Button variant="ghost" size="sm" onClick={() => updateConfig("provider", null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Cambiar proveedor
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Nombre de la Credencial</Label>
            <Input
              placeholder="Mi servidor de correo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <h5 className="font-medium text-foreground mb-2">Servidor IMAP (Recepción)</h5>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm">Host</Label>
                <Input
                  placeholder="imap.servidor.com"
                  value={config.imapHost || ""}
                  onChange={(e) => updateConfig("imapHost", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Puerto</Label>
                <Input
                  placeholder="993"
                  type="number"
                  value={config.imapPort || "993"}
                  onChange={(e) => updateConfig("imapPort", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <h5 className="font-medium text-foreground mb-2">Servidor SMTP (Envío)</h5>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm">Host</Label>
                <Input
                  placeholder="smtp.servidor.com"
                  value={config.smtpHost || ""}
                  onChange={(e) => updateConfig("smtpHost", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Puerto</Label>
                <Input
                  placeholder="587"
                  type="number"
                  value={config.smtpPort || "587"}
                  onChange={(e) => updateConfig("smtpPort", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <h5 className="font-medium text-foreground mb-2">Credenciales de Acceso</h5>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Email / Usuario</Label>
                <Input
                  placeholder="usuario@dominio.com"
                  value={config.email || ""}
                  onChange={(e) => updateConfig("email", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Contraseña</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={config.password || ""}
                    onChange={(e) => updateConfig("password", e.target.value)}
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
                <p className="text-xs text-muted-foreground">
                  Para Gmail, usa una contraseña de aplicación en lugar de tu contraseña normal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Usar SSL/TLS</span>
            </div>
            <Switch
              checked={config.useSSL !== false}
              onCheckedChange={(checked) => updateConfig("useSSL", checked)}
            />
          </div>

          <Button
            className="w-full"
            onClick={testConnection}
            disabled={testingConnection || !config.imapHost || !config.email}
          >
            {testingConnection ? "Probando conexión..." : "Probar Conexión"}
          </Button>

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
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">
              Configuración OAuth - {emailProviders.find((p) => p.id === config.provider)?.name}
            </h4>
            <Button variant="ghost" size="sm" onClick={() => updateConfig("provider", null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Cambiar proveedor
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Nombre de la Credencial</Label>
            <Input
              placeholder={`Mi cuenta de ${emailProviders.find((p) => p.id === config.provider)?.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Configuración OAuth 2.0
            </h5>
            <p className="text-sm text-muted-foreground mb-4">
              Necesitas crear una aplicación OAuth en la consola de desarrolladores de{" "}
              {emailProviders.find((p) => p.id === config.provider)?.name}.
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Client ID</Label>
                <Input
                  placeholder="Tu Client ID"
                  value={config.clientId || ""}
                  onChange={(e) => updateConfig("clientId", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Client Secret</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu Client Secret"
                    value={config.clientSecret || ""}
                    onChange={(e) => updateConfig("clientSecret", e.target.value)}
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
                <p className="text-xs text-muted-foreground mb-2">URL de Callback (configura esto en tu app OAuth):</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted/30 p-2 rounded overflow-x-auto">
                    https://tu-dominio.com/api/oauth/callback/{config.provider}
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            disabled={!config.clientId || !config.clientSecret}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Autorizar con {emailProviders.find((p) => p.id === config.provider)?.name}
          </Button>
        </div>
      )}
    </div>
  )

  const renderDatabaseConfig = () => (
    <div className="space-y-4">
      {!config.provider ? (
        <div className="space-y-3">
          <Label className="text-foreground">Selecciona el motor de base de datos</Label>
          <div className="grid grid-cols-2 gap-3">
            {databaseProviders.map((provider) => (
              <Card
                key={provider.id}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  config.provider === provider.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => updateConfig("provider", provider.id)}
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
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">
              Configuración {databaseProviders.find((p) => p.id === config.provider)?.name}
            </h4>
            <Button variant="ghost" size="sm" onClick={() => updateConfig("provider", null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Cambiar motor
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Nombre de la Credencial</Label>
            <Input
              placeholder="Base de datos producción"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <h5 className="font-medium text-foreground mb-3">Conexión al Servidor</h5>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm">Host / IP</Label>
                <Input
                  placeholder="localhost o db.servidor.com"
                  value={config.host || ""}
                  onChange={(e) => updateConfig("host", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Puerto</Label>
                <Input
                  type="number"
                  value={config.port || databaseProviders.find((p) => p.id === config.provider)?.defaultPort || ""}
                  onChange={(e) => updateConfig("port", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Label className="text-sm">Nombre de la Base de Datos</Label>
              <Input
                placeholder="mi_base_datos"
                value={config.database || ""}
                onChange={(e) => updateConfig("database", e.target.value)}
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
                  value={config.username || ""}
                  onChange={(e) => updateConfig("username", e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Contraseña</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={config.password || ""}
                    onChange={(e) => updateConfig("password", e.target.value)}
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
                  checked={config.ssl !== false}
                  onCheckedChange={(checked) => updateConfig("ssl", checked)}
                />
              </div>
              {config.ssl && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm">Modo SSL</Label>
                    <Select
                      value={config.sslMode || "require"}
                      onValueChange={(v) => updateConfig("sslMode", v)}
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
                  <div className="space-y-2">
                    <Label className="text-sm">Certificado CA (opcional)</Label>
                    <Textarea
                      placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                      value={config.caCert || ""}
                      onChange={(e) => updateConfig("caCert", e.target.value)}
                      className="glass border-border bg-transparent font-mono text-xs min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Certificado Cliente (opcional)</Label>
                    <Textarea
                      placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                      value={config.clientCert || ""}
                      onChange={(e) => updateConfig("clientCert", e.target.value)}
                      className="glass border-border bg-transparent font-mono text-xs min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Llave Privada Cliente (opcional)</Label>
                    <Textarea
                      placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                      value={config.clientKey || ""}
                      onChange={(e) => updateConfig("clientKey", e.target.value)}
                      className="glass border-border bg-transparent font-mono text-xs min-h-[80px]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={testConnection}
            disabled={testingConnection || !config.host || !config.database}
          >
            {testingConnection ? "Probando conexión..." : "Probar Conexión"}
          </Button>

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
        </div>
      )}
    </div>
  )

  const renderApiConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-foreground">Nombre de la Credencial</Label>
        <Input
          placeholder="API Key Stripe Producción"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="glass border-border bg-transparent"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Tipo de Autenticación</Label>
        <Select value={config.authType || "bearer"} onValueChange={(v) => updateConfig("authType", v)}>
          <SelectTrigger className="glass border-border bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-border">
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="apikey">API Key</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.authType === "bearer" && (
        <div className="space-y-2">
          <Label className="text-foreground">Token</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="eyJhbGciOiJIUzI1NiIs..."
              value={config.token || ""}
              onChange={(e) => updateConfig("token", e.target.value)}
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

      {config.authType === "apikey" && (
        <>
          <div className="space-y-2">
            <Label className="text-foreground">Nombre del Header</Label>
            <Input
              placeholder="X-API-Key"
              value={config.headerName || ""}
              onChange={(e) => updateConfig("headerName", e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Valor de la API Key</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="sk_live_..."
                value={config.apiKey || ""}
                onChange={(e) => updateConfig("apiKey", e.target.value)}
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

      {config.authType === "basic" && (
        <>
          <div className="space-y-2">
            <Label className="text-foreground">Usuario</Label>
            <Input
              placeholder="usuario"
              value={config.username || ""}
              onChange={(e) => updateConfig("username", e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Contraseña</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={config.password || ""}
                onChange={(e) => updateConfig("password", e.target.value)}
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

      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-2">
        <Shield className="h-4 w-4 text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Las credenciales se almacenan de forma cifrada y solo se descifran al momento de ejecutar los flujos.
        </p>
      </div>
    </div>
  )

  const renderOAuthConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-foreground">Nombre de la Credencial</Label>
        <Input
          placeholder="OAuth Salesforce"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="glass border-border bg-transparent"
        />
      </div>

      <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
        <h5 className="font-medium text-foreground">Configuración OAuth 2.0</h5>

        <div className="space-y-2">
          <Label className="text-sm">Authorization URL</Label>
          <Input
            placeholder="https://provider.com/oauth/authorize"
            value={config.authUrl || ""}
            onChange={(e) => updateConfig("authUrl", e.target.value)}
            className="glass border-border bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Token URL</Label>
          <Input
            placeholder="https://provider.com/oauth/token"
            value={config.tokenUrl || ""}
            onChange={(e) => updateConfig("tokenUrl", e.target.value)}
            className="glass border-border bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Client ID</Label>
          <Input
            placeholder="Tu Client ID"
            value={config.clientId || ""}
            onChange={(e) => updateConfig("clientId", e.target.value)}
            className="glass border-border bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Client Secret</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Tu Client Secret"
              value={config.clientSecret || ""}
              onChange={(e) => updateConfig("clientSecret", e.target.value)}
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
          <Label className="text-sm">Scopes (separados por espacio)</Label>
          <Input
            placeholder="read write profile"
            value={config.scopes || ""}
            onChange={(e) => updateConfig("scopes", e.target.value)}
            className="glass border-border bg-transparent"
          />
        </div>

        <div className="p-3 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs text-muted-foreground mb-2">URL de Callback:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted/30 p-2 rounded overflow-x-auto">
              https://tu-dominio.com/api/oauth/callback
            </code>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90"
        disabled={!config.authUrl || !config.tokenUrl || !config.clientId || !config.clientSecret}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Autorizar Aplicación
      </Button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetForm(); }}>
      <DialogContent className="glass border-border max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nueva Credencial</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Agrega una nueva credencial para usar en tus flujos de automatización
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <Label className="text-foreground">Tipo de Credencial</Label>
            <div className="grid grid-cols-2 gap-3">
              {credentialTypes.map((credType) => (
                <Card
                  key={credType.value}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    type === credType.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setType(credType.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <credType.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{credType.label}</p>
                      <p className="text-xs text-muted-foreground">{credType.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                disabled={!type}
                onClick={() => setStep(2)}
                className="bg-primary hover:bg-primary/90"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
              <Badge variant="outline">{credentialTypes.find((c) => c.value === type)?.label}</Badge>
            </div>

            {type === "email" && renderEmailConfig()}
            {type === "database" && renderDatabaseConfig()}
            {type === "api" && renderApiConfig()}
            {type === "oauth" && renderOAuthConfig()}

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="glass border-border bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
                disabled={!name && type !== "email" && type !== "database"}
              >
                Guardar Credencial
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
