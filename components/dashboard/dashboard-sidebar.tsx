"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const active = pathname === "/" || pathname === "/dashboard"

  return (
    <aside className={cn("flex h-screen flex-col border-r border-border bg-card/40 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex items-center justify-end p-4"><Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expandir navegación" : "Contraer navegación"}><ChevronLeft className={cn("size-5 transition-transform", collapsed && "rotate-180")} /></Button></div>
      <nav className="flex-1 px-3">
        <Link href="/">
          <Button variant="ghost" className={cn("w-full justify-start hover:bg-primary/10", active && "bg-primary/10 text-primary hover:bg-primary/10", collapsed && "justify-center px-2")}>
            <FileText className={cn("size-5", !collapsed && "mr-3")} />{!collapsed && <span>Facturación Electrónica</span>}
          </Button>
        </Link>
      </nav>
    </aside>
  )
}
