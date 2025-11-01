"use client"

import type { Product } from "@/lib/types/product"
import { ProductCard } from "./product-card"
import { useLanguage } from "@/lib/contexts/language-context"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onViewOffer: (product: Product) => void
}

export function ProductGrid({ products, onAddToCart, onViewOffer }: ProductGridProps) {
  const { t } = useLanguage()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-xl text-muted-foreground mb-2">{t("home.noProducts")}</p>
        <p className="text-sm text-muted-foreground">{t("home.clearFilters")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewOffer={onViewOffer} />
      ))}
    </div>
  )
}
