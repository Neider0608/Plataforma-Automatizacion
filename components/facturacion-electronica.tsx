"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cloud,
  Database,
  FileArchive,
  FileCode2,
  FileText,
  Inbox,
  KeyRound,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  Webhook,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const steps = [
  { id: "entrada", number: "01", label: "Entrada", description: "API o correo" },
  { id: "extraccion", number: "02", label: "Extracción", description: "ZIP, XML y PDF" },
  { id: "consulta", number: "03", label: "Consulta XML", description: "API de datos" },
  { id: "guardado", number: "04", label: "Guardado", description: "Destino final" },
]

function StepIcon({ step }: { step: string }) {
  const icons = { entrada: Inbox, extraccion: FileArchive, consulta: FileCode2, guardado: Cloud }
  const Icon = icons[step as keyof typeof icons] ?? Settings2
  return <Icon className="size-4" />
}

export function FacturacionElectronica() {
  const [activeStep, setActiveStep] = useState("entrada")
  const [source, setSource] = useState<"api" | "email">("api")
  const [emailProvider, setEmailProvider] = useState("Microsoft 365")
  const [storage, setStorage] = useState<"cloud" | "api" | "database">("cloud")
  const [saved, setSaved] = useState(false)
  const [mailboxes, setMailboxes] = useState([
    { id: 1, name: "Buzón principal", address: "facturas@empresa.com", status: "Activo" },
  ])
  const [selectedMailbox, setSelectedMailbox] = useState(1)

  const addMailbox = () => {
    const id = Math.max(...mailboxes.map((mailbox) => mailbox.id), 0) + 1
    setMailboxes((current) => [...current, { id, name: `Buzón ${id}`, address: "", status: "Pendiente" }])
    setSelectedMailbox(id)
  }

  const goNext = () => {
    const index = steps.findIndex((step) => step.id === activeStep)
    if (index < steps.length - 1) setActiveStep(steps[index + 1].id)
    else setSaved(true)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card/40 p-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-border pb-7">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">Neidsoft</p>
              <p className="text-xs text-muted-foreground">Automatización empresarial</p>
            </div>
          </div>
          <div className="pt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Módulo activo</p>
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-3 text-sm font-medium text-primary">
              <FileText className="size-4" />
              Facturación Electrónica
            </div>
          </div>
          <div className="mt-auto rounded-xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><ShieldCheck className="size-4 text-primary" /> Entorno seguro</div>
            <p className="text-xs leading-relaxed text-muted-foreground">Tus credenciales se guardan cifradas y separadas por conexión.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><FileText className="size-4" /></div>
              <span className="font-semibold">Facturación Electrónica</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-muted-foreground">Configuración del módulo</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">Facturación Electrónica</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden gap-1.5 sm:flex"><span className="size-1.5 rounded-full bg-emerald-500" /> Configuración local</Badge>
              <Button variant="outline" size="sm" onClick={() => setSaved(false)}><RefreshCw data-icon="inline-start" /> Restablecer</Button>
            </div>
          </header>

          <div className="px-5 py-8 sm:px-10 lg:py-12">
            <div className="mx-auto max-w-5xl">
              <div className="mb-10 max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"><Sparkles className="size-3.5" /> Flujo de procesamiento</div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Configura tu proceso de facturación</h2>
                <p className="mt-3 text-pretty leading-6 text-muted-foreground">Define cómo llegan tus comprobantes, extrae la información relevante y decide dónde guardar cada resultado.</p>
              </div>

              <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {steps.map((step, index) => {
                  const active = activeStep === step.id
                  const complete = steps.findIndex((item) => item.id === activeStep) > index
                  return <button key={step.id} onClick={() => setActiveStep(step.id)} className={cn("group flex items-center gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4", active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40", complete && "border-primary/30")}>
                    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold", active ? "bg-primary text-primary-foreground" : complete ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>{complete ? <Check className="size-4" /> : step.number}</span>
                    <span className="min-w-0"><span className={cn("block truncate text-sm font-medium", active && "text-primary")}>{step.label}</span><span className="hidden truncate text-xs text-muted-foreground sm:block">{step.description}</span></span>
                  </button>
                })}
              </div>

              {activeStep === "entrada" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Inbox className="size-5 text-primary" /> Fuente de comprobantes</CardTitle><CardDescription>Elige el origen y configura los datos necesarios para recibir los archivos.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={() => setSource("api")} className={cn("rounded-xl border p-4 text-left", source === "api" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}><div className="mb-3 flex items-center justify-between"><Webhook className="size-5 text-primary" /><span className={cn("size-4 rounded-full border-4", source === "api" ? "border-primary" : "border-muted")} /></div><p className="font-medium">API externa</p><p className="mt-1 text-sm text-muted-foreground">Consulta periódica o webhook de recepción.</p></button>
                  <button onClick={() => setSource("email")} className={cn("rounded-xl border p-4 text-left", source === "email" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}><div className="mb-3 flex items-center justify-between"><Mail className="size-5 text-primary" /><span className={cn("size-4 rounded-full border-4", source === "email" ? "border-primary" : "border-muted")} /></div><p className="font-medium">Correo electrónico</p><p className="mt-1 text-sm text-muted-foreground">Gmail, Microsoft 365, Outlook u otros clientes compatibles.</p></button>
                </div>
                {source === "api" ? <div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="endpoint">URL del endpoint</Label><Input id="endpoint" placeholder="https://api.proveedor.com/comprobantes" /></div><div className="flex flex-col gap-2"><Label htmlFor="method">Método HTTP</Label><div className="relative"><select id="method" className="h-9 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm"><option>GET</option><option>POST</option><option>PUT</option></select><ChevronDown className="pointer-events-none absolute right-3 top-2.5 size-4 text-muted-foreground" /></div></div><div className="flex flex-col gap-2"><Label htmlFor="frequency">Frecuencia de consulta</Label><div className="relative"><select id="frequency" className="h-9 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm"><option>Cada 15 minutos</option><option>Cada hora</option><option>Una vez al día</option></select><ChevronDown className="pointer-events-none absolute right-3 top-2.5 size-4 text-muted-foreground" /></div></div><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="headers">Headers de autenticación</Label><Textarea id="headers" placeholder={'Authorization: Bearer token\nX-Client-Id: tu-identificador'} className="min-h-24 font-mono text-xs" /></div></div> : <div className="flex flex-col gap-6"><div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="email-provider">Cliente de correo</Label><select id="email-provider" value={emailProvider} onChange={(event) => setEmailProvider(event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option>Microsoft 365</option><option>Gmail</option><option>Outlook.com</option><option>Otro cliente IMAP</option></select></div><div className="flex flex-col gap-2"><Label htmlFor="email-security">Seguridad</Label><select id="email-security" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option>OAuth 2.0</option><option>IMAP SSL/TLS</option><option>POP3 SSL/TLS</option></select></div><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="tenant">Tenant ID / dominio del proveedor</Label><Input id="tenant" placeholder="00000000-0000-0000-0000-000000000000" /></div><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="token"><KeyRound className="mr-1 inline size-3.5" /> Token o contraseña de aplicación</Label><Input id="token" type="password" placeholder="••••••••••••••••" /><p className="text-xs text-muted-foreground">Se reutiliza para consultar todos los buzones autorizados de este proveedor.</p></div></div><div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-medium">Buzones configurados</p><p className="text-sm text-muted-foreground">Agrega varios correos para consultar facturas desde cada bandeja.</p></div><Button variant="outline" size="sm" onClick={addMailbox}><Plus data-icon="inline-start" /> Agregar buzón</Button></div><div className="flex flex-col gap-2">{mailboxes.map((mailbox) => <div key={mailbox.id} className={cn("flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between", selectedMailbox === mailbox.id ? "border-primary/50" : "border-border")}><button className="min-w-0 flex-1 text-left" onClick={() => setSelectedMailbox(mailbox.id)}><div className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-primary" /><span className="truncate font-medium">{mailbox.name}</span><Badge variant={mailbox.status === "Activo" ? "secondary" : "outline"}>{mailbox.status}</Badge></div><p className="mt-1 truncate pl-6 text-sm text-muted-foreground">{mailbox.address || "Completa la dirección del buzón"}</p></button><div className="flex items-center gap-2"><Button variant="ghost" size="sm" onClick={() => setSelectedMailbox(mailbox.id)}>Configurar</Button><Button variant="ghost" size="sm" aria-label={`Consultar ${mailbox.name}`}><RefreshCw data-icon="inline-start" /> Consultar</Button></div></div>)}</div><div className="grid gap-5 border-t border-border pt-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="mailbox">Dirección del buzón seleccionado</Label><Input id="mailbox" value={mailboxes.find((mailbox) => mailbox.id === selectedMailbox)?.address ?? ""} onChange={(event) => setMailboxes((current) => current.map((mailbox) => mailbox.id === selectedMailbox ? { ...mailbox, address: event.target.value } : mailbox))} placeholder="facturas@empresa.com" /></div><div className="flex flex-col gap-2"><Label htmlFor="mailbox-folder">Carpeta a consultar</Label><Input id="mailbox-folder" defaultValue="Inbox" placeholder="Inbox" /></div></div></div></div>}
              </CardContent></Card>}

              {activeStep === "extraccion" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileArchive className="size-5 text-primary" /> Extracción de archivos</CardTitle><CardDescription>El sistema procesará cada ZIP y separará automáticamente los documentos.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="grid gap-3 sm:grid-cols-3">{[{icon: FileArchive, title: "ZIP", text: "Descomprimir archivos recibidos"}, {icon: FileCode2, title: "XML", text: "Identificar y validar comprobante"}, {icon: FileText, title: "PDF", text: "Conservar documento visual"}].map(({icon: Icon, title, text}) => <div key={title} className="rounded-xl border border-border bg-muted/20 p-4"><Icon className="mb-3 size-5 text-primary" /><p className="font-medium">{title}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div>)}</div><div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5"><div className="flex items-center gap-3"><Upload className="size-5 text-primary" /><div><p className="font-medium">Reglas de extracción activas</p><p className="text-sm text-muted-foreground">Se aceptan archivos .zip con XML y PDF relacionados.</p></div></div></div></CardContent></Card>}

              {activeStep === "consulta" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileCode2 className="size-5 text-primary" /> Consulta de información XML</CardTitle><CardDescription>Conecta la API existente que interpreta los datos de cada XML.</CardDescription></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="xml-api">URL de la API XML</Label><Input id="xml-api" placeholder="https://api.empresa.com/xml/parse" /></div><div className="flex flex-col gap-2"><Label htmlFor="xml-method">Método</Label><Input id="xml-method" defaultValue="POST" /></div><div className="flex flex-col gap-2"><Label htmlFor="xml-auth">Tipo de autenticación</Label><Input id="xml-auth" placeholder="Bearer token / API key" /></div><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="xml-headers">Headers y parámetros</Label><Textarea id="xml-headers" placeholder={'Content-Type: application/xml\nAuthorization: Bearer ...'} className="min-h-24 font-mono text-xs" /></div></CardContent></Card>}

              {activeStep === "guardado" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Cloud className="size-5 text-primary" /> Destino de almacenamiento</CardTitle><CardDescription>Define dónde guardar los datos extraídos y los archivos PDF originales.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6"><div className="grid gap-3 sm:grid-cols-3">{[{id: "cloud", icon: Cloud, title: "Nube", text: "PDF y documentos"}, {id: "api", icon: Server, title: "API", text: "Enviar datos"}, {id: "database", icon: Database, title: "Base de datos", text: "Persistir registros"}].map(({id, icon: Icon, title, text}) => <button key={id} onClick={() => setStorage(id as typeof storage)} className={cn("rounded-xl border p-4 text-left", storage === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}><Icon className="mb-3 size-5 text-primary" /><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></button>)}</div><div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="destination">Nombre del destino</Label><Input id="destination" placeholder={storage === "cloud" ? "facturas-produccion" : storage === "api" ? "https://api.empresa.com/facturas" : "facturacion_electronica"} /></div><div className="flex flex-col gap-2"><Label htmlFor="storage-token">Credencial o token</Label><Input id="storage-token" type="password" placeholder="••••••••••••••••" /></div></div></CardContent></Card>}

              <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 sm:px-5">{saved ? <p className="flex items-center gap-2 text-sm text-primary"><Check className="size-4" /> Configuración guardada localmente</p> : <p className="text-sm text-muted-foreground">Paso {steps.findIndex((step) => step.id === activeStep) + 1} de {steps.length}</p>}<Button onClick={goNext}>{activeStep === "guardado" ? <><Save data-icon="inline-start" /> Guardar configuración</> : <>Continuar <ArrowRight data-icon="inline-end" /></>}</Button></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
