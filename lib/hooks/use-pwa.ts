"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // PWA will still work for installation via manifest.json

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      console.log("[PWA] App installed")
      setIsInstallable(false)
      setDeferredPrompt(null)
      toast({
        title: "App instalado!",
        description: "Achadinhos Xpress foi instalado com sucesso",
      })
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [toast])

  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log("[PWA] User choice:", outcome)

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return { isInstallable, installApp }
}
