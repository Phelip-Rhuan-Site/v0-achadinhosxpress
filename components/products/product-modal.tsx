"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types/product"
import { ExternalLink, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES } from "@/lib/types/categories"

interface ProductModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductModal({ product, open, onClose, onAddToCart }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { toast } = useToast()

  if (!product) return null

  const category = CATEGORIES.find((c) => c.id === product.category)
  const images = product.images || []
  const hasMultipleImages = images.length > 1

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Confira esta oferta: ${product.name} por R$ ${product.price.toFixed(2)}`,
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
    // Log buy_click event
    console.log("[Event] buy_click:", product.id)

    // Open product URL in new tab
    window.open(product.url, "_blank", "noopener,noreferrer")
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Media */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-background/50 rounded-lg overflow-hidden">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs text-foreground">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? "border-primary" : "border-primary/20"
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
              <div className="rounded-lg overflow-hidden bg-background/50">
                <video controls className="w-full" controlsList="nodownload">
                  <source src={product.video} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Price and Store */}
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
              <Badge className="bg-primary text-primary-foreground">{product.store}</Badge>
            </div>

            {/* Category */}
            {category && (
              <div>
                <p className="text-sm text-muted-foreground">Categoria</p>
                <p className="text-foreground font-medium">{category.name}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Descrição</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

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

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleBuy}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Comprar
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/20 text-foreground hover:bg-primary/10 bg-transparent"
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
                  className="border-primary/20 text-foreground hover:bg-primary/10 bg-transparent"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
