"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

interface SiteConfig {
  siteName?: string
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
  socialMedia?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    whatsappChannel?: string
  }
}

export function Footer() {
  const [config, setConfig] = useState<SiteConfig>({})

  useEffect(() => {
    console.log("[v0] Footer: Fetching config...")
    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, "meta", "config"))
        if (configDoc.exists()) {
          const data = configDoc.data() as SiteConfig
          console.log("[v0] Footer: Config loaded:", data)
          setConfig(data)
        } else {
          console.log("[v0] Footer: No config found")
        }
      } catch (error: any) {
        if (error?.code !== "permission-denied") {
          console.error("[v0] Footer: Error fetching config:", error)
        }
      }
    }
    fetchConfig()
  }, [])

  return (
    <footer className="border-t border-primary/20 bg-background/95 backdrop-blur mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">{config.siteName || "Achadinhos Xpress"}</h3>
            <p className="text-sm text-muted-foreground">
              Encontre as melhores ofertas das principais lojas em um só lugar.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:hidden">
            <h3 className="text-lg font-semibold text-primary mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              {config.socialMedia?.facebook && (
                <a
                  href={config.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {config.socialMedia?.instagram && (
                <a
                  href={config.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {config.socialMedia?.tiktok && (
                <a
                  href={config.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
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
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              )}
              {config.socialMedia?.whatsappChannel && (
                <a
                  href={config.socialMedia.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="sr-only">Canal WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Contact - Desktop */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold text-primary mb-4">Contato</h3>
            {config.contact?.email && config.contact.email.trim() !== "" && (
              <p className="text-sm text-muted-foreground">{config.contact.email}</p>
            )}
            {config.contact?.phone && config.contact.phone.trim() !== "" && (
              <p className="text-sm text-muted-foreground mt-2">{config.contact.phone}</p>
            )}
            {!config.contact?.email && !config.contact?.phone && (
              <p className="text-sm text-muted-foreground">Configure as informações de contato no dashboard</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {config.siteName || "Achadinhos Xpress"}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
