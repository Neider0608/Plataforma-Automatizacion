"use client"

import { CompanySelector } from "@/components/company-selector"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User, Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export function DashboardHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-16 border-b border-border glass flex items-center justify-between px-6">
      <Logo />

      <div className="flex items-center gap-4">
        <div className="w-64">
          <CompanySelector />
        </div>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Settings className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
