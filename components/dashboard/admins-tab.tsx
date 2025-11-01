"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/lib/contexts/auth-context"
import { addAdminInvite } from "@/lib/firebase/auth-helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, UserPlus } from "lucide-react"

interface AdminInvite {
  email: string
  role: string
  createdAt: Date
  createdBy?: string
}

export function AdminsTab() {
  const [admins, setAdmins] = useState<AdminInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("admin")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const snapshot = await getDocs(collection(db, "invites"))
      const fetchedAdmins = snapshot.docs.map((doc) => ({
        email: doc.id,
        ...doc.data(),
      })) as AdminInvite[]
      setAdmins(fetchedAdmins)
    } catch (error: any) {
      console.error("Error fetching admins:", error)
      if (error?.code === "permission-denied") {
        toast({
          title: "Sem permissão",
          description:
            "Você precisa ser administrador para acessar esta seção. Configure o primeiro admin no Firebase Console.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro ao carregar administradores",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEmail || !newRole) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Erro",
        description: "E-mail inválido",
        variant: "destructive",
      })
      return
    }

    try {
      const { success, error } = await addAdminInvite(newEmail, newRole, user?.email || "unknown")

      if (success) {
        toast({
          title: "Administrador adicionado",
          description: `${newEmail} foi adicionado como ${newRole}`,
        })
        setNewEmail("")
        setNewRole("admin")
        fetchAdmins()
      } else {
        toast({
          title: "Erro ao adicionar administrador",
          description: error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding admin:", error)
      toast({
        title: "Erro ao adicionar administrador",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Tem certeza que deseja remover ${email}?`)) return

    try {
      await deleteDoc(doc(db, "invites", email))
      toast({
        title: "Administrador removido",
        description: `${email} foi removido`,
      })
      fetchAdmins()
    } catch (error) {
      console.error("Error removing admin:", error)
      toast({
        title: "Erro ao remover administrador",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Admin Form */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Adicionar Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Função
                </Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/20">
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="moderator">Moderador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Administrador
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Admin List */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Administradores ({admins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum administrador cadastrado</div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.email}
                  className="flex items-center justify-between p-4 rounded-lg border border-primary/10 bg-background/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{admin.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Função: {admin.role} • Adicionado por: {admin.createdBy || "Sistema"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent"
                    onClick={() => handleRemoveAdmin(admin.email)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
