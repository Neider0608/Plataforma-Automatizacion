"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Company = {
  id: string
  name: string
  logo?: string
}

const companies: Company[] = [
  { id: "1", name: "Acme Corporation" },
  { id: "2", name: "TechStart Inc" },
  { id: "3", name: "Global Solutions" },
]

export function CompanySelector() {
  const [open, setOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between glass border-border hover:border-primary/50 bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-foreground">{selectedCompany.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 glass border-border">
        <Command className="bg-transparent">
          <CommandInput placeholder="Buscar empresa..." className="border-none" />
          <CommandList>
            <CommandEmpty>No se encontró la empresa.</CommandEmpty>
            <CommandGroup>
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.name}
                  onSelect={() => {
                    setSelectedCompany(company)
                    setOpen(false)
                  }}
                  className="hover:bg-primary/10"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedCompany.id === company.id ? "opacity-100 text-primary" : "opacity-0"
                    }`}
                  />
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
