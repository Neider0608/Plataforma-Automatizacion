"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Workflow, Cpu, Key, Users, History, LayoutDashboard, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Brain, label: "IA Builder", href: "/ai-builder" },
  { icon: Workflow, label: "Flujos", href: "/flows" },
  { icon: Cpu, label: "Agentes Locales", href: "/agents" },
  { icon: Key, label: "Credenciales", href: "/credentials" },
  { icon: Users, label: "Usuarios y Roles", href: "/users" },
  { icon: History, label: "Historial / Logs", href: "/logs" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "h-screen border-r border-border glass flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex justify-end">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hover:bg-primary/10">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-primary/10",
                  isActive && "bg-primary/20 text-primary hover:bg-primary/20",
                  collapsed && "justify-center px-2",
                )}
              >
                <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
