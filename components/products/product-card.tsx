"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Product } from "@/lib/types/product"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils/format-price"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onViewOffer: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onViewOffer }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const { toast } = useToast()
  const { t, language } = useLanguage()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
    toast({
      title: t("common.success"),
      description: product.name,
    })
  }

  const handleViewOffer = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewOffer(product)
  }

  const handleCardClick = () => {
    onViewOffer(product)
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image Container - Square with contain */}
        <div className="relative w-full aspect-square bg-background/50 overflow-hidden">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=400&width=400"
                : product.images[0] || "/placeholder.svg?height=400&width=400"
            }
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {/* Store Badge */}
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">{product.store}</Badge>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-lg font-bold text-primary">{formatPrice(product.price, language)}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-primary/20 text-foreground hover:bg-primary/10 hover:text-primary bg-transparent transition-all hover:scale-[1.02]"
              onClick={handleViewOffer}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("home.viewOffer")}
            </Button>
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t("home.addToCart")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
