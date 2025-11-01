"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, Loader2, X, ImageIcon } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"

interface SiteConfig {
  notificationText?: string
  logoUrl?: string
  faviconUrl?: string
  siteName?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    whatsappChannel?: string
    tiktok?: string
  }
  contact?: {
    email?: string
    phone?: string
    address?: string
    businessHours?: {
      weekdays?: string
      saturday?: string
      sunday?: string
    }
  }
}

export function ConfigTab() {
  const [config, setConfig] = useState<SiteConfig>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const [logoDragging, setLogoDragging] = useState(false)
  const [faviconDragging, setFaviconDragging] = useState(false)
  const { toast } = useToast()
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      console.log("[v0] Fetching config...")
      const configDoc = await getDoc(doc(db, "meta", "config"))
      if (configDoc.exists()) {
        const data = configDoc.data() as SiteConfig
        console.log("[v0] Config loaded:", data)
        setConfig(data)
      }
    } catch (error: any) {
      console.error("[v0] Error fetching config:", error)
      if (error?.code === "permission-denied") {
        toast({
          title: "Sem permissão",
          description: "Você precisa ser administrador para acessar configurações.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!user) {
      console.error("[v0] Save config failed: User not authenticated")
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para salvar configurações",
        variant: "destructive",
      })
      return
    }

    if (!isAdmin) {
      console.error("[v0] Save config failed: User is not admin")
      toast({
        title: "Sem permissão",
        description: "Você precisa ser administrador para salvar configurações",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    console.log("[v0] Starting config save...")
    console.log("[v0] User:", user.email)
    console.log("[v0] Is Admin:", isAdmin)

    try {
      const updatedConfig: SiteConfig = {
        notificationText: config.notificationText || "",
        logoUrl: config.logoUrl || "",
        faviconUrl: config.faviconUrl || "",
        siteName: "Achadinhos Xpress",
      }

      updatedConfig.socialMedia = {
        facebook: config.socialMedia?.facebook || "",
        instagram: config.socialMedia?.instagram || "",
        twitter: config.socialMedia?.twitter || "",
        youtube: config.socialMedia?.youtube || "",
        whatsappChannel: config.socialMedia?.whatsappChannel || "",
        tiktok: config.socialMedia?.tiktok || "",
      }

      updatedConfig.contact = {
        email: config.contact?.email || "",
        phone: config.contact?.phone || "",
        address: config.contact?.address || "",
        businessHours: {
          weekdays: config.contact?.businessHours?.weekdays || "",
          saturday: config.contact?.businessHours?.saturday || "",
          sunday: config.contact?.businessHours?.sunday || "",
        },
      }

      console.log("[v0] Saving config to Firestore:", updatedConfig)
      await setDoc(doc(db, "meta", "config"), updatedConfig)
      console.log("[v0] Config saved successfully!")

      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso",
      })

      setConfig(updatedConfig)
    } catch (error: any) {
      console.error("[v0] Error saving config:", error)
      console.error("[v0] Error code:", error?.code)
      console.error("[v0] Error message:", error?.message)

      let errorMessage = "Tente novamente mais tarde"

      if (error?.code === "permission-denied") {
        errorMessage = "Você não tem permissão para salvar configurações. Verifique se você é administrador."
      } else if (error?.code === "unavailable") {
        errorMessage = "Não foi possível conectar ao Firebase. Verifique sua conexão."
      }

      toast({
        title: "Erro ao salvar configurações",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportBackup = async () => {
    try {
      const collections = ["products", "invites", "meta"]
      const backup: any = {}

      for (const collectionName of collections) {
        const snapshot = await getDoc(doc(db, collectionName, "backup"))
        if (snapshot.exists()) {
          backup[collectionName] = snapshot.data()
        }
      }

      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `backup_${new Date().toISOString()}.json`
      link.click()

      toast({
        title: "Backup exportado",
        description: "O backup foi baixado com sucesso",
      })
    } catch (error) {
      console.error("Error exporting backup:", error)
      toast({
        title: "Erro ao exportar backup",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const backup = JSON.parse(text)

      for (const [collectionName, data] of Object.entries(backup)) {
        await setDoc(doc(db, collectionName as string, "backup"), data as any)
      }

      toast({
        title: "Backup importado",
        description: "O backup foi restaurado com sucesso",
      })

      fetchConfig()
    } catch (error) {
      console.error("Error importing backup:", error)
      toast({
        title: "Erro ao importar backup",
        description: "Arquivo inválido ou corrompido",
        variant: "destructive",
      })
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 500 * 1024) {
        reject(new Error("Imagem muito grande. Máximo 500KB."))
        return
      }

      if (!file.type.startsWith("image/")) {
        reject(new Error("Arquivo deve ser uma imagem."))
        return
      }

      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Erro ao ler arquivo."))
      reader.readAsDataURL(file)
    })
  }

  const handleLogoFileUpload = async (file: File) => {
    try {
      const base64 = await convertImageToBase64(file)
      setConfig({ ...config, logoUrl: base64 })
      toast({
        title: "Logo carregada",
        description: "A logo foi carregada com sucesso",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao carregar logo",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleFaviconFileUpload = async (file: File) => {
    try {
      const base64 = await convertImageToBase64(file)
      setConfig({ ...config, faviconUrl: base64 })
      toast({
        title: "Favicon carregado",
        description: "O favicon foi carregado com sucesso",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao carregar favicon",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setLogoDragging(true)
  }

  const handleLogoDragLeave = () => {
    setLogoDragging(false)
  }

  const handleLogoDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setLogoDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      await handleLogoFileUpload(file)
    }
  }

  const handleFaviconDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setFaviconDragging(true)
  }

  const handleFaviconDragLeave = () => {
    setFaviconDragging(false)
  }

  const handleFaviconDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setFaviconDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      await handleFaviconFileUpload(file)
    }
  }

  const handleLogoPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile()
        if (file) {
          await handleLogoFileUpload(file)
        }
        break
      }
    }
  }

  const handleFaviconPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile()
        if (file) {
          await handleFaviconFileUpload(file)
        }
        break
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Logo and Favicon */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Logo e Favicon</CardTitle>
          <CardDescription className="text-muted-foreground">
            Arraste e solte imagens, cole (Ctrl+V) ou clique para selecionar. Máximo 500KB por imagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Logo do Site</Label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  logoDragging
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 hover:border-primary/40 bg-background/50"
                }`}
                onDragOver={handleLogoDragOver}
                onDragLeave={handleLogoDragLeave}
                onDrop={handleLogoDrop}
                onPaste={handleLogoPaste}
              >
                {config.logoUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={config.logoUrl || "/placeholder.svg"}
                      alt="Logo preview"
                      className="h-16 w-auto object-contain bg-white/5 rounded p-2"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">Logo carregada</p>
                      <p className="text-xs text-muted-foreground">
                        {config.logoUrl.startsWith("data:") ? "Imagem em base64" : "URL externa"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfig({ ...config, logoUrl: "" })}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-foreground mb-1">Arraste uma imagem ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG ou GIF - Máximo 500KB</p>
                  </div>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleLogoFileUpload(file)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-sm text-muted-foreground">
                  Ou cole uma URL de imagem externa
                </Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={config.logoUrl?.startsWith("data:") ? "" : config.logoUrl || ""}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="https://i.imgur.com/sua-logo.png"
                  className="bg-background/50 border-primary/20 text-foreground"
                  disabled={config.logoUrl?.startsWith("data:")}
                />
                <p className="text-xs text-muted-foreground">Recomendado: 200x50px (PNG transparente)</p>
              </div>
            </div>

            {/* Favicon Upload */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Favicon</Label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  faviconDragging
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 hover:border-primary/40 bg-background/50"
                }`}
                onDragOver={handleFaviconDragOver}
                onDragLeave={handleFaviconDragLeave}
                onDrop={handleFaviconDrop}
                onPaste={handleFaviconPaste}
              >
                {config.faviconUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={config.faviconUrl || "/placeholder.svg"}
                      alt="Favicon preview"
                      className="h-8 w-8 object-contain bg-white/5 rounded p-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">Favicon carregado</p>
                      <p className="text-xs text-muted-foreground">
                        {config.faviconUrl.startsWith("data:") ? "Imagem em base64" : "URL externa"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfig({ ...config, faviconUrl: "" })}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-foreground mb-1">Arraste uma imagem ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground">PNG, ICO ou JPG - Máximo 500KB</p>
                  </div>
                )}

                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFaviconFileUpload(file)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl" className="text-sm text-muted-foreground">
                  Ou cole uma URL de imagem externa
                </Label>
                <Input
                  id="faviconUrl"
                  type="url"
                  value={config.faviconUrl?.startsWith("data:") ? "" : config.faviconUrl || ""}
                  onChange={(e) => setConfig({ ...config, faviconUrl: e.target.value })}
                  placeholder="https://i.imgur.com/seu-favicon.png"
                  className="bg-background/50 border-primary/20 text-foreground"
                  disabled={config.faviconUrl?.startsWith("data:")}
                />
                <p className="text-xs text-muted-foreground">Recomendado: 32x32px ou 64x64px (PNG ou ICO)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Bar */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Barra de Notificação</CardTitle>
          <CardDescription className="text-muted-foreground">
            Texto que aparecerá no topo do site para avisos importantes (promoções, frete grátis, etc). Deixe em branco
            para desativar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notification" className="text-foreground">
              Texto da Notificação
            </Label>
            <Textarea
              id="notification"
              value={config.notificationText || ""}
              onChange={(e) => setConfig({ ...config, notificationText: e.target.value })}
              placeholder="Digite o texto que aparecerá na barra de notificação"
              rows={3}
              className="bg-background/50 border-primary/20 text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Informações de Contato</CardTitle>
          <CardDescription className="text-muted-foreground">
            Estas informações aparecerão na página de contato e no rodapé do site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-foreground">
                Email de Contato
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={config.contact?.email || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, email: e.target.value },
                  })
                }
                placeholder="contato@achadinhosxpress.com"
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-foreground">
                Telefone
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                value={config.contact?.phone || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, phone: e.target.value },
                  })
                }
                placeholder="+55 (11) 9999-9999"
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddress" className="text-foreground">
                Endereço
              </Label>
              <Input
                id="contactAddress"
                value={config.contact?.address || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, address: e.target.value },
                  })
                }
                placeholder="São Paulo, SP - Brasil"
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/20">
              <Label className="text-foreground font-semibold">Horário de Atendimento</Label>

              <div className="space-y-2">
                <Label htmlFor="weekdaysHours" className="text-foreground text-sm">
                  Segunda - Sexta
                </Label>
                <Input
                  id="weekdaysHours"
                  value={config.contact?.businessHours?.weekdays || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contact: {
                        ...config.contact,
                        businessHours: { ...config.contact?.businessHours, weekdays: e.target.value },
                      },
                    })
                  }
                  placeholder="9:00 - 18:00"
                  className="bg-background/50 border-primary/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="saturdayHours" className="text-foreground text-sm">
                  Sábado
                </Label>
                <Input
                  id="saturdayHours"
                  value={config.contact?.businessHours?.saturday || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contact: {
                        ...config.contact,
                        businessHours: { ...config.contact?.businessHours, saturday: e.target.value },
                      },
                    })
                  }
                  placeholder="9:00 - 13:00"
                  className="bg-background/50 border-primary/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sundayHours" className="text-foreground text-sm">
                  Domingo
                </Label>
                <Input
                  id="sundayHours"
                  value={config.contact?.businessHours?.sunday || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contact: {
                        ...config.contact,
                        businessHours: { ...config.contact?.businessHours, sunday: e.target.value },
                      },
                    })
                  }
                  placeholder="Fechado"
                  className="bg-background/50 border-primary/20 text-foreground"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Redes Sociais</CardTitle>
          <CardDescription className="text-muted-foreground">
            Os ícones só aparecerão no site se você preencher os links. Deixe em branco para ocultar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-foreground">
                Facebook
              </Label>
              <Input
                id="facebook"
                type="url"
                value={config.socialMedia?.facebook || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    socialMedia: { ...config.socialMedia, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/..."
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-foreground">
                Instagram
              </Label>
              <Input
                id="instagram"
                type="url"
                value={config.socialMedia?.instagram || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    socialMedia: { ...config.socialMedia, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-foreground">
                Twitter
              </Label>
              <Input
                id="twitter"
                type="url"
                value={config.socialMedia?.twitter || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    socialMedia: { ...config.socialMedia, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/..."
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube" className="text-foreground">
                YouTube
              </Label>
              <Input
                id="youtube"
                type="url"
                value={config.socialMedia?.youtube || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    socialMedia: { ...config.socialMedia, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/..."
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok" className="text-foreground">
                TikTok
              </Label>
              <Input
                id="tiktok"
                type="url"
                value={config.socialMedia?.tiktok || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    socialMedia: { ...config.socialMedia, tiktok: e.target.value },
                  })
                }
                placeholder="https://tiktok.com/@..."
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatsappChannel" className="text-foreground">
                Canal do WhatsApp
              </Label>
              <Input
                id="whatsappChannel"
                type="url"
                value={config.socialMedia?.whatsappChannel || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    socialMedia: { ...config.socialMedia, whatsappChannel: e.target.value },
                  })
                }
                placeholder="https://whatsapp.com/channel/..."
                className="bg-background/50 border-primary/20 text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Backup e Restauração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-primary/20 bg-transparent" onClick={handleExportBackup}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Backup
            </Button>

            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="border-primary/20 bg-transparent" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Backup
                </span>
              </Button>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            O backup inclui produtos, administradores e configurações do site
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSaveConfig}
          disabled={saving || !user || !isAdmin}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </Button>
      </div>
    </div>
  )
}
