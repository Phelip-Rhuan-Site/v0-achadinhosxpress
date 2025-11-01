"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/contexts/language-context"

interface ContactConfig {
  email?: string
  phone?: string
  address?: string
  businessHours?: {
    weekdays?: string
    saturday?: string
    sunday?: string
  }
}

export default function ContactPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactConfig>({
    email: "contato@achadinhosxpress.com",
    phone: "+55 (11) 9999-9999",
    address: "São Paulo, SP - Brasil",
    businessHours: {
      weekdays: "9:00 - 18:00",
      saturday: "9:00 - 13:00",
      sunday: "Fechado",
    },
  })

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log("[v0] Fetching contact info from Firestore...")
        const configDoc = await getDoc(doc(db, "meta", "config"))
        if (configDoc.exists()) {
          const data = configDoc.data()
          console.log("[v0] Config data:", data)
          if (data.contact) {
            console.log("[v0] Contact info found in nested structure, updating state")
            setContactInfo({
              email: data.contact.email || contactInfo.email,
              phone: data.contact.phone || contactInfo.phone,
              address: data.contact.address || contactInfo.address,
              businessHours: data.contact.businessHours || contactInfo.businessHours,
            })
          } else {
            console.log("[v0] No contact info in config, using defaults")
          }
        } else {
          console.log("[v0] Config document does not exist, using defaults")
        }
      } catch (error: any) {
        console.error("[v0] Error fetching contact info:", error)
        console.error("[v0] Error code:", error?.code)
      }
    }
    fetchContactInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    })

    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-muted-foreground text-lg">Tem alguma dúvida ou sugestão? Estamos aqui para ajudar!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>Preencha o formulário abaixo e responderemos em breve</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sobre o que você quer falar?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escreva sua mensagem aqui..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>Outras formas de entrar em contato conosco</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Segunda - Sexta</span>
                    <span className="text-sm font-medium">{contactInfo.businessHours?.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sábado</span>
                    <span className="text-sm font-medium">{contactInfo.businessHours?.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Domingo</span>
                    <span className="text-sm font-medium">{contactInfo.businessHours?.sunday}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
