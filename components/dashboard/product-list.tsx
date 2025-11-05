"use client"

import type { Product } from "@/lib/types/product"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Power, PowerOff, Plus, Minus, Copy, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { formatPrice } from "@/lib/utils/format-price"
import { useLanguage } from "@/lib/contexts/language-context"

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onTogglePublish: (product: Product) => void
  onToggleActive: (product: Product) => void
  onUpdateStock: (productId: string, change: number) => void
}

export function ProductList({
  products,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleActive,
  onUpdateStock,
}: ProductListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { language } = useLanguage()

  const handleCopyCode = async (code: string, productId: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(productId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex gap-4 p-4 rounded-lg border border-primary/10 bg-background/50 hover:border-primary/20 transition-colors"
        >
          {/* Image */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-background">
            <Image
              src={product.images[0] || "/placeholder.svg?height=200&width=200"}
              alt={product.name}
              fill
              className="object-contain p-1"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-primary text-primary-foreground">{product.store}</Badge>
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                  {product.codigoPostagem && (
                    <Badge variant="outline" className="font-mono border-primary/20">
                      #{product.codigoPostagem}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-lg font-bold text-primary whitespace-nowrap">{formatPrice(product.price, language)}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span>Estoque: {product.stock}</span>
              <span>•</span>
              <span>Views: {product.views}</span>
              <span>•</span>
              <Badge variant={product.published ? "default" : "secondary"}>
                {product.published ? "Publicado" : "Não publicado"}
              </Badge>
              <Badge variant={product.active ? "default" : "secondary"}>{product.active ? "Ativo" : "Inativo"}</Badge>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {product.codigoPostagem && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/20 bg-transparent"
                  onClick={() => handleCopyCode(product.codigoPostagem!, product.id)}
                >
                  {copiedId === product.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copiar Código
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 bg-transparent"
                onClick={() => onEdit(product)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 bg-transparent"
                onClick={() => onTogglePublish(product)}
              >
                {product.published ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {product.published ? "Despublicar" : "Publicar"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 bg-transparent"
                onClick={() => onToggleActive(product)}
              >
                {product.active ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                {product.active ? "Desativar" : "Ativar"}
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/20 bg-transparent px-2"
                  onClick={() => onUpdateStock(product.id, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/20 bg-transparent px-2"
                  onClick={() => onUpdateStock(product.id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent ml-auto"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
