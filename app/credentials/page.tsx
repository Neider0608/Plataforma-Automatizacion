"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Key, MoreVertical, Trash2, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddCredentialDialog } from "@/components/credentials/add-credential-dialog"

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState([
    { id: "1", name: "API Key - Producción", type: "API Key", lastUsed: "Hace 5 minutos", status: "active" },
    { id: "2", name: "OAuth - Google", type: "OAuth 2.0", lastUsed: "Hace 2 horas", status: "active" },
    { id: "3", name: "Database - PostgreSQL", type: "Database", lastUsed: "Hace 1 día", status: "active" },
  ])
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleAddCredential = (credential: any) => {
    setCredentials([...credentials, credential])
  }

  const handleDeleteCredential = (id: string) => {
    setCredentials(credentials.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Credenciales</h1>
                <p className="text-muted-foreground mt-1">Gestiona las credenciales de tus integraciones</p>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="bg-primary hover:bg-primary/90 neon-glow">
                <Plus className="mr-2 h-4 w-4" />
                Nueva credencial
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((credential) => (
                <Card key={credential.id} className="glass border-border p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 -mr-2 -mt-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass border-border">
                        <DropdownMenuItem className="hover:bg-primary/10">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCredential(credential.id)}
                          className="hover:bg-red-500/10 text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{credential.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{credential.type}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Último uso: {credential.lastUsed}</p>
                    <Badge variant="default">Activa</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <AddCredentialDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddCredential={handleAddCredential} />
    </div>
  )
}
