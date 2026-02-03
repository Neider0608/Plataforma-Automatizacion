import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const users = [
  { id: "1", name: "Juan Pérez", email: "juan@empresa.com", role: "Admin", status: "active" },
  { id: "2", name: "María García", email: "maria@empresa.com", role: "Editor", status: "active" },
  { id: "3", name: "Carlos López", email: "carlos@empresa.com", role: "Viewer", status: "inactive" },
]

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Usuarios y Roles</h1>
                <p className="text-muted-foreground mt-1">Gestiona los usuarios de tu empresa</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 neon-glow">
                <Plus className="mr-2 h-4 w-4" />
                Invitar usuario
              </Button>
            </div>

            <Card className="glass border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="p-4 text-sm font-semibold text-muted-foreground">Usuario</th>
                      <th className="p-4 text-sm font-semibold text-muted-foreground">Email</th>
                      <th className="p-4 text-sm font-semibold text-muted-foreground">Rol</th>
                      <th className="p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                      <th className="p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-primary/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{user.role}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
