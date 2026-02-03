"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

const logSteps = [
  { id: 1, name: "Webhook HTTP", status: "success", duration: "0.2s", timestamp: "14:32:15.123" },
  { id: 2, name: "Validar datos", status: "success", duration: "0.1s", timestamp: "14:32:15.323" },
  { id: 3, name: "Consultar DB", status: "success", duration: "1.2s", timestamp: "14:32:15.423" },
  { id: 4, name: "Verificar resultado", status: "success", duration: "0.1s", timestamp: "14:32:16.623" },
  { id: 5, name: "Enviar notificación", status: "success", duration: "0.7s", timestamp: "14:32:16.723" },
]

export function LogDetailModal({ logId, onClose }: { logId: string; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass border-border max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Detalle de Ejecución: {logId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Estado</p>
              <Badge variant="default">Exitoso</Badge>
            </div>
            <div className="glass rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Duración Total</p>
              <p className="text-lg font-semibold text-foreground">2.3s</p>
            </div>
            <div className="glass rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Pasos Ejecutados</p>
              <p className="text-lg font-semibold text-foreground">5/5</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Timeline de Ejecución</h3>
            <div className="space-y-3">
              {logSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step.status === "success" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {step.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    {index < logSteps.length - 1 && <div className="w-0.5 h-12 bg-border mt-1"></div>}
                  </div>

                  <div className="flex-1 glass rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{step.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{step.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
