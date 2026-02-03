"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Key, Building } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [nit, setNit] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
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
        <Label htmlFor="email" className="text-foreground">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 glass border-border focus:border-primary bg-transparent"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 glass border-border focus:border-primary bg-transparent"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold neon-glow"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">o</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full glass border-border hover:border-secondary/50 hover:bg-secondary/10 bg-transparent"
        onClick={() => router.push("/api-login")}
      >
        <Key className="mr-2 h-4 w-4" />
        Entrar con token API (modo desarrollador)
      </Button>
    </form>
  )
}
