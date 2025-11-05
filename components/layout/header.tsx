"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/contexts/auth-context"
import { useLanguage } from "@/lib/contexts/language-context"
import { logoutUser } from "@/lib/firebase/auth-helpers"
import { useToast } from "@/hooks/use-toast"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Globe, Facebook, Instagram, Youtube } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface HeaderProps {
  onSearch?: (query: string) => void
}

interface SiteConfig {
  logoUrl?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    whatsappChannel?: string
  }
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [config, setConfig] = useState<SiteConfig>({})
  const { user, isAdmin } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, "meta", "config"))
        if (configDoc.exists()) {
          setConfig(configDoc.data() as SiteConfig)
        }
      } catch (error: any) {
        if (error?.code !== "permission-denied") {
          console.error("Error fetching config:", error)
        }
      }
    }
    fetchConfig()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleLogout = async () => {
    const { success, error } = await logoutUser()
    if (success) {
      toast({
        title: t("common.success"),
        description: t("header.logout"),
      })
      router.push("/")
      router.refresh()
    } else {
      toast({
        title: t("common.error"),
        description: error,
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            {config.logoUrl ? (
              <>
                <Image
                  src={config.logoUrl || "/placeholder.svg"}
                  alt={t("home.title")}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover rounded-full"
                  priority
                />
                <h1 className="text-xl md:text-2xl font-bold text-white hover:text-white/80 transition-colors">
                  {t("home.title")}
                </h1>
              </>
            ) : (
              <h1 className="text-xl md:text-2xl font-bold text-white hover:text-white/80 transition-colors">
                {t("home.title")}
              </h1>
            )}
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t("header.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 text-white"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              {config.socialMedia?.facebook && (
                <a
                  href={config.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {config.socialMedia?.instagram && (
                <a
                  href={config.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {config.socialMedia?.tiktok && (
                <a
                  href={config.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span className="sr-only">TikTok</span>
                </a>
              )}
              {config.socialMedia?.youtube && (
                <a
                  href={config.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                  <span className="sr-only">YouTube</span>
                </a>
              )}
              {config.socialMedia?.whatsappChannel && (
                <a
                  href={config.socialMedia.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="sr-only">Canal WhatsApp</span>
                </a>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-white/80 hover:bg-white/10">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-primary/20">
                <DropdownMenuItem
                  onClick={() => setLanguage("pt")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "pt" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇧🇷</span>
                  <span className="text-base">Português</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "en" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇺🇸</span>
                  <span className="text-base">English</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("es")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "es" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇪🇸</span>
                  <span className="text-base">Español</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("fr")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "fr" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇫🇷</span>
                  <span className="text-base">Français</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("de")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "de" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇩🇪</span>
                  <span className="text-base">Deutsch</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("zh")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "zh" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇨🇳</span>
                  <span className="text-base">中文</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ar")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "ar" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇸🇦</span>
                  <span className="text-base">العربية</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("hi")}
                  className={`cursor-pointer flex items-center gap-3 hover:bg-white/10 transition-colors ${language === "hi" ? "bg-white/10" : ""}`}
                >
                  <span className="text-3xl leading-none">🇮🇳</span>
                  <span className="text-base">हिन्दी</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 hover:bg-white/10"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{t("header.cart")}</span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:text-white/80 hover:bg-white/10">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t("header.myAccount")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-primary/20">
                  <div className="px-2 py-1.5 text-sm text-white">
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("header.panel")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-primary/20" />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("header.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => router.push("/auth/login")}
              >
                {t("header.login")}
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={t("header.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-primary/20 text-white"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
