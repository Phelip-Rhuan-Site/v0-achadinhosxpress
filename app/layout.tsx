import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { Toaster } from "@/components/ui/toaster"
import { FaviconUpdater } from "@/components/favicon-updater"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = "/icon-192.jpg"

  return {
    title: "Achadinhos Xpress - Ofertas Imperdíveis",
    description: "Encontre as melhores ofertas das principais lojas em um só lugar",
    generator: "v0.app",
    manifest: "/manifest.json",
    themeColor: "#000000",
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Achadinhos Xpress",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <FaviconUpdater />
            {children}
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
