"use client"

import { usePWA } from "@/lib/hooks/use-pwa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import { useState } from "react"

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!isInstallable || dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
      <Card className="border-primary/20 bg-card/95 backdrop-blur shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Instalar App</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Instale o Achadinhos Xpress para acesso rápido e notificações
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={installApp}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Instalar
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setDismissed(true)}>
                  Agora não
                </Button>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-muted-foreground"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
