"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Key, Building, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

export default function ApiLoginPage() {
  const router = useRouter()
  const [nit, setNit] = useState("")
  const [apiToken, setApiToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API token validation
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <Card className="w-full max-w-md glass border-border p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground mt-6">Modo Desarrollador</h1>
          <p className="text-muted-foreground text-center mt-2">Accede usando tu token API</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nit" className="text-foreground">
              NIT de la Empresa
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nit"
                type="text"
                placeholder="900123456-7"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="pl-10 glass border-border focus:border-primary bg-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-token" className="text-foreground">
              Token API
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="api-token"
                type="password"
                placeholder="sk_live_..."
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="pl-10 glass border-border focus:border-primary bg-transparent font-mono"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Puedes generar un token API desde la configuración de tu cuenta
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold neon-glow"
            disabled={isLoading}
          >
            {isLoading ? "Validando token..." : "Acceder"}
          </Button>

          <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al login normal
          </Button>
        </form>
      </Card>
    </div>
  )
}
