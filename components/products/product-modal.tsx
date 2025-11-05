"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types/product"
import { ExternalLink, Share2, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES } from "@/lib/types/categories"
import { formatPrice } from "@/lib/utils/format-price"
import { useLanguage } from "@/lib/contexts/language-context"
import { useAuth } from "@/lib/contexts/auth-context"

interface ProductModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductModal({ product, open, onClose, onAddToCart }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)
  const { toast } = useToast()
  const { language } = useLanguage()
  const { isAdmin } = useAuth()

  if (!product) return null

  const category = CATEGORIES.find((c) => c.id === product.category)
  const images = product.images || []
  const hasMultipleImages = images.length > 1

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Confira esta oferta: ${product.name} por ${formatPrice(product.price, language)}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleBuy = () => {
    console.log("[Event] buy_click:", product.id)
    window.open(product.url, "_blank", "noopener,noreferrer")
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleCopyCode = async () => {
    if (product.codigoPostagem) {
      await navigator.clipboard.writeText(product.codigoPostagem)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
      toast({
        title: "Código copiado!",
        description: "O código foi copiado para a área de transferência",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-card border-primary/20 p-0">
        <div className="sticky top-0 z-10 bg-card border-b border-primary/20 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary pr-8">{product.name}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Media */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full aspect-square bg-background rounded-lg overflow-hidden border border-primary/10">
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg?height=800&width=800"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg transition-all hover:scale-110"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg transition-all hover:scale-110"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1.5 rounded-full text-sm text-foreground font-medium shadow-lg">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all hover:scale-105 ${
                        index === currentImageIndex
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Video */}
              {product.video && (
                <div className="rounded-lg overflow-hidden bg-background border border-primary/10">
                  <video controls className="w-full" controlsList="nodownload">
                    <source src={product.video} type="video/mp4" />
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {product.codigoPostagem && (
                <>
                  {isAdmin ? (
                    // Admin view: Full posting code with copy button
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Código de Postagem</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Para divulgação nas redes sociais</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary font-mono">{product.codigoPostagem}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-primary/20 bg-transparent h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                            onClick={handleCopyCode}
                          >
                            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Customer view: Simple reference code
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10">
                      <span className="text-sm text-muted-foreground">Ref:</span>
                      <span className="text-sm font-mono text-foreground">{product.codigoPostagem}</span>
                    </div>
                  )}
                </>
              )}

              {/* Price and Store */}
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-primary">{formatPrice(product.price, language)}</p>
                <Badge className="bg-primary text-primary-foreground text-base px-4 py-1">{product.store}</Badge>
              </div>

              {/* Category */}
              {category && (
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="text-foreground font-medium">{category.name}</p>
                </div>
              )}

              {/* Characteristics */}
              {category && product.characteristics && Object.keys(product.characteristics).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Características</h3>
                  <div className="space-y-2">
                    {category.fields.map((field) => {
                      const value = product.characteristics[field.name]
                      if (!value) return null

                      return (
                        <div key={field.name} className="flex justify-between py-2 border-b border-primary/10">
                          <span className="text-muted-foreground">{field.label}</span>
                          <span className="text-foreground font-medium">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Descrição</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 sticky bottom-0 bg-card pb-4">
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-12 transition-all hover:scale-[1.02]"
                  onClick={handleBuy}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Comprar
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/20 text-foreground hover:bg-primary/10 bg-transparent transition-all hover:scale-[1.02]"
                    onClick={() => {
                      onAddToCart(product)
                      toast({
                        title: "Adicionado ao carrinho",
                        description: product.name,
                      })
                    }}
                  >
                    Adicionar ao carrinho
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/20 text-foreground hover:bg-primary/10 bg-transparent transition-all hover:scale-[1.02]"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
