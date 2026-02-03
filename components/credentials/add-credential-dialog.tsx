"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Database, Key, Globe } from "lucide-react"

const credentialTypes = [
  { value: "email", label: "Email (Gmail/Outlook)", icon: Mail },
  { value: "api", label: "API Key", icon: Key },
  { value: "database", label: "Base de Datos", icon: Database },
  { value: "oauth", label: "OAuth 2.0", icon: Globe },
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
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [emailProvider, setEmailProvider] = useState("")
  const [email, setEmail] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleAuthenticate = () => {
    setIsAuthenticating(true)
    // Simular autenticación OAuth
    setTimeout(() => {
      setIsAuthenticating(false)
      const credential = {
        id: Date.now().toString(),
        name: name || `${emailProvider} - ${email}`,
        type: type === "email" ? "Email" : type === "api" ? "API Key" : type === "database" ? "Database" : "OAuth 2.0",
        provider: emailProvider,
        email: email,
        apiKey: apiKey,
        status: "active",
        lastUsed: "Nunca",
        createdAt: new Date().toISOString(),
      }
      onAddCredential(credential)
      onOpenChange(false)
      resetForm()
    }, 2000)
  }

  const resetForm = () => {
    setName("")
    setType("")
    setEmailProvider("")
    setEmail("")
    setApiKey("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nueva Credencial</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Agrega una nueva credencial para usar en tus flujos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cred-name" className="text-foreground">
              Nombre de la Credencial
            </Label>
            <Input
              id="cred-name"
              placeholder="Ej: Mi cuenta de Gmail"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass border-border bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cred-type" className="text-foreground">
              Tipo de Credencial
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="glass border-border bg-transparent">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                {credentialTypes.map((credType) => (
                  <SelectItem key={credType.value} value={credType.value}>
                    <div className="flex items-center gap-2">
                      <credType.icon className="h-4 w-4" />
                      {credType.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "email" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email-provider" className="text-foreground">
                  Proveedor de Email
                </Label>
                <Select value={emailProvider} onValueChange={setEmailProvider}>
                  <SelectTrigger className="glass border-border bg-transparent">
                    <SelectValue placeholder="Selecciona proveedor" />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                    <SelectItem value="yahoo">Yahoo Mail</SelectItem>
                    <SelectItem value="imap">IMAP Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-address" className="text-foreground">
                  Dirección de Email
                </Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-foreground mb-2">
                  Al hacer clic en "Autenticar", serás redirigido a {emailProvider || "tu proveedor"} para autorizar el
                  acceso.
                </p>
                <p className="text-xs text-muted-foreground">
                  Solo solicitamos permisos de lectura y envío de emails. Tus credenciales se almacenan de forma segura.
                </p>
              </div>
            </>
          )}

          {type === "api" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-foreground">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk_live_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="glass border-border bg-transparent"
                />
              </div>
            </>
          )}

          {type === "database" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="db-host" className="text-foreground">
                  Host
                </Label>
                <Input id="db-host" placeholder="localhost:5432" className="glass border-border bg-transparent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name" className="text-foreground">
                  Nombre de la Base de Datos
                </Label>
                <Input id="db-name" placeholder="mi_base_datos" className="glass border-border bg-transparent" />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="glass border-border bg-transparent">
            Cancelar
          </Button>
          <Button
            onClick={handleAuthenticate}
            disabled={!type || (type === "email" && (!emailProvider || !email)) || isAuthenticating}
            className="bg-primary hover:bg-primary/90"
          >
            {isAuthenticating ? "Autenticando..." : type === "email" ? "Autenticar con OAuth" : "Guardar Credencial"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
