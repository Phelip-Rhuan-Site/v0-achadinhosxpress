"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsTab } from "@/components/dashboard/products-tab"
import { ReportsTab } from "@/components/dashboard/reports-tab"
import { AdminsTab } from "@/components/dashboard/admins-tab"
import { ConfigTab } from "@/components/dashboard/config-tab"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, isAdmin, loading, userRole } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log(
      "[v0] Dashboard - loading:",
      loading,
      "mounted:",
      mounted,
      "user:",
      user?.email,
      "userRole:",
      userRole,
      "isAdmin:",
      isAdmin,
    )
  }, [loading, mounted, user, userRole, isAdmin])

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) {
        console.log("[v0] Dashboard - No user, redirecting to login")
        router.push("/auth/login")
      } else if (!isAdmin) {
        console.log("[v0] Dashboard - User is not admin, showing error")
      }
    }
  }, [user, isAdmin, loading, mounted, router])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-destructive/10 border border-destructive rounded-lg p-6 space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Sem permissão</h1>
            <p className="text-foreground">
              Você precisa ser administrador para acessar esta seção. Configure o primeiro admin no Firebase Console.
            </p>
            <div className="mt-4 p-3 bg-muted rounded text-sm space-y-1">
              <p className="font-semibold">Informações de debug:</p>
              <p>Email: {user?.email}</p>
              <p>Role: {userRole || "não encontrado"}</p>
              <p>É Admin: {isAdmin ? "sim" : "não"}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Se você já configurou o admin no Firebase, verifique:
              <br />
              1. Se o email está correto no documento invites
              <br />
              2. Se o role está definido como "ADM Master"
              <br />
              3. Se as regras do Firestore permitem leitura da coleção invites
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Dashboard Administrativo</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/")}
            className="border-primary/20 hover:bg-primary/10"
            title="Fechar dashboard"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-card border border-primary/20">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Relatórios
            </TabsTrigger>
            <TabsTrigger
              value="admins"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Administradores
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="admins">
            <AdminsTab />
          </TabsContent>

          <TabsContent value="config">
            <ConfigTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
