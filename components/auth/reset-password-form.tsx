"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/firebase/auth-helpers"
import { Loader2 } from "lucide-react"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { success, error } = await resetPassword(email)

    if (error) {
      toast({
        title: "Erro ao enviar e-mail",
        description: error,
        variant: "destructive",
      })
    } else if (success) {
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      })
      router.push("/auth/login")
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Recuperar Senha</CardTitle>
        <CardDescription className="text-muted-foreground">
          Digite seu e-mail para receber instruções de recuperação
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-primary/20 text-foreground"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar E-mail"
            )}
          </Button>
          <Link href="/auth/login" className="text-primary hover:text-primary/80 text-sm font-medium">
            Voltar para login
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
