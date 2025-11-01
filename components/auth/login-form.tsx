"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import { loginUser } from "@/lib/firebase/auth-helpers"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { user, error } = await loginUser(email, password)

    if (error) {
      toast({
        title: t("common.error"),
        description: error,
        variant: "destructive",
      })
    } else if (user) {
      toast({
        title: t("common.success"),
        description: t("auth.login"),
      })
      router.push("/")
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{t("auth.login")}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("auth.email")} {t("auth.password").toLowerCase()}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              {t("auth.email")}
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
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              {t("auth.password")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                {t("auth.loggingIn")}
              </>
            ) : (
              t("auth.login")
            )}
          </Button>
          <div className="flex flex-col gap-2 text-sm text-center w-full">
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/80"
              onClick={() => router.push("/auth/register")}
            >
              {t("auth.noAccount")}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/auth/reset-password")}
            >
              {t("auth.forgotPassword")}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
